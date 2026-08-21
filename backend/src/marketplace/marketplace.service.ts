import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { ProfessionalProfile } from '../professionals/professional-profile.entity';
import { ProfessionalService } from '../professionals/professional-service.entity';
import { Service } from '../services/service.entity';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { CancellationReason, OrderStatus, ProposalStatus, ServiceRequestStatus } from './marketplace.enums';
import { Order } from './order.entity';
import { Proposal } from './proposal.entity';
import { ServiceRequest } from './service-request.entity';
import {
  canServiceRequestReceiveProposal,
  canTransitionOrder,
  validateServiceRequest
} from './marketplace.utils';

const requestLifetimeMilliseconds = 48 * 60 * 60 * 1000;
const proposalLifetimeMilliseconds = 24 * 60 * 60 * 1000;
const maximumProposals = 4;

@Injectable()
export class MarketplaceService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(ServiceRequest)
    private readonly requestsRepository: Repository<ServiceRequest>,
    @InjectRepository(Proposal)
    private readonly proposalsRepository: Repository<Proposal>,
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Service)
    private readonly servicesRepository: Repository<Service>,
    @InjectRepository(ProfessionalProfile)
    private readonly profilesRepository: Repository<ProfessionalProfile>
  ) {}

  async createRequest(clientId: string, dto: CreateServiceRequestDto) {
    validateServiceRequest(dto);
    const service = await this.servicesRepository.findOne({ where: { id: dto.serviceId, isActive: true } });
    if (!service) {
      throw new BadRequestException('O serviço selecionado não existe ou está indisponível.');
    }

    const request = this.requestsRepository.create({
      clientId,
      serviceId: dto.serviceId,
      description: dto.description.trim(),
      answers: dto.answers,
      attachments: [],
      address: dto.address.trim(),
      city: dto.city.trim(),
      state: dto.state.toUpperCase(),
      location:
        dto.latitude === undefined || dto.longitude === undefined
          ? null
          : { type: 'Point', coordinates: [dto.longitude, dto.latitude] },
      budgetMinimum: dto.budgetMinimum === undefined ? null : dto.budgetMinimum.toFixed(2),
      budgetMaximum: dto.budgetMaximum === undefined ? null : dto.budgetMaximum.toFixed(2),
      preferredAt: dto.preferredAt ? new Date(dto.preferredAt) : null,
      status: ServiceRequestStatus.Requested,
      proposalCount: 0,
      maximumProposals,
      expiresAt: new Date(Date.now() + requestLifetimeMilliseconds)
    });
    return this.requestsRepository.save(request);
  }

  async findOwnRequests(clientId: string) {
    await this.expireOpenRecords();
    return this.requestsRepository.find({
      where: { clientId },
      relations: { service: true },
      order: { createdAt: 'DESC' }
    });
  }

  async findOpportunities(professionalId: string) {
    await this.expireOpenRecords();
    const profile = await this.profilesRepository.findOne({
      where: { userId: professionalId, isAvailable: true }
    });
    if (!profile) {
      throw new NotFoundException('Ative seu perfil profissional para consultar oportunidades.');
    }

    const query = this.requestsRepository
      .createQueryBuilder('request')
      .innerJoinAndSelect('request.service', 'service')
      .innerJoin(
        ProfessionalService,
        'professionalService',
        'professionalService.professionalId = :professionalId AND professionalService.serviceId = request.serviceId AND professionalService.isActive = true',
        { professionalId }
      )
      .where('request.clientId <> :professionalId', { professionalId })
      .andWhere('request.status IN (:...statuses)', {
        statuses: [ServiceRequestStatus.Requested, ServiceRequestStatus.ProposalReceived]
      })
      .andWhere('request.expiresAt > now()')
      .andWhere('request.proposalCount < request.maximumProposals')
      .andWhere(
        '(request.location IS NOT NULL AND ST_DWithin(request.location, ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography, :radiusMeters)) OR (request.location IS NULL AND request.state = :state AND LOWER(request.city) = LOWER(:city))'
      )
      .setParameters({
        longitude: profile.location.coordinates[0],
        latitude: profile.location.coordinates[1],
        radiusMeters: profile.serviceRadiusKm * 1000,
        state: profile.state,
        city: profile.city
      })
      .orderBy('request.createdAt', 'DESC');

    return query.getMany();
  }

  async submitProposal(requestId: string, professionalId: string, dto: CreateProposalDto) {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const request = await manager.findOne(ServiceRequest, {
          where: { id: requestId },
          lock: { mode: 'pessimistic_write' }
        });
        if (!request) {
          throw new NotFoundException('Solicitação não encontrada.');
        }
        const professionalService = await manager.findOne(ProfessionalService, {
          where: { professionalId, serviceId: request.serviceId, isActive: true }
        });
        if (!professionalService) {
          throw new ForbiddenException('Cadastre e ative este serviço antes de enviar uma proposta.');
        }
        if (request.clientId === professionalId) {
          throw new ForbiddenException('Você não pode enviar uma proposta para a própria solicitação.');
        }
        if (!canServiceRequestReceiveProposal(request)) {
          throw new ConflictException('Esta solicitação não aceita mais propostas.');
        }

        const proposal = manager.create(Proposal, {
          requestId,
          professionalId,
          price: dto.price.toFixed(2),
          message: dto.message.trim(),
          estimatedDurationMinutes: dto.estimatedDurationMinutes,
          materialsIncluded: dto.materialsIncluded,
          travelFee: (dto.travelFee || 0).toFixed(2),
          paymentMethods: dto.paymentMethods,
          status: ProposalStatus.Sent,
          validUntil: new Date(Date.now() + proposalLifetimeMilliseconds)
        });
        await manager.save(proposal);
        request.proposalCount += 1;
        request.status = ServiceRequestStatus.ProposalReceived;
        await manager.save(request);
        return proposal;
      });
    } catch (error) {
      if (this.isUniqueConstraintViolation(error)) {
        throw new ConflictException('Você já enviou uma proposta para esta solicitação.');
      }
      throw error;
    }
  }

  async findRequestProposals(requestId: string, clientId: string) {
    await this.assertRequestOwner(requestId, clientId);
    await this.expireOpenRecords();
    return this.proposalsRepository
      .createQueryBuilder('proposal')
      .innerJoinAndSelect('proposal.professional', 'profile')
      .innerJoinAndSelect('profile.user', 'user')
      .where('proposal.requestId = :requestId', { requestId })
      .orderBy('proposal.price + proposal.travelFee', 'ASC')
      .addOrderBy('proposal.createdAt', 'ASC')
      .getMany();
  }

  async acceptProposal(requestId: string, proposalId: string, clientId: string) {
    return this.dataSource.transaction(async (manager) => {
      const request = await manager.findOne(ServiceRequest, {
        where: { id: requestId },
        lock: { mode: 'pessimistic_write' }
      });
      if (!request) {
        throw new NotFoundException('Solicitação não encontrada.');
      }
      if (request.clientId !== clientId) {
        throw new ForbiddenException('Somente o cliente da solicitação pode aceitar uma proposta.');
      }
      const proposal = await manager.findOne(Proposal, {
        where: { id: proposalId, requestId },
        lock: { mode: 'pessimistic_write' }
      });
      if (!proposal) {
        throw new NotFoundException('Proposta não encontrada para esta solicitação.');
      }
      if (
        !canServiceRequestReceiveProposal(request) ||
        proposal.status !== ProposalStatus.Sent ||
        proposal.validUntil <= new Date()
      ) {
        throw new ConflictException('A proposta não está mais disponível.');
      }

      await manager.update(Proposal, { requestId }, { status: ProposalStatus.Rejected });
      proposal.status = ProposalStatus.Accepted;
      await manager.save(proposal);
      request.status = ServiceRequestStatus.Accepted;
      await manager.save(request);

      const totalPrice = Number(proposal.price) + Number(proposal.travelFee);
      const order = manager.create(Order, {
        requestId,
        proposalId,
        clientId,
        professionalId: proposal.professionalId,
        agreedPrice: totalPrice.toFixed(2),
        scheduledAt: request.preferredAt,
        status: request.preferredAt ? OrderStatus.Scheduled : OrderStatus.Accepted,
        cancellationReason: null,
        cancellationDetails: null,
        cancelledBy: null
      });
      return manager.save(order);
    });
  }

  async findOwnOrders(userId: string) {
    return this.ordersRepository
      .createQueryBuilder('order')
      .innerJoinAndSelect('order.request', 'request')
      .innerJoinAndSelect('request.service', 'service')
      .innerJoinAndSelect('order.proposal', 'proposal')
      .where('order.clientId = :userId OR order.professionalId = :userId', { userId })
      .orderBy('order.createdAt', 'DESC')
      .getMany();
  }

  async updateOrderStatus(orderId: string, actorId: string, nextStatus: OrderStatus) {
    return this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(Order, {
        where: { id: orderId },
        lock: { mode: 'pessimistic_write' }
      });
      if (!order) {
        throw new NotFoundException('Pedido não encontrado.');
      }
      this.assertOrderParticipant(order, actorId);
      if (!canTransitionOrder(order, actorId, nextStatus)) {
        throw new ConflictException('Esta mudança de status não é permitida para o pedido atual.');
      }
      order.status = nextStatus;
      return manager.save(order);
    });
  }

  async cancelOrder(orderId: string, actorId: string, dto: CancelOrderDto) {
    return this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(Order, {
        where: { id: orderId },
        lock: { mode: 'pessimistic_write' }
      });
      if (!order) {
        throw new NotFoundException('Pedido não encontrado.');
      }
      this.assertOrderParticipant(order, actorId);
      if (
        [
          OrderStatus.Completed,
          OrderStatus.Disputed,
          OrderStatus.CancelledByClient,
          OrderStatus.CancelledByProfessional
        ].includes(order.status)
      ) {
        throw new ConflictException('Este pedido não pode mais ser cancelado.');
      }
      if (order.status === OrderStatus.InProgress && dto.reason !== CancellationReason.Other) {
        throw new BadRequestException(
          'Após o início, informe detalhes do cancelamento usando o motivo “outro”.'
        );
      }
      if (dto.reason === CancellationReason.Other && !dto.details) {
        throw new BadRequestException('Descreva o motivo do cancelamento.');
      }

      order.status =
        actorId === order.clientId ? OrderStatus.CancelledByClient : OrderStatus.CancelledByProfessional;
      order.cancellationReason = dto.reason;
      order.cancellationDetails = dto.details?.trim() || null;
      order.cancelledBy = actorId;
      return manager.save(order);
    });
  }

  async cancelRequest(requestId: string, clientId: string, dto: CancelOrderDto) {
    const request = await this.requestsRepository.findOne({ where: { id: requestId } });
    if (!request) {
      throw new NotFoundException('Solicitação não encontrada.');
    }
    if (request.clientId !== clientId) {
      throw new ForbiddenException('Somente o cliente pode cancelar a solicitação.');
    }
    if (![ServiceRequestStatus.Requested, ServiceRequestStatus.ProposalReceived].includes(request.status)) {
      throw new ConflictException('Esta solicitação não pode mais ser cancelada.');
    }
    if (dto.reason === CancellationReason.Other && !dto.details) {
      throw new BadRequestException('Descreva o motivo do cancelamento.');
    }
    request.status = ServiceRequestStatus.Cancelled;
    return this.requestsRepository.save(request);
  }

  private async assertRequestOwner(requestId: string, clientId: string) {
    const isOwner = await this.requestsRepository.exists({ where: { id: requestId, clientId } });
    if (!isOwner) {
      throw new ForbiddenException('Somente o cliente pode consultar as propostas desta solicitação.');
    }
  }

  private assertOrderParticipant(order: Order, actorId: string) {
    if (order.clientId !== actorId && order.professionalId !== actorId) {
      throw new ForbiddenException('Você não participa deste pedido.');
    }
  }

  private async expireOpenRecords() {
    await Promise.all([
      this.requestsRepository
        .createQueryBuilder()
        .update(ServiceRequest)
        .set({ status: ServiceRequestStatus.Expired })
        .where('status IN (:...statuses)', {
          statuses: [ServiceRequestStatus.Requested, ServiceRequestStatus.ProposalReceived]
        })
        .andWhere('expires_at <= now()')
        .execute(),
      this.proposalsRepository
        .createQueryBuilder()
        .update(Proposal)
        .set({ status: ProposalStatus.Expired })
        .where('status = :status', { status: ProposalStatus.Sent })
        .andWhere('valid_until <= now()')
        .execute()
    ]);
  }

  private isUniqueConstraintViolation(error: unknown) {
    return typeof error === 'object' && error !== null && 'code' in error && error.code === '23505';
  }
}

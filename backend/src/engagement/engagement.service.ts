import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OrderStatus } from '../marketplace/marketplace.enums';
import { Order } from '../marketplace/order.entity';
import { ProfessionalProfile } from '../professionals/professional-profile.entity';
import { toPublicProfessionalProfile } from '../professionals/professional-profile.utils';
import { CreateReviewDto } from './dto/create-review.dto';
import { Favorite } from './favorite.entity';
import { Review } from './review.entity';

@Injectable()
export class EngagementService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoritesRepository: Repository<Favorite>,
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(ProfessionalProfile)
    private readonly profilesRepository: Repository<ProfessionalProfile>
  ) {}

  async addFavorite(clientId: string, professionalId: string) {
    if (clientId === professionalId) {
      throw new ConflictException('Você não pode favoritar o próprio perfil.');
    }
    const professionalExists = await this.profilesRepository.exists({
      where: { userId: professionalId, isAvailable: true }
    });
    if (!professionalExists) {
      throw new NotFoundException('Perfil profissional não encontrado.');
    }
    await this.favoritesRepository.upsert({ clientId, professionalId }, ['clientId', 'professionalId']);
    return { isFavorite: true };
  }

  async removeFavorite(clientId: string, professionalId: string) {
    await this.favoritesRepository.delete({ clientId, professionalId });
    return { isFavorite: false };
  }

  async findFavorites(clientId: string) {
    const favorites = await this.favoritesRepository.find({
      where: { clientId },
      relations: { professional: { user: true, services: { service: true } } },
      order: { createdAt: 'DESC' }
    });
    return favorites.map((favorite) => ({
      createdAt: favorite.createdAt,
      professional: toPublicProfessionalProfile(favorite.professional)
    }));
  }

  async createReview(orderId: string, clientId: string, dto: CreateReviewDto) {
    const order = await this.ordersRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException('Pedido não encontrado.');
    }
    if (order.clientId !== clientId) {
      throw new ForbiddenException('Somente o cliente deste pedido pode avaliá-lo.');
    }
    if (order.status !== OrderStatus.Completed) {
      throw new ConflictException('A avaliação só pode ser enviada após a conclusão do serviço.');
    }
    const reviewExists = await this.reviewsRepository.exists({ where: { orderId } });
    if (reviewExists) {
      throw new ConflictException('Este pedido já foi avaliado.');
    }
    return this.reviewsRepository.save(
      this.reviewsRepository.create({
        orderId,
        clientId,
        professionalId: order.professionalId,
        rating: dto.rating,
        comment: dto.comment.trim(),
        professionalResponse: null,
        respondedAt: null,
        isPublished: true
      })
    );
  }

  async respondReview(reviewId: string, professionalId: string, response: string) {
    const review = await this.reviewsRepository.findOne({ where: { id: reviewId } });
    if (!review) {
      throw new NotFoundException('Avaliação não encontrada.');
    }
    if (review.professionalId !== professionalId) {
      throw new ForbiddenException('Somente o profissional avaliado pode publicar uma resposta.');
    }
    if (review.professionalResponse) {
      throw new ConflictException('Esta avaliação já possui uma resposta pública.');
    }
    review.professionalResponse = response.trim();
    review.respondedAt = new Date();
    return this.reviewsRepository.save(review);
  }

  async findProfessionalReviews(professionalId: string) {
    const [reviews, total] = await this.reviewsRepository.findAndCount({
      where: { professionalId, isPublished: true },
      relations: { client: true },
      order: { createdAt: 'DESC' }
    });
    const ratingAverage = total
      ? Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / total) * 10) / 10
      : null;
    return {
      reviews: reviews.map((review) => ({
        id: review.id,
        orderId: review.orderId,
        clientName: review.client.name,
        rating: review.rating,
        comment: review.comment,
        professionalResponse: review.professionalResponse,
        respondedAt: review.respondedAt,
        createdAt: review.createdAt
      })),
      total,
      ratingAverage
    };
  }
}

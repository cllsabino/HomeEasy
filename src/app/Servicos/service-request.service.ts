import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { map } from 'rxjs/operators';

import { OrderStatus, Pedido } from '../Usuarios/pedido';
import { ServiceProposal, ServiceProposalStatus, ServiceRequest } from '../shared/models/service-request';

const requestLifetimeInMilliseconds = 48 * 60 * 60 * 1000;
const maximumRequestProposals = 4;

@Injectable({
  providedIn: 'root'
})
export class ServiceRequestService {
  private requestsCollection: AngularFirestoreCollection<ServiceRequest>;

  constructor(private afs: AngularFirestore) {
    this.requestsCollection = this.afs.collection<ServiceRequest>('Orders');
  }

  createRequest(request: ServiceRequest, clientId: string) {
    const validationError = this.validateRequest(request, clientId);
    if (validationError) {
      return Promise.reject(new Error(validationError));
    }

    const requestId = this.afs.createId();
    const timestamp = firebase.firestore.Timestamp.now();
    const requestData: ServiceRequest = Object.assign({}, request, {
      id: requestId,
      clientId,
      status: OrderStatus.Requested,
      proposalCount: 0,
      maximumProposals: maximumRequestProposals,
      createdAt: timestamp,
      updatedAt: timestamp,
      expiresAt: firebase.firestore.Timestamp.fromMillis(timestamp.toMillis() + requestLifetimeInMilliseconds)
    });

    return this.requestsCollection.doc(requestId).set(requestData).then(() => requestId);
  }

  getClientRequests(clientId: string) {
    return this.afs.collection<ServiceRequest>('Orders', reference => reference.where('clientId', '==', clientId))
      .snapshotChanges()
      .pipe(map(actions => this.sortRequests(actions.map(action => {
        const request = action.payload.doc.data() as ServiceRequest;
        request.id = action.payload.doc.id;

        return request;
      }))));
  }

  getAvailableRequests(professionalId: string, serviceIds: string[], city: string, state: string) {
    if (!professionalId || !serviceIds.length || !state) {
      return this.afs.collection<ServiceRequest>('Orders', reference => reference.where('state', '==', '__none__')).valueChanges();
    }

    return this.afs.collection<ServiceRequest>('Orders', reference => reference.where('state', '==', state))
      .snapshotChanges()
      .pipe(map(actions => this.sortRequests(actions.map(action => {
        const request = action.payload.doc.data() as ServiceRequest;
        request.id = action.payload.doc.id;

        return request;
      }).filter(request => this.isAvailableForProfessional(request, professionalId, serviceIds, city)))));
  }

  getRequest(requestId: string) {
    return this.requestsCollection.doc<ServiceRequest>(requestId).valueChanges();
  }

  getRequestProposals(requestId: string) {
    return this.requestsCollection.doc(requestId).collection<ServiceProposal>('Proposals')
      .snapshotChanges()
      .pipe(map(actions => actions.map(action => {
        const proposal = action.payload.doc.data() as ServiceProposal;
        proposal.id = action.payload.doc.id;

        return proposal;
      }).sort((firstProposal, secondProposal) => Number(firstProposal.price) - Number(secondProposal.price))));
  }

  submitProposal(requestId: string, proposal: ServiceProposal, professionalId: string, professionalName: string) {
    const validationError = this.validateProposal(proposal, professionalId);
    if (validationError) {
      return Promise.reject(new Error(validationError));
    }

    const requestReference = this.requestsCollection.doc(requestId).ref;
    const proposalReference = this.requestsCollection.doc(requestId).collection('Proposals').doc(professionalId).ref;

    return this.afs.firestore.runTransaction(transaction => Promise.all([
      transaction.get(requestReference),
      transaction.get(proposalReference)
    ]).then(snapshots => {
      const requestSnapshot = snapshots[0];
      const proposalSnapshot = snapshots[1];

      if (!requestSnapshot.exists) {
        throw new Error('A solicitação não foi encontrada.');
      }

      const currentRequest = requestSnapshot.data() as ServiceRequest;
      if (!this.canReceiveProposal(currentRequest, professionalId)) {
        throw new Error('Esta solicitação não está mais disponível para propostas.');
      }

      if (proposalSnapshot.exists) {
        throw new Error('Você já enviou uma proposta para esta solicitação.');
      }

      const timestamp = firebase.firestore.Timestamp.now();
      const proposalData: ServiceProposal = Object.assign({}, proposal, {
        id: professionalId,
        requestId,
        professionalId,
        professionalName,
        status: ServiceProposalStatus.Sent,
        createdAt: timestamp,
        updatedAt: timestamp
      });

      transaction.set(proposalReference, proposalData);
      transaction.update(requestReference, {
        status: OrderStatus.ProposalReceived,
        proposalCount: Number(currentRequest.proposalCount || 0) + 1,
        updatedAt: timestamp
      });
    }));
  }

  acceptProposal(requestId: string, proposalId: string, clientId: string) {
    const requestReference = this.requestsCollection.doc(requestId).ref;
    const proposalsReference = this.requestsCollection.doc(requestId).collection<ServiceProposal>('Proposals').ref;
    const selectedProposalReference = proposalsReference.doc(proposalId);

    return proposalsReference.get().then(proposalsSnapshot => this.afs.firestore.runTransaction(transaction => Promise.all([
      transaction.get(requestReference),
      transaction.get(selectedProposalReference)
    ]).then(snapshots => {
      const requestSnapshot = snapshots[0];
      const proposalSnapshot = snapshots[1];

      if (!requestSnapshot.exists || !proposalSnapshot.exists) {
        throw new Error('A solicitação ou proposta não foi encontrada.');
      }

      const request = requestSnapshot.data() as ServiceRequest;
      const selectedProposal = proposalSnapshot.data() as ServiceProposal;
      if (request.clientId !== clientId) {
        throw new Error('Somente o cliente pode aceitar uma proposta.');
      }

      if (!this.isOpenRequest(request) || selectedProposal.status !== ServiceProposalStatus.Sent) {
        throw new Error('Esta proposta não está mais disponível.');
      }

      const timestamp = firebase.firestore.Timestamp.now();
      proposalsSnapshot.forEach(proposalDocument => {
        transaction.update(proposalDocument.ref, {
          status: proposalDocument.id === proposalId ? ServiceProposalStatus.Accepted : ServiceProposalStatus.Rejected,
          updatedAt: timestamp
        });
      });

      const acceptedRequest = Object.assign({}, request, {
        status: OrderStatus.Accepted,
        selectedProposalId: proposalId,
        selectedProfessionalId: selectedProposal.professionalId,
        agreedPrice: selectedProposal.price,
        updatedAt: timestamp
      });
      transaction.set(requestReference, acceptedRequest);
      this.writeLegacyOrder(transaction, acceptedRequest, selectedProposal, timestamp);
    })));
  }

  cancelRequest(request: ServiceRequest, clientId: string) {
    if (!request || request.clientId !== clientId || !this.isOpenRequest(request)) {
      return Promise.reject(new Error('Esta solicitação não pode mais ser cancelada.'));
    }

    return this.requestsCollection.doc(request.id).update({
      status: OrderStatus.CancelledByClient,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  private writeLegacyOrder(
    transaction: firebase.firestore.Transaction,
    request: ServiceRequest,
    proposal: ServiceProposal,
    timestamp: firebase.firestore.Timestamp
  ) {
    const order: Pedido = {
      id: request.id,
      nome: request.serviceName,
      idServico: request.serviceId,
      idContratante: request.clientId,
      idServidor: proposal.professionalId,
      data: request.preferredDate,
      hora: request.preferredTime,
      local: request.address,
      cidade: request.city,
      estado: request.state,
      preco: proposal.price,
      clienteCancelou: false,
      profissionalCancelou: false,
      statusProfissional: true,
      status: OrderStatus.Accepted,
      createdAt: request.createdAt,
      updatedAt: timestamp,
      statusUpdatedBy: request.clientId,
      proposalPrice: proposal.price,
      proposalMessage: proposal.message,
      statusHistory: [{ status: OrderStatus.Accepted, actorId: request.clientId, changedAt: timestamp }]
    };
    const clientOrderReference = this.afs.collection('Usuarios').doc(request.clientId).collection('PedidosFeitos').doc(request.id).ref;
    const professionalOrderReference = this.afs.collection('Usuarios').doc(proposal.professionalId).collection('PedidosRecebidos').doc(request.id).ref;

    transaction.set(clientOrderReference, order);
    transaction.set(professionalOrderReference, order);
  }

  private validateRequest(request: ServiceRequest, clientId: string) {
    if (!clientId) {
      return 'Entre na sua conta para criar uma solicitação.';
    }

    if (!request || !request.serviceId || !request.serviceName) {
      return 'Selecione o serviço que você precisa.';
    }

    if (!request.description || request.description.trim().length < 20) {
      return 'Descreva o serviço com pelo menos 20 caracteres.';
    }

    if (!request.city || !request.state) {
      return 'Informe a cidade e o estado do atendimento.';
    }

    if (request.budgetMinimum && request.budgetMaximum && Number(request.budgetMinimum) > Number(request.budgetMaximum)) {
      return 'O orçamento mínimo não pode ser maior que o máximo.';
    }

    return '';
  }

  private validateProposal(proposal: ServiceProposal, professionalId: string) {
    if (!professionalId) {
      return 'Entre na sua conta profissional para enviar uma proposta.';
    }

    if (!proposal || !proposal.price || Number(proposal.price) <= 0) {
      return 'Informe um valor de proposta maior que zero.';
    }

    if (!proposal.message || proposal.message.trim().length < 10) {
      return 'Explique sua proposta em pelo menos 10 caracteres.';
    }

    return '';
  }

  private isAvailableForProfessional(request: ServiceRequest, professionalId: string, serviceIds: string[], city: string) {
    return request.clientId !== professionalId &&
      serviceIds.indexOf(request.serviceId) !== -1 &&
      (!city || request.city === city) &&
      this.canReceiveProposal(request, professionalId);
  }

  private canReceiveProposal(request: ServiceRequest, professionalId: string) {
    return request.clientId !== professionalId &&
      this.isOpenRequest(request) &&
      Number(request.proposalCount || 0) < Number(request.maximumProposals || maximumRequestProposals) &&
      this.getTimestampInMilliseconds(request.expiresAt) > Date.now();
  }

  private isOpenRequest(request: ServiceRequest) {
    return request.status === OrderStatus.Requested || request.status === OrderStatus.ProposalReceived;
  }

  private sortRequests(requests: ServiceRequest[]) {
    return requests.sort((firstRequest, secondRequest) =>
      this.getTimestampInMilliseconds(secondRequest.createdAt) - this.getTimestampInMilliseconds(firstRequest.createdAt));
  }

  private getTimestampInMilliseconds(timestamp: any) {
    if (timestamp && typeof timestamp.toMillis === 'function') {
      return timestamp.toMillis();
    }

    return timestamp ? new Date(timestamp).getTime() : 0;
  }
}

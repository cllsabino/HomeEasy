import { RunInFirebaseInjectionContext } from '../shared/utils/firebase-injection-context.utils';
import { EnvironmentInjector, inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { map } from 'rxjs/operators';

import { ProfessionalVerificationStatus, UserRole, Usuario } from '../Usuarios/usuario';
import { createPublicProfile } from '../shared/utils/public-profile.utils';

@Injectable({ providedIn: 'root' })
@RunInFirebaseInjectionContext
export class ProfessionalVerificationService {
  readonly firebaseEnvironmentInjector = inject(EnvironmentInjector);
  constructor(private afs: AngularFirestore) { }

  requestVerification(userId: string) {
    const professionalReference = this.afs.collection('Usuarios').doc(userId).ref;
    const publicProfileReference = this.afs.collection('PublicProfiles').doc(userId).ref;

    return this.afs.firestore.runTransaction(transaction => transaction.get(professionalReference).then(snapshot => {
      if (!snapshot.exists) {
        throw new Error('Seu perfil não foi encontrado.');
      }

      const professional = snapshot.data() as Usuario;
      const validationError = this.getVerificationValidationError(professional);
      if (validationError) {
        throw new Error(validationError);
      }

      if (professional.verificationStatus === ProfessionalVerificationStatus.Pending) {
        throw new Error('Sua verificação já está em análise.');
      }

      transaction.update(professionalReference, {
        verificationStatus: ProfessionalVerificationStatus.Pending,
        verificationRequestedAt: firebase.firestore.FieldValue.serverTimestamp(),
        verificationReviewNote: ''
      });
      transaction.set(publicProfileReference, createPublicProfile(Object.assign({}, professional, {
        id: userId,
        verificationStatus: ProfessionalVerificationStatus.Pending
      })));
    }));
  }

  getPendingProfessionals() {
    return this.afs.collection<Usuario>('Usuarios', reference =>
      reference.where('verificationStatus', '==', ProfessionalVerificationStatus.Pending))
      .snapshotChanges()
      .pipe(map(actions => actions.map(action => {
        const professional = action.payload.doc.data() as Usuario;
        professional.id = action.payload.doc.id;

        return professional;
      })));
  }

  reviewVerification(adminId: string, professionalId: string, approved: boolean, reviewNote: string) {
    const adminReference = this.afs.collection('Usuarios').doc(adminId).ref;
    const professionalReference = this.afs.collection('Usuarios').doc(professionalId).ref;
    const publicProfileReference = this.afs.collection('PublicProfiles').doc(professionalId).ref;

    return this.afs.firestore.runTransaction(transaction => Promise.all([
      transaction.get(adminReference),
      transaction.get(professionalReference)
    ]).then(snapshots => {
      const admin = snapshots[0].data() as Usuario;
      const professional = snapshots[1].data() as Usuario;

      if (!snapshots[0].exists || !admin || admin.role !== UserRole.Admin) {
        throw new Error('Somente administradores podem revisar verificações.');
      }

      if (!snapshots[1].exists || professional.verificationStatus !== ProfessionalVerificationStatus.Pending) {
        throw new Error('Esta solicitação não está mais pendente.');
      }

      const verificationStatus = approved ? ProfessionalVerificationStatus.Verified : ProfessionalVerificationStatus.Rejected;
      transaction.update(professionalReference, {
        verificationStatus,
        verificationReviewedAt: firebase.firestore.FieldValue.serverTimestamp(),
        verificationReviewedBy: adminId,
        verificationReviewNote: reviewNote ? reviewNote.trim() : ''
      });
      transaction.set(publicProfileReference, createPublicProfile(Object.assign({}, professional, {
        id: professionalId,
        verificationStatus
      })));
    }));
  }

  private getVerificationValidationError(professional: Usuario) {
    if (!professional.nome || !professional.telefone || !professional.endereco || !professional.cidade || !professional.estado) {
      return 'Complete nome, telefone e endereço antes de solicitar a verificação.';
    }

    if (!professional.cpf && !professional.cnpj) {
      return 'Informe CPF ou CNPJ no perfil antes de solicitar a verificação.';
    }

    return '';
  }
}

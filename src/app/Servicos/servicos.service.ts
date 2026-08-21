import { RunInFirebaseInjectionContext } from '../shared/utils/firebase-injection-context.utils';
import { EnvironmentInjector, inject, Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';

import { Servico } from '../Usuarios/servico';
import { Usuario } from 'src/app/Usuarios/usuario';
import { createPublicProfile } from '../shared/utils/public-profile.utils';

@Injectable({
  providedIn: 'root'
})
@RunInFirebaseInjectionContext
export class ServicosService {
  readonly firebaseEnvironmentInjector = inject(EnvironmentInjector);
  servicoCollection : AngularFirestoreCollection<Servico>;
  domesticoCollection : AngularFirestoreCollection<Servico>;
  reformaCollection : AngularFirestoreCollection<Servico>;
  usuariosCollection : AngularFirestoreCollection<Usuario>;

 constructor(private afs : AngularFirestore) { 
  this.servicoCollection = this.afs.collection('Serviços');
  this.usuariosCollection = this.afs.collection('Usuarios');
  this.domesticoCollection = this.afs.collection('Serviços', ref => ref.where('tipo', '==', 'Doméstico'));
  this.reformaCollection = this.afs.collection('Serviços', ref => ref.where('tipo', '==', 'Reforma'));
 }
 //pega um serviço pelo nome
 getServicoPorNome(nome : string){
   return this.afs.collection('Serviços', ref => ref.where('nome', '==', nome)).snapshotChanges().pipe(
    map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Servico;
        const id = a.payload.doc.id;

        return { id, ...data};
      })
    })
  );
 }
 //pega um serviço pelo id
 getServico(id : string){
  return this.servicoCollection.doc<Servico>(id).valueChanges();
 }
 //pega servico especifico de um usuario
 getUserServicoPorId(id : string, idd : string){
  return this.afs.collection('Usuarios').doc(id).collection('Serviços').
    doc<Servico>(idd).valueChanges();
}
//pega um usuario especifico cadastrado num servico
getServicoUsuario(id : string, idd : string){
  return this.afs.collection('Serviços').doc(id).collection('Usuarios').
    doc<Usuario>(idd).valueChanges();
}
 //pega todos os serviços 
 getServicos(){
   return this.servicoCollection.snapshotChanges().pipe(
     map(actions => {
       return actions.map(a => {
         const data = a.payload.doc.data() as Servico;
         const id = a.payload.doc.id;

         return { id, ...data};
       })
     })
   );
 }
 //adiciona um servico 
 addServico(servico : Servico){
  return this.servicoCollection.doc(servico.id).set(servico);
}
//pega servicos domesticos
getDomestico(){
  return this.domesticoCollection.snapshotChanges().pipe(
    map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Servico;
        const id = a.payload.doc.id;

        return { id, ...data};
      })
    })
  );
}
//pega servicos de reforma
getReforma(){
  return this.reformaCollection.snapshotChanges().pipe(
    map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Servico;
        const id = a.payload.doc.id;

        return { id, ...data};
      })
    })
  );
}
//add usuario num serviço
addUsuario(usuario : Usuario, serve : Servico){
  const batch = this.afs.firestore.batch();
  const serviceProfessionalReference = this.afs.collection('Serviços').doc(serve.id).collection('Usuarios').doc(usuario.id).ref;
  const professionalServiceReference = this.afs.collection('Usuarios').doc(usuario.id).collection('Serviços').doc(serve.id).ref;

  batch.set(serviceProfessionalReference, Object.assign({}, createPublicProfile(usuario), { availableForService: true }));
  batch.set(professionalServiceReference, Object.assign({}, serve, { available: true }));

  return batch.commit();
}
//atualiza o perfil privado e suas representações públicas em uma única operação
updateProfessionalProfile(usuario : Usuario, services : Servico[]){
  const batch = this.afs.firestore.batch();
  const userReference = this.afs.collection('Usuarios').doc(usuario.id).ref;
  const publicProfileReference = this.afs.collection('PublicProfiles').doc(usuario.id).ref;

  batch.set(userReference, usuario);
  batch.set(publicProfileReference, createPublicProfile(usuario));
  services.forEach(service => {
    const serviceProfessionalReference = this.afs.collection('Serviços').doc(service.id).collection('Usuarios').doc(usuario.id).ref;
    batch.set(serviceProfessionalReference, Object.assign({}, createPublicProfile(usuario), {
      availableForService: service.available !== false
    }));
  });

  return batch.commit();
}
//altera a disponibilidade do profissional sem remover seu serviço
setServiceAvailability(usuario : Usuario, serve : Servico, available : boolean){
  const batch = this.afs.firestore.batch();
  const serviceProfessionalReference = this.afs.collection('Serviços').doc(serve.id).collection('Usuarios').doc(usuario.id).ref;
  const professionalServiceReference = this.afs.collection('Usuarios').doc(usuario.id).collection('Serviços').doc(serve.id).ref;

  batch.update(serviceProfessionalReference, { availableForService: available });
  batch.update(professionalServiceReference, { available });

  return batch.commit();
}
//deletar usuario de um servico
apagarServico(usuario : Usuario, serve : Servico){
  const batch = this.afs.firestore.batch();
  const serviceProfessionalReference = this.afs.collection('Serviços').doc(serve.id).collection('Usuarios').doc(usuario.id).ref;
  const professionalServiceReference = this.afs.collection('Usuarios').doc(usuario.id).collection('Serviços').doc(serve.id).ref;

  batch.delete(serviceProfessionalReference);
  batch.delete(professionalServiceReference);

  return batch.commit();
}
//pegar usuarios de um serviço  
getUsuarios(id : string){
  return this.afs.collection('Serviços').doc(id).collection('Usuarios').snapshotChanges().pipe(
    map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Usuario;
        const id = a.payload.doc.id;

        return { id, ...data};
      }).filter(usuario => usuario.availableForService !== false)
    })
  );
}
//pega serviços de um usuario
getUserServico(id : string){
  return this.afs.collection('Usuarios').doc(id).collection('Serviços').snapshotChanges().pipe(
    map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Servico;
        const id = a.payload.doc.id;

        return { id, ...data};
      })
    })
  );
}

}

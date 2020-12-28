import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

import { Servico } from '../Usuarios/servico';
import { Usuario } from 'src/app/Usuarios/usuario';

@Injectable({
  providedIn: 'root'
})
export class ServicosService {
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

 // pega serviço específico
 getServicoPorNome(nome : string){
   return this.afs.collection('Serviços', ref => ref.where('nome', '==', nome));
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
  this.afs.collection('Serviços').doc(serve.id).collection('Usuarios').doc(usuario.id).set(usuario);
  this.afs.collection('Usuarios').doc(usuario.id).collection('Serviços').doc(serve.id).set(serve);
}
//deletar usuario de um servico
apagarServico(usuario : Usuario, serve : Servico){
  this.afs.collection('Serviços').doc(serve.id).collection('Usuarios').doc(usuario.id).delete();
  this.afs.collection('Usuarios').doc(usuario.id).collection('Serviços').doc(serve.id).delete();
}
//pegar usuarios de um serviço
getUsuarios(id : string){
  return this.afs.collection('Serviços').doc(id).collection("Usuarios").snapshotChanges().pipe(
    map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Usuario;
        const id = a.payload.doc.id;

        return { id, ...data};
      })
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

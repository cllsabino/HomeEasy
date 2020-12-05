import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
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
 getServicoPorId(id : string){
  return this.afs.collection('Serviços', ref => ref.where('id', '==', id));
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
  return this.servicoCollection.add(servico);
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
  this.afs.collection('Serviços').doc(serve.id).collection('Usuarios').add(usuario);
  this.afs.collection('Usuarios').doc(usuario.id).collection('Serviços').add(serve);
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

}

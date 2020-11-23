import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

import { Servico } from '../Usuarios/servico';

@Injectable({
  providedIn: 'root'
})
export class ServicosService {
  servicoCollection : AngularFirestoreCollection<Servico>;
  domesticoCollection : AngularFirestoreCollection<Servico>;
  reformaCollection : AngularFirestoreCollection<Servico>;


 constructor(private afs : AngularFirestore) { 
  this.servicoCollection = this.afs.collection('Serviços');
  this.domesticoCollection = this.afs.collection('Serviços', ref => ref.where('tipo', '==', 'Doméstico'));
  this.reformaCollection = this.afs.collection('Serviços', ref => ref.where('tipo', '==', 'Reforma'));

 }

 // pega serviço específico
 getServico(nome : string){}

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




}

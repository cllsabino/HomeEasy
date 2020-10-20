import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

import { Servico } from '../Usuarios/servico';

@Injectable({
  providedIn: 'root'
})
export class ServicosService {
  servicoDomesticoCollection : AngularFirestoreCollection<Servico>;
  servicoReformaCollection : AngularFirestoreCollection<Servico>;

 constructor(private afs : AngularFirestore) { 
   this.servicoDomesticoCollection = this.afs.collection('Serviços').doc('Serviços Domésticos').collection('Domestico');

   this.servicoReformaCollection = this.afs.collection('Serviços').doc('Serviços de Reforma').collection('Reforma');
 }

 // pega serviço específico
 getServico(id : string){}

 //pega serviços domésticos
 getDomestico(){
   return this.servicoDomesticoCollection.snapshotChanges().pipe(
     map(actions => {
       return actions.map(a => {
         const data = a.payload.doc.data() as Servico;
         const id = a.payload.doc.id;

         return { id, ...data};
       })
     })
   );
 }
 //pega serviços de reforma
 getReforma(){
   return this.servicoReformaCollection.snapshotChanges().pipe(
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

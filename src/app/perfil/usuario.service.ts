import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Usuario } from './../Usuarios/usuario';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  usuarioCollection : AngularFirestoreCollection<Usuario>;
  usuarioDocument : AngularFirestoreDocument<Usuario>;
  
  constructor(public afAuth : AngularFireAuth, private afs : AngularFirestore) {  
    this.usuarioCollection = this.afs.collection<Usuario>('Usuarios');
    
  }

  getUsuarios(){
   return this.usuarioCollection.snapshotChanges().pipe(map(
      actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Usuario
          const id = a.payload.doc.id

          return {id, ...data}
        })
      }
    ));
  }

  getUsuario(id : string){
    return this.usuarioCollection.doc<Usuario>(id).valueChanges();
  }


  

}

import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators"

import { Mensagem } from '../Usuarios/mensagem';

@Injectable({
    providedIn: 'root'
  })

export class ContatoService {
  mensagemInfo: Observable<Mensagem[]>;
  mensagemCollection: AngularFirestoreCollection<Mensagem>;

  constructor(public afs : AngularFirestore) {
    this.mensagemCollection = this.afs.collection('Mensagem');

    this.mensagemInfo = this.mensagemCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Mensagem;
        return data;
      }))
    );
  }

  salvarmensagem(mensagem : Mensagem){
    return this.mensagemCollection.add(mensagem);
  }

}
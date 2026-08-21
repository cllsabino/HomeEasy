import { RunInFirebaseInjectionContext } from '../shared/utils/firebase-injection-context.utils';
import { EnvironmentInjector, inject, Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators"

import { Mensagem } from '../Usuarios/mensagem';

@Injectable({
    providedIn: 'root'
  })

@RunInFirebaseInjectionContext
export class ContatoService {
  readonly firebaseEnvironmentInjector = inject(EnvironmentInjector);
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
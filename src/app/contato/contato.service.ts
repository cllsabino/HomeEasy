import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { messaging } from 'firebase';

import { Mensagem } from './../Usuarios/mensagem';

@Injectable({
    providedIn: 'root'
  })

export class ContatoService {
  constructor(public afAuth : AngularFireDatabase) {

  }
  mensagemInfo = this.afAuth.database.ref('mensagens');

  salvarmensagem(mensage : Mensagem){
    var contatinho = this.mensagemInfo.push(mensage);
    return contatinho.set({
      nome : mensage.nome,
      email : mensage.email,
      telefone : mensage.telefone,
      assunto : mensage.assunto,
      mensagem : mensage.messagem
    })
  }

}
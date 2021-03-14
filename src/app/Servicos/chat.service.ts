import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators"

import { ServicoPedido } from './../Usuarios/serico-pedido';
import { Servico } from '../Usuarios/servico';
import { Usuario } from 'src/app/Usuarios/usuario';
import { Pedido } from 'src/app/Usuarios/pedido';
import { Chat } from 'src/app/Usuarios/chat';

@Injectable({
    providedIn: 'root'
  })

export class ChatService {
  chatCollection: AngularFirestoreCollection;
  contatosCollection : AngularFirestoreCollection;

  constructor(public afs : AngularFirestore) {
    this.chatCollection = this.afs.collection('Chat');
    this.contatosCollection = this.afs.collection('Contatos');
  }
 //adiciona uma mensagem ao chat de um usuario
 addMensagem(cliente : string, servidor : string, mensagem : Chat){
    this.chatCollection.doc(cliente).collection('Contato').doc(servidor).collection('Mensagens').add(mensagem);
    this.chatCollection.doc(servidor).collection('Contato').doc(cliente).collection('Mensagens').add(mensagem);
 } 
 //pega as mensagens de uma conversa
 getMensagens(cliente : string, servidor : string){
    return this.chatCollection.doc(cliente).collection('Contato').doc(servidor).collection('Mensagens', ref => ref.orderBy('data', 'asc')).snapshotChanges().
      pipe(map (actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Chat;
          const id = a.payload.doc.id;

          return { id, ...data};
        })
      })
    );
 }
 //add a conversa na lista de contatos 
 addCliente(cliente : Usuario, servidor : Usuario){
   this.contatosCollection.doc(servidor.id).collection('Lista').doc(cliente.id).set(cliente);
   this.contatosCollection.doc(cliente.id).collection('Lista').doc(servidor.id).set(servidor);
 }
 //exclui um contato da lista
 deleteContato(cliente : Usuario, servidor : Usuario){
  this.contatosCollection.doc(servidor.id).collection('Lista').doc(cliente.id).delete;
  this.contatosCollection.doc(cliente.id).collection('Lista').doc(servidor.id).delete;
 }
 //retorna usuarios da lista de conversa 
 getContatos(id : string){
  return this.contatosCollection.doc(id).collection('Lista').snapshotChanges(). 
    pipe(map (actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Usuario;
        const id = a.payload.doc.id;

        return { id, ...data};
      })
    })
  );
 }
 
}
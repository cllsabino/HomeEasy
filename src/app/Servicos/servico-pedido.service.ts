import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators"

import { ServicoPedido } from './../Usuarios/serico-pedido';
import { Servico } from '../Usuarios/servico';
import { Usuario } from 'src/app/Usuarios/usuario';

@Injectable({
    providedIn: 'root'
  })

export class ServicoPedidoService {
  servicoPedidoCollection: AngularFirestoreCollection<ServicoPedido>;
  servicoCollection : AngularFirestoreCollection<Servico>;
  usuariosCollection : AngularFirestoreCollection<Usuario>;

  constructor(public afs : AngularFirestore) {
    this.servicoPedidoCollection = this.afs.collection('ServicoPedido');
    this.servicoCollection = this.afs.collection('Serviços');
    this.usuariosCollection = this.afs.collection('Usuarios');
  }
 //adiciona os detalhes de um servico 
 addServicoPedido(usuario : Usuario, servico : Servico, servicopedido : ServicoPedido){
    this.servicoPedidoCollection.doc(usuario.id).collection('Serviços').doc(servico.id)
        .set(servicopedido);
 }
 //pega os detalhes de um servico de um usuario
 getDetalheServico(usuario : Usuario, servico : Servico){
    return this.servicoPedidoCollection.doc(usuario.id).collection('Serviços').
        doc<ServicoPedido>(servico.id).valueChanges();
 }

}
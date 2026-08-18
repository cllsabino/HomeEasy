import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators"
import * as firebase from 'firebase/app';
import 'firebase/firestore';

import { ServicoPedido } from './../Usuarios/serico-pedido';
import { Servico } from '../Usuarios/servico';
import { Usuario } from 'src/app/Usuarios/usuario';
import { OrderStatus, Pedido } from 'src/app/Usuarios/pedido';
import { canTransitionOrder, getLegacyOrderFlags, getOrderStatus } from '../shared/utils/order-status.utils';

@Injectable({
    providedIn: 'root'
  })

export class ServicoPedidoService {
  servicoPedidoCollection: AngularFirestoreCollection;
  servicoCollection : AngularFirestoreCollection;
  usuariosCollection : AngularFirestoreCollection;

  constructor(public afs : AngularFirestore) {
    this.servicoPedidoCollection = this.afs.collection('ServicoPedido');
    this.servicoCollection = this.afs.collection('Serviços');
    this.usuariosCollection = this.afs.collection('Usuarios');
  }
 //adiciona os detalhes de um servico 
 addServicoPedido(usuario : Usuario, servico : Servico, servicopedido : ServicoPedido){
    return this.servicoPedidoCollection.doc(usuario.id).collection('Serviços').doc(servico.id)
      .set(servicopedido);
 }
 //pega os detalhes de um servico de um usuario
 getDetalheServico(id : string, idd : string){
    return this.servicoPedidoCollection.doc(id).collection('Serviços').
      doc<ServicoPedido>(idd).valueChanges();
 }
 //adiciona um pedido
 addPedido(cliente : Usuario, servidor : Usuario, pedido : Pedido){
   const batch = this.afs.firestore.batch();
   const orderStatus = getOrderStatus(pedido);
   const clientOrderReference = this.usuariosCollection.doc(cliente.id).collection('PedidosFeitos').doc(pedido.id).ref;
   const professionalOrderReference = this.usuariosCollection.doc(servidor.id).collection('PedidosRecebidos').doc(pedido.id).ref;
   const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp();
   const orderData: any = Object.assign({}, pedido, getLegacyOrderFlags(orderStatus), {
     status: orderStatus,
     updatedAt: serverTimestamp
   });

   if (!pedido.createdAt) {
     orderData.createdAt = serverTimestamp;
   }

   batch.set(clientOrderReference, orderData);
   batch.set(professionalOrderReference, orderData);

   return batch.commit();
 }

 updateOrderStatus(order: Pedido, nextStatus: OrderStatus, actorId: string){
   if (!canTransitionOrder(order, nextStatus, actorId)) {
     return Promise.reject(new Error('Transição de status não permitida para este pedido.'));
   }

   const batch = this.afs.firestore.batch();
   const clientOrderReference = this.usuariosCollection.doc(order.idContratante).collection('PedidosFeitos').doc(order.id).ref;
   const professionalOrderReference = this.usuariosCollection.doc(order.idServidor).collection('PedidosRecebidos').doc(order.id).ref;
   const updatedOrder: any = Object.assign({}, order, getLegacyOrderFlags(nextStatus), {
     status: nextStatus,
     statusUpdatedBy: actorId,
     updatedAt: firebase.firestore.FieldValue.serverTimestamp()
   });

   batch.set(clientOrderReference, updatedOrder);
   batch.set(professionalOrderReference, updatedOrder);

   return batch.commit();
 }
 //pega os pedidos feitos de um cliente 
 getPedidosFeitos(id : string){
   return this.usuariosCollection.doc(id).collection('PedidosFeitos', ref => ref.orderBy('data', 'desc')).snapshotChanges().
    pipe(map (actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Pedido;
        const id = a.payload.doc.id;

        return { id, ...data};
      })
    })
  );
 }
 //pega um pedido feito de um cliente 
 getPedidoFeito(idCliente : string, idPedido : string){
  return this.afs.collection('Usuarios').doc(idCliente).collection('PedidosFeitos').doc<Pedido>(idPedido).valueChanges();
 }
 //pega os pedidos recebidos de um servidor 
 getPedidosRecebidos(id : string){
  return this.usuariosCollection.doc(id).collection('PedidosRecebidos', ref => ref.orderBy('data', 'desc')).snapshotChanges().
   pipe(map (actions => {
     return actions.map(a => {
       const data = a.payload.doc.data() as Pedido;
       const id = a.payload.doc.id;

       return { id, ...data};
     })
   }));
  }
 //pega um pedido recebido por um servidor 
 getPedidoRecebido(idServidor : string, idPedido : string){
  return this.afs.collection('Usuarios').doc(idServidor).collection('PedidosRecebidos').doc<Pedido>(idPedido).valueChanges();
 }
 //apagar o pedido recebido de um profissional
 deletePedidoRecebido(idServidor : string, Idpedido : string){
  return this.afs.collection('Usuarios').doc(idServidor).collection('PedidosRecebidos').doc<Pedido>(Idpedido).delete();
 }
 //apagar o pedido feito de um cliente
 deletePedidoFeito(idCliente : string, Idpedido : string){
  return this.afs.collection('Usuarios').doc(idCliente).collection('PedidosFeitos').doc<Pedido>(Idpedido).delete();
 }

}



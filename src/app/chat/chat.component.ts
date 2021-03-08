import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute, Router, Params} from '@angular/router';
import { Subscription } from 'rxjs';

import { Usuario } from './../Usuarios/usuario';
import { Chat } from './../Usuarios/chat';
import { UsuarioService } from '../Servicos/usuario.service';
import { ServicosService } from './../Servicos/servicos.service';
import { LoginServiceService } from '../Servicos/login-service.service';
import { ServicoPedidoService } from './../Servicos/servico-pedido.service';
import { ChatService } from './../Servicos/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  servidor : Usuario = {}; //info do servidor
  servidorSubscription : Subscription;
  servidorId : string; //id do servidor
  servidorIdSubscription : Subscription;
  imgSubscription : Subscription;
  entrarSair : boolean;
  mensagensArray = new Array<Chat>(); //array com as mensagens
  mensagensArraySubscription : Subscription;
  mensagem : Chat = {}; //mensagem que vai ser enviada
  userId : string; //id do cliente
  usuario : Usuario = {}; //info do cliente
  userSubscription : Subscription;
  imgCSubscription : Subscription;

  constructor(
    public afs : AngularFirestore, 
    public afAuth : AngularFireAuth,
    public storage : AngularFireStorage,
    public loginService : LoginServiceService,
    public servico : ServicosService, 
    public servicoPedido : ServicoPedidoService,
    public usuarioService : UsuarioService,
    public chatService : ChatService,
    public router : Router,
    public active : ActivatedRoute
  ) { }

  ngOnInit() {
    if(this.afAuth.auth.currentUser != null){
      this.entrarSair = true;
      this.userId = this.afAuth.auth.currentUser.uid;
    }else this.entrarSair = false;

    this.servidorIdSubscription = this.active.params.subscribe(
      (params : Params) => { this.servidorId = params['id'] }
    );
    this.servidorSubscription = this.usuarioService.getUsuario(this.servidorId).subscribe(data => {
      this.servidor = data; 
    });
    this.userSubscription = this.usuarioService.getUsuario(this.userId).subscribe(data => {
      this.usuario = data; 
    });
    this.imgSubscription = this.storage.ref('Usuarios/' + this.servidorId + '/fotoPerfil.jpg').getDownloadURL().subscribe(data => {
      this.servidor.foto = data;
    });
    this.imgCSubscription = this.storage.ref('Usuarios/' + this.userId + '/fotoPerfil.jpg').getDownloadURL().subscribe(data => {
      this.usuario.foto = data;
    });
    this.mensagensArraySubscription = this.chatService.getMensagens(this.userId, this.servidorId).subscribe(data => {
      this.mensagensArray = data;
    });
  }
  enviarMensagem(){
    if(this.usuario.id != this.servidor.id){
      this.mensagem.data = new Date().getTime();
      this.mensagem.id = this.userId;
      this.mensagem.hora = new Date().getHours() + ":" + new Date().getMinutes();
      this.chatService.addCliente(this.usuario, this.servidor);
      this.chatService.addMensagem(this.userId, this.servidorId, this.mensagem);
      this.mensagem.mensagem="";
    }else{
      alert("Ação Impossível!");
      this.router.navigate(["/feed"]);
    }
  }
  ngOnDestroy(){
    this.servidorIdSubscription.unsubscribe();
    this.servidorSubscription.unsubscribe();
    this.mensagensArraySubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }
  async sair(){
    try{
      await this.loginService.sair().then(
        (success) => {this.router.navigate(["/home"])});
     }catch(error){
       console.error(error);
    }
  }

}

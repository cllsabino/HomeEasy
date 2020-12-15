import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Usuario } from './../Usuarios/usuario';
import { Servico } from './../Usuarios/servico';
import { UsuarioService } from '../Servicos/usuario.service';
import { ServicosService } from './../Servicos/servicos.service';
import { LoginServiceService } from '../Servicos/login-service.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  private usuario : Usuario = {};
  private userId : string;
  private userSubscription : Subscription;
  private imgSubscription : Subscription;
  private entrarSair : boolean;
  private servicosArray = new Array<Servico>();
  private servicosSubscription : Subscription;
  private servicoEstado : boolean = false;
  private servicoDelete : Servico = {};
  
  constructor(
    private afs : AngularFirestore, 
    private afAuth : AngularFireAuth,
    private storage : AngularFireStorage,
    private router : Router,
    private loginService : LoginServiceService,
    private usuarioService : UsuarioService,
    private servico : ServicosService, 
    private active : ActivatedRoute
    ) { }

  ngOnInit() {
    if(this.afAuth.auth.currentUser != null){
      this.entrarSair = true;
      this.userId = this.afAuth.auth.currentUser.uid;
    }else this.entrarSair = false;

    this.userSubscription = this.usuarioService.getUsuario(this.userId).subscribe(data => {
      this.usuario = data; 
    });
    
    this.imgSubscription = this.storage.ref('Usuarios/' + this.userId + '/fotoPerfil.jpg').getDownloadURL().subscribe(data => {
      this.usuario.foto = data;
    });

    this.servicosSubscription = this.servico.getUserServico(this.userId).subscribe(data => {
      this.servicosArray = data;
    });

  }
  ngOnDestroy(){ 
    this.userSubscription.unsubscribe();
    this.servicosSubscription.unsubscribe();
  }
  async sair(){
    try{
      await this.loginService.sair().then(
        (success) => {this.router.navigate(["/home"])});
     }catch(error){
       console.error(error);
    }
  }
  mostrarBotaoDeletar(event, serve){
    this.servicoEstado = true;
    this.servicoDelete = serve;
  }
  limparBotao(){
    this.servicoEstado = false;
  }
  deletarServico(event, serve){
    this.servico.apagarServico(this.usuario, serve);
    alert("Inscrição Cancelada!");
  }


}

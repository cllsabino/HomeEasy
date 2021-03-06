import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Usuario } from 'src/app/Usuarios/usuario';
import { UsuarioService } from './../../Servicos/usuario.service';
import { Servico } from 'src/app/Usuarios/servico';
import { ServicosService } from './../../Servicos/servicos.service';
import { LoginServiceService } from '../../Servicos/login-service.service';

@Component({
  selector: 'app-editar-info',
  templateUrl: './editar-info.component.html',
  styleUrls: ['./editar-info.component.css']
})
export class EditarInfoComponent implements OnInit {
 userId;
 imagem : string;
 entrarSair : boolean;
 usuario : Usuario = {};
 userSubscription : Subscription;
 servicosArray = new Array<Servico>();
 servicosSubscription : Subscription;
 valor : boolean = true;

  constructor(
    public storage : AngularFireStorage,
    public afAuth : AngularFireAuth,
    public afs : AngularFirestore,
    public router : Router,
    public usuarioService : UsuarioService,
    public servico : ServicosService, 
    public loginService : LoginServiceService,
    ) { }

  ngOnInit() {
    if(this.afAuth.auth.currentUser != null){
      this.userId = this.afAuth.auth.currentUser.uid;
      this.entrarSair = true;
    } 
    else this.entrarSair = false;

    this.userSubscription = this.usuarioService.getUsuario(this.userId).subscribe(data => {
      this.usuario = data; 
    });
    this.servicosSubscription = this.servico.getUserServico(this.userId).subscribe(data => {
      this.servicosArray = data;
    });
  }
  ngOnDestroy(){ 
    this.userSubscription.unsubscribe();
    this.servicosSubscription.unsubscribe();
  }
  upload($event){
    this.imagem = $event.target.files[0];
  }
  editarImg(){
    this.storage.ref('Usuarios/' + this.userId + '/fotoPerfil.jpg').put(this.imagem).then(
      (success) => {alert("Foto de Perfil Alterada")});
  }
  editarInfo(){
    this.usuario.id = this.userId;
    this.afs.collection("Usuarios").doc(this.userId).set(this.usuario).then(
      (success) => {alert("Informações Alteradas")}
    );
    if(this.servicosArray.length != 0){
      for(var a = 0; a < this.servicosArray.length; a++){
        var serve : Servico = this.servicosArray[a];
        this.afs.collection('Serviços').doc(serve.id).collection('Usuarios').doc(this.userId).set(this.usuario);
      }
    }
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

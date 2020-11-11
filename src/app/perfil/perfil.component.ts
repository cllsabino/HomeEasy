import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Usuario } from './../Usuarios/usuario';
import { UsuarioService } from './usuario.service';
import { LoginServiceService } from './../login-cadastro/login-service.service';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario : Usuario = {};
  userId : string;
  userSubscription : Subscription;
  imgSubscription : Subscription;
  esconderServico;
  entrarSair : boolean;

  constructor(
    private afs : AngularFirestore, 
    private afAuth : AngularFireAuth,
    private storage : AngularFireStorage,
    private router : Router,
    private loginService : LoginServiceService,
    private usuarioService : UsuarioService,
    private active : ActivatedRoute
    ) { 

    }
    

  ngOnInit() {
    if(this.afAuth.auth.currentUser != null) this.entrarSair = true;
    else this.entrarSair = false;

    this.userId = this.afAuth.auth.currentUser.uid;
    this.userSubscription = this.usuarioService.getUsuario(this.userId).subscribe(data => {
      this.usuario = data;
    });

    this.imgSubscription = this.storage.ref('Usuarios/' + this.afAuth.auth.currentUser.uid + '/fotoPerfil.jpg').getDownloadURL().subscribe(data => {
      this.usuario.foto = data;
    });

  }

  ngOnDestroy(){ 
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

  fotoPerfil(){
    
  }

}

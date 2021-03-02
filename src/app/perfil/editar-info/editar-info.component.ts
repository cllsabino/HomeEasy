import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Subscription } from 'rxjs';

import { Usuario } from 'src/app/Usuarios/usuario';
import { UsuarioService } from './../../Servicos/usuario.service';

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

  constructor(
    public storage : AngularFireStorage,
    public afAuth : AngularFireAuth,
    public afs : AngularFirestore,
    public usuarioService : UsuarioService,
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
  }
  ngOnDestroy(){ 
    this.userSubscription.unsubscribe();
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
      (success) => {alert("Informações Alteradas")});
  }

}

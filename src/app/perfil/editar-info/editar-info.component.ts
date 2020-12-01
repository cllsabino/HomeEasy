import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

import { Usuario } from 'src/app/Usuarios/usuario';

@Component({
  selector: 'app-editar-info',
  templateUrl: './editar-info.component.html',
  styleUrls: ['./editar-info.component.css']
})
export class EditarInfoComponent implements OnInit {
  private userId;
  private imagem : string;
  private entrarSair : boolean;
  private usuario : Usuario = {};

  constructor(
    private storage : AngularFireStorage,
    private afAuth : AngularFireAuth,
    private afs : AngularFirestore
    ) { }

  ngOnInit() {
    if(this.afAuth.auth.currentUser != null){
      this.userId = this.afAuth.auth.currentUser.uid;
      this.entrarSair = true;
    } 
    else this.entrarSair = false;
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

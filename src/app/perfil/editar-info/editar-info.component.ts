import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-editar-info',
  templateUrl: './editar-info.component.html',
  styleUrls: ['./editar-info.component.css']
})
export class EditarInfoComponent implements OnInit {
  userId;
  caminho : string;

  constructor(
    private storage : AngularFireStorage,
    private afAuth : AngularFireAuth
    ) { }

  ngOnInit() {
    this.userId = this.afAuth.auth.currentUser.uid;
  }

  upload($event){
    this.caminho = $event.target.files[0];
  }
  editarImagem(){
    this.storage.ref('Usuarios/' + this.afAuth.auth.currentUser.uid + '/fotoPerfil.jpg').put(this.caminho);
  }

}

import { getCurrentFirebaseUser } from '../../shared/utils/firebase-auth.utils';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { ServicosService } from '../../Servicos/servicos.service';
import { LoginServiceService } from '../../Servicos/login-service.service';
import { Usuario } from 'src/app/Usuarios/usuario';
import { UsuarioService } from '../../Servicos/usuario.service';

@Component({
  standalone: false,
  selector: 'app-servico-detalhe',
  templateUrl: './servico-detalhe.component.html',
  styleUrls: ['./servico-detalhe.component.css']
})
export class ServicoDetalheComponent implements OnInit {
 usuariosArray = new Array<Usuario>();
 usuariosSubscription : Subscription;
 serveID : string;
 serveIDSubscription : Subscription;
 entrarSair : boolean;
 userId : string;
 isLoading = true;

  constructor(
    public afs : AngularFirestore, 
    public afAuth : AngularFireAuth,
    public loginService : LoginServiceService,
    public servico : ServicosService, 
    public usuarioService : UsuarioService,
    public router : Router,
    public active : ActivatedRoute
  ) {}

  ngOnInit() {
    this.serveIDSubscription = this.active.params.subscribe(
    (params : Params) => { this.serveID = params['id'] });

    this.usuariosSubscription = this.servico.getUsuarios(this.serveID).pipe(
      switchMap(users => this.usuarioService.resolveProfilePhotos(users))
    ).subscribe(data => {
    this.usuariosArray = data;
    this.isLoading = false;
    });

    if(getCurrentFirebaseUser() != null){
      this.entrarSair = true;
      this.userId = getCurrentFirebaseUser().uid;
    } else this.entrarSair = false;
  }

  ngOnDestroy(){
    this.usuariosSubscription?.unsubscribe();
    this.serveIDSubscription?.unsubscribe();
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

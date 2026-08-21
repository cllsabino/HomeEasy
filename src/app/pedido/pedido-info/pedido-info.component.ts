import { getCurrentFirebaseUser } from '../../shared/utils/firebase-auth.utils';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { LoginServiceService } from '../../Servicos/login-service.service';

@Component({
  standalone: false,
  selector: 'app-pedido-info',
  templateUrl: './pedido-info.component.html',
  styleUrls: ['./pedido-info.component.css']
})
export class PedidoInfoComponent implements OnInit {
  userId : string; //id do usuario
  entrarSair : boolean;

  constructor(
    public afAuth : AngularFireAuth,
    public loginService : LoginServiceService,
    public router : Router
  ) { }

  ngOnInit() {
    if(getCurrentFirebaseUser() != null){
      this.entrarSair = true;
      this.userId = getCurrentFirebaseUser().uid;
    }else this.entrarSair = false;
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

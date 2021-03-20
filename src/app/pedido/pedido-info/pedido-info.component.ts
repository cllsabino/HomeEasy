import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

import { LoginServiceService } from '../../Servicos/login-service.service';

@Component({
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
    if(this.afAuth.auth.currentUser != null){
      this.entrarSair = true;
      this.userId = this.afAuth.auth.currentUser.uid;
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

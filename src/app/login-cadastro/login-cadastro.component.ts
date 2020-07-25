import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Component({
  selector: 'app-login-cadastro',
  templateUrl: './login-cadastro.component.html',
  styleUrls: ['./login-cadastro.component.css']
})
export class LoginCadastroComponent implements OnInit {
  loginEmail : string = "";
  loginPassword : string = "";
  registerEmail : string = "";
  registerPassword : string ="";

  constructor(public afAuth : AngularFireAuth) { }

  ngOnInit() {
  }

  async login(){
    const { loginEmail, loginPassword} = this
    try { 
     const res = await this.afAuth.auth.signInWithEmailAndPassword(loginEmail, loginPassword);
    } catch (error) { 
      console.error(error); 
    }
  }
  async register(){
    const { registerEmail, registerPassword} = this
    try { 
     const res = await this.afAuth.auth.createUserWithEmailAndPassword(registerEmail, registerPassword);
    } catch (error) { 
      console.error(error); 
    }
  }
}

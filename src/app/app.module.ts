import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { LoginCadastroComponent } from './login-cadastro/login-cadastro.component';
import { HomeComponent } from './home/home.component';
import { DuvidasComponent } from './duvidas/duvidas.component';
import { ContatoComponent } from './contato/contato.component';
import { RecuperarSenhaComponent } from './login-cadastro/recuperar-senha/recuperar-senha.component';
import { LoginServiceService } from './login-cadastro/login-service.service';
import { PerfilComponent } from './perfil/perfil.component';
import { SobreNosComponent } from './sobre-nos/sobre-nos.component';
import { AlvaroComponentComponent } from './sobre-nos/alvaro-component/alvaro-component.component';
import { CarlosComponentComponent } from './sobre-nos/carlos-component/carlos-component.component';
import { PericlesComponentComponent } from './sobre-nos/pericles-component/pericles-component.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginCadastroComponent,
    HomeComponent,
    DuvidasComponent,
    ContatoComponent,
    AlvaroComponentComponent,
    CarlosComponentComponent,
    PericlesComponentComponent,
    SobreNosComponent,
    RecuperarSenhaComponent,
    PerfilComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ], 
  providers: [LoginServiceService],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule { }

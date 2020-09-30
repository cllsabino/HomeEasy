import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AppComponent } from './app.component';
import { LoginCadastroComponent } from './login-cadastro/login-cadastro.component';
import { HomeComponent } from './home/home.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { DuvidasComponent } from './duvidas/duvidas.component';
import { ContatoComponent } from './contato/contato.component';
import { SobreNosComponent } from './sobre-nos/sobre-nos.component';
import { AlvaroComponentComponent } from './sobre-nos/alvaro-component/alvaro-component.component';
import { CarlosComponentComponent } from './sobre-nos/carlos-component/carlos-component.component';
import { PericlesComponentComponent } from './sobre-nos/pericles-component/pericles-component.component';
import { RecuperarSenhaComponent } from './login-cadastro/recuperar-senha/recuperar-senha.component';
import { LoginServiceService } from './login-cadastro/login-service.service';

const appRoutes : Routes = [
  {path : '', redirectTo: 'home', pathMatch: 'full'},
  {path : 'login', component : LoginCadastroComponent},
  {path : 'home', component : HomeComponent},
  {path : 'duvidas', component : DuvidasComponent},
  {path : 'contato', component : ContatoComponent},
  {path : 'sobrenos', component : SobreNosComponent},
  {path : 'alvaro', component : AlvaroComponentComponent},
  {path : 'carlos', component : CarlosComponentComponent},
  {path : 'pericles', component : PericlesComponentComponent},
  {path : 'recuperar-senha', component : RecuperarSenhaComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginCadastroComponent,
    HomeComponent,
    DuvidasComponent,
    ContatoComponent,
    SobreNosComponent,
    AlvaroComponentComponent,
    CarlosComponentComponent,
    PericlesComponentComponent,
    RecuperarSenhaComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes), 
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
  ], 
  providers: [LoginServiceService],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule { }

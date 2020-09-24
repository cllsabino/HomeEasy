import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AppComponent } from './app.component';
import { LoginCadastroComponent } from './login-cadastro/login-cadastro.component';
import { HomeComponent } from './home/home.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { DuvidasComponent } from './duvidas/duvidas.component';
import { SobreNosComponent } from './sobre-nos/sobre-nos.component';
import { ContatoComponent } from './contato/contato.component';
import { CarlosComponentComponent } from './sobre-nos/carlos-component/carlos-component.component';
import { PericlesComponentComponent } from './sobre-nos/pericles-component/pericles-component.component';
import { AlvaroComponentComponent } from './sobre-nos/alvaro-component/alvaro-component.component';

const appRoutes : Routes = [
  {path : '', redirectTo: 'home', pathMatch: 'full'},
  {path : 'login', component : LoginCadastroComponent},
  {path : 'home', component : HomeComponent},
  {path : 'sobrenos', component : SobreNosComponent},
  {path : 'duvidas', component : DuvidasComponent},
  {path : 'contato', component : ContatoComponent}
 ];

@NgModule({
  declarations: [
    AppComponent,
    LoginCadastroComponent,
    HomeComponent,
    DuvidasComponent,
    SobreNosComponent,
    ContatoComponent,
    CarlosComponentComponent,
    PericlesComponentComponent,
    AlvaroComponentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes), 
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ], 
  providers: [],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule { }

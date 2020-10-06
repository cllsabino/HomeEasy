import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { HomeComponent } from './home/home.component';
import { DuvidasComponent } from './duvidas/duvidas.component';
import { ContatoComponent } from './contato/contato.component';
import { PerfilComponent } from './perfil/perfil.component';
import { SobreModule } from './sobre-nos/sobre.module';
import { LoginServiceService } from './login-cadastro/login-service.service';
import { LoginModule } from './login-cadastro/login.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DuvidasComponent,
    ContatoComponent,
    PerfilComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    SobreModule,
    LoginModule,
    AppRoutingModule
  ], 
  providers: [ LoginServiceService ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { HomeComponent } from './home/home.component';
import { ContatoComponent } from './contato/contato.component';
import { SobreModule } from './sobre-nos/sobre.module';
import { LoginServiceService } from './login-cadastro/login-service.service';
import { LoginModule } from './login-cadastro/login.module';
import { ContatoService } from './contato/contato.service';
import { FeedModule } from './feed/feed.module';
import { PerfilModule } from './perfil/perfil.module';
import { ServicosService } from './feed/servicos.service';
import { UsuarioService } from './perfil/usuario.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ContatoComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    SobreModule,
    LoginModule,
    FeedModule,
    PerfilModule,
    AppRoutingModule
  ], 
  providers: [ LoginServiceService, ContatoService, ServicosService, UsuarioService ],
  bootstrap: [AppComponent]
})
export class AppModule { }

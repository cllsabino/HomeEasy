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

const appRoutes : Routes = [
  {path : '', redirectTo: 'home', pathMatch: 'full'},
  {path : 'login', component : LoginCadastroComponent},
  {path : 'home', component : HomeComponent}
 ];

@NgModule({
  declarations: [
    AppComponent,
    LoginCadastroComponent,
    HomeComponent
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

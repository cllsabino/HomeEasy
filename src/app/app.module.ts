import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginCadastroComponent } from './login-cadastro/login-cadastro.component';
import { HomeComponent } from './home/home.component';

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
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule { }

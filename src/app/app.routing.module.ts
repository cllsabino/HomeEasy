import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { LoginCadastroComponent } from './login-cadastro/login-cadastro.component';
import { HomeComponent } from './home/home.component';
import { DuvidasComponent } from './duvidas/duvidas.component';
import { ContatoComponent } from './contato/contato.component';
import { RecuperarSenhaComponent } from './login-cadastro/recuperar-senha/recuperar-senha.component';
import { PerfilComponent } from './perfil/perfil.component';

const appRoutes : Routes = [
    {path : '', redirectTo: 'home', pathMatch: 'full'},
    {path : 'login', component : LoginCadastroComponent},
    {path : 'home', component : HomeComponent},
    {path : 'duvidas', component : DuvidasComponent},
    {path : 'contato', component : ContatoComponent},
    {path : 'recuperar-senha', component : RecuperarSenhaComponent},
    {path : 'perfil', component : PerfilComponent}
];

@NgModule({
    imports:[
        RouterModule.forRoot(appRoutes)
    ],
    exports:[
        RouterModule
    ]
})

export class AppRoutingModule {}
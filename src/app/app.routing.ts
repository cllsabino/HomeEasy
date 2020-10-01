import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { LoginCadastroComponent } from './login-cadastro/login-cadastro.component';
import { HomeComponent } from './home/home.component';
import { DuvidasComponent } from './duvidas/duvidas.component';
import { ContatoComponent } from './contato/contato.component';
import { SobreNosComponent } from './sobre-nos/sobre-nos.component';
import { AlvaroComponentComponent } from './sobre-nos/alvaro-component/alvaro-component.component';
import { CarlosComponentComponent } from './sobre-nos/carlos-component/carlos-component.component';
import { PericlesComponentComponent } from './sobre-nos/pericles-component/pericles-component.component';
import { RecuperarSenhaComponent } from './login-cadastro/recuperar-senha/recuperar-senha.component';
import { PerfilComponent } from './perfil/perfil.component';

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
    {path : 'recuperar-senha', component : RecuperarSenhaComponent},
    {path : 'perfil', component : PerfilComponent}
];

export const routing : ModuleWithProviders = RouterModule.forRoot(appRoutes);
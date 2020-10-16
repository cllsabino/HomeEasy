import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { DuvidasComponent } from './duvidas/duvidas.component';
import { ContatoComponent } from './contato/contato.component';

const appRoutes : Routes = [
    {path : '', redirectTo: 'home', pathMatch: 'full'},
    {path : 'home', component : HomeComponent},
    {path : 'duvidas', component : DuvidasComponent},
    {path : 'contato', component : ContatoComponent},
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
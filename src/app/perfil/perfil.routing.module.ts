import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { PerfilComponent } from './perfil.component';

const perfilRoutes : Routes = [
    {path : 'feed', component : PerfilComponent},
];

@NgModule({
    imports:[
        RouterModule.forChild(perfilRoutes)
    ],
    exports:[
        RouterModule
    ]
})

export class PerfilRoutingModule {}
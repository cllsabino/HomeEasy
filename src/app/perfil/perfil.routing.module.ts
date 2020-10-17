import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { PerfilComponent } from './perfil.component';
import { AuthGuardGuard } from "../guardas/auth-guard.guard";


const perfilRoutes : Routes = [
    {path : 'perfil', component : PerfilComponent, canActivate : [AuthGuardGuard] },
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
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { PerfilComponent } from './perfil.component';
import { AuthGuardGuard } from "../guardas/auth-guard.guard";
import { EditarInfoComponent } from './editar-info/editar-info.component';

const perfilRoutes : Routes = [
    {path : 'usuario/:id', component : PerfilComponent, canActivate : [AuthGuardGuard] },
    {path : 'editar', component : EditarInfoComponent, canActivate : [AuthGuardGuard] } 
    
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
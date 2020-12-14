import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { PerfilComponent } from './perfil.component';
import { AuthGuardGuard } from "../guardas/auth-guard.guard";
import { EditarInfoComponent } from './editar-info/editar-info.component';
import { PerfilPedidoComponent } from './perfil-pedido/perfil-pedido.component';

const perfilRoutes : Routes = [
    {path : 'usuario/:id', component : PerfilComponent, canActivate : [AuthGuardGuard] },
    {path : 'editar', component : EditarInfoComponent, canActivate : [AuthGuardGuard] },
    {path : 'serviço/:id/usuario/:idd', component : PerfilPedidoComponent }
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
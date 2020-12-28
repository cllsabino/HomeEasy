import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { PedidoComponent } from './pedido.component';
import { PedidoInfoComponent } from './pedido-info/pedido-info.component';
import { AuthGuardGuard } from "../guardas/auth-guard.guard";

const pedidoRoutes : Routes = [
    {path : 'serviço/:id/usuario/:idd/pedido', component : PedidoComponent, canActivate : [AuthGuardGuard] },
    {path : 'pedido-info', component : PedidoInfoComponent },
];

@NgModule({
    imports:[
        RouterModule.forChild(pedidoRoutes)
    ],
    exports:[
        RouterModule
    ]
})

export class PedidoRoutingModule {}
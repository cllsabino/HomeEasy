import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { PedidoComponent } from './pedido.component';
import { PedidoInfoComponent } from './pedido-info/pedido-info.component';
import { PedidoFeitoComponent } from './pedido-feito/pedido-feito.component';
import { PedidoRecebidoComponent } from './pedido-recebido/pedido-recebido.component';
import { AuthGuardGuard } from "../guardas/auth-guard.guard";

const pedidoRoutes : Routes = [
    {path : 'serviço/:id/usuario/:idd/pedido', component : PedidoComponent, canActivate : [AuthGuardGuard] },
    {path : 'pedido-info', component : PedidoInfoComponent },
    {path : 'usuario/:id/pedidos-feitos', component : PedidoFeitoComponent, canActivate : [AuthGuardGuard] },
    {path : 'usuario/:id/pedidos-recebidos', component : PedidoRecebidoComponent, canActivate : [AuthGuardGuard] },
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
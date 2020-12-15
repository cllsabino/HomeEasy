import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { PedidoComponent } from './pedido.component';
import { PedidoInfoComponent } from './pedido-info/pedido-info.component';

const pedidoRoutes : Routes = [
    {path : 'pedido', component : PedidoComponent },
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
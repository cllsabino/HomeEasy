import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

import { PedidoComponent } from './pedido.component';
import { PedidoInfoComponent } from './pedido-info/pedido-info.component';
import { PedidoRoutingModule } from './pedido.routing.module';

@NgModule({
    imports:[
    CommonModule,
        FormsModule, 
        PedidoRoutingModule
    ],
    declarations:[
        PedidoComponent,
        PedidoInfoComponent
    ], 
    exports:[

    ],
    providers:[]
})

export class PedidoModule {}
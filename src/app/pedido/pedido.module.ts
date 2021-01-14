import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

import { PedidoComponent } from './pedido.component';
import { PedidoInfoComponent } from './pedido-info/pedido-info.component';
import { PedidoRoutingModule } from './pedido.routing.module';
import { PedidoFeitoComponent } from './pedido-feito/pedido-feito.component';
import { PedidoRecebidoComponent } from './pedido-recebido/pedido-recebido.component';

@NgModule({
    imports:[
        CommonModule,
        FormsModule, 
        PedidoRoutingModule
    ],
    declarations:[
        PedidoComponent,
        PedidoInfoComponent,
        PedidoFeitoComponent,
        PedidoRecebidoComponent
    ], 
    exports:[

    ],
    providers:[]
})

export class PedidoModule {}
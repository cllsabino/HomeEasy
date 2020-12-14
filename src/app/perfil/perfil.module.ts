import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

import { PerfilComponent } from './perfil.component';
import { PerfilRoutingModule } from './perfil.routing.module';
import { EditarInfoComponent } from './editar-info/editar-info.component';
import { PerfilPedidoComponent } from './perfil-pedido/perfil-pedido.component';

@NgModule({
    imports:[
        CommonModule,
        FormsModule, 
        PerfilRoutingModule
    ],
    declarations:[
        PerfilComponent,
        EditarInfoComponent,
        PerfilPedidoComponent
    ], 
    exports:[

    ],
    providers:[]
})

export class PerfilModule {}

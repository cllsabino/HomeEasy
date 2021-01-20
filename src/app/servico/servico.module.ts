import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

import { ServicoComponent } from './servico.component';
import { ServicoDetalheComponent } from './servico-detalhe/servico-detalhe.component';
import { ServicoRoutingModule } from './servico.routing.module';

@NgModule({
    imports:[
        CommonModule,
        FormsModule, 
        ServicoRoutingModule
    ],
    declarations:[
        ServicoComponent,
        ServicoDetalheComponent
    ], 
    exports:[

    ],
    providers:[]
})

export class ServicoModule {}
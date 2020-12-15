import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

import { FeedComponent } from './feed.component';
import { FeedRoutingModule } from "./feed.routing.module";
import { ServicoDetalheComponent } from './servico-detalhe/servico-detalhe.component';
import { ProcurarServicoComponent } from './procurar-servico/procurar-servico.component';

@NgModule({
    imports:[
        CommonModule,
        FormsModule, 
        FeedRoutingModule
    ],
    declarations:[
        FeedComponent, 
        ServicoDetalheComponent,
        ProcurarServicoComponent
    ], 
    exports:[

    ],
    providers:[]
})

export class FeedModule {}
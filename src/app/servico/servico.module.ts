import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

import { ServicoComponent } from './servico.component';
import { ServicoRoutingModule } from './servico.routing.module';

@NgModule({
    imports:[
        CommonModule,
        FormsModule, 
        ServicoRoutingModule
    ],
    declarations:[
        ServicoComponent,
    ], 
    exports:[

    ],
    providers:[]
})

export class ServicoModule {}
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

import { ProfissionalComponent } from './profissional.component';
import { ProfissionalRoutingModule } from './profissional.routing.module';

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        ProfissionalRoutingModule
    ],
    declarations:[
        ProfissionalComponent
    ], 
    exports:[],
    providers:[]
})

export class ProfissionalModule {}
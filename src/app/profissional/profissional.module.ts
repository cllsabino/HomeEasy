import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

import { ProfissionalComponent } from './profissional.component';
import { AddprofissioanlComponent } from './addprofissioanl/addprofissioanl.component';
import { EditarInfoComponent } from './editar-info/editar-info.component';
import { ProfissionalRoutingModule } from './profissional.routing.module';

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        ProfissionalRoutingModule
    ],
    declarations:[
        ProfissionalComponent,
        AddprofissioanlComponent,
        EditarInfoComponent
    ], 
    exports:[],
    providers:[]
})

export class ProfissionalModule {}
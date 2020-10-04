import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SobreRoutingModule } from './sobre.routing.module';
import { SobreNosComponent } from './sobre-nos.component';
import { AlvaroComponentComponent } from './alvaro-component/alvaro-component.component';
import { CarlosComponentComponent } from './carlos-component/carlos-component.component';
import { PericlesComponentComponent } from './pericles-component/pericles-component.component';

@NgModule({
    imports:[
        CommonModule,
        SobreRoutingModule
    ],
    declarations:[
        SobreNosComponent,
        AlvaroComponentComponent,
        CarlosComponentComponent,
        PericlesComponentComponent
    ],
    exports:[]
})

export class SobreModule {}
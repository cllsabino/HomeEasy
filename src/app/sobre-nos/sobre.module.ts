import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SobreRoutingModule } from './sobre.routing.module';
import { SobreNosComponent } from './sobre-nos.component';

@NgModule({
    imports:[
        CommonModule,
        SobreRoutingModule
    ],
    declarations:[
        SobreNosComponent,
    ],
    exports:[]
})

export class SobreModule {}
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

import { PerfilComponent } from './perfil.component';
import { PerfilRoutingModule } from './perfil.routing.module';

@NgModule({
    imports:[
        CommonModule,
        FormsModule, 
        PerfilRoutingModule
    ],
    declarations:[
        PerfilComponent
    ], 
    exports:[

    ],
    providers:[]
})

export class PerfilModule {}

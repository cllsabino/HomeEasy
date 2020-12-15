import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { SobreNosComponent } from './sobre-nos.component';

const sobreRoutes : Routes = [
    {path : 'sobrenos', component : SobreNosComponent}
];

@NgModule({
    imports:[
        RouterModule.forChild(sobreRoutes)
    ],
    exports:[
        RouterModule
    ]
})

export class SobreRoutingModule {}
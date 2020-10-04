import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { SobreNosComponent } from './sobre-nos.component';
import { AlvaroComponentComponent } from './alvaro-component/alvaro-component.component';
import { CarlosComponentComponent } from './carlos-component/carlos-component.component';
import { PericlesComponentComponent } from './pericles-component/pericles-component.component';

const sobreRoutes : Routes = [
    {path : 'sobrenos', component : SobreNosComponent},
    {path : 'alvaro', component : AlvaroComponentComponent},
    {path : 'carlos', component : CarlosComponentComponent},
    {path : 'pericles', component : PericlesComponentComponent},
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
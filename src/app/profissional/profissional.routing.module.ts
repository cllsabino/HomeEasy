import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { ProfissionalComponent } from './profissional.component';
import { AuthGuardGuard } from './../guardas/auth-guard.guard';

const profissionalRoutes : Routes = [
    {path : 'profissional', component : ProfissionalComponent},
];

@NgModule({
    imports:[
        RouterModule.forChild(profissionalRoutes)
    ],
    exports:[
        RouterModule
    ]
})

export class ProfissionalRoutingModule {}
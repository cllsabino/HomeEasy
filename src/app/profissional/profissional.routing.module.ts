import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { ProfissionalComponent } from './profissional.component';
import { AddprofissioanlComponent } from './addprofissioanl/addprofissioanl.component';
import { EditarInfoComponent } from './editar-info/editar-info.component';
import { AuthGuardGuard } from './../guardas/auth-guard.guard';

const profissionalRoutes : Routes = [
    {path : 'profissional', component : ProfissionalComponent},
    {path : 'serprofissional', component : AddprofissioanlComponent, canActivate : [AuthGuardGuard]},
    {path : 'serviços/:id/detalhe/:idd/editar', component : EditarInfoComponent, canActivate : [AuthGuardGuard]}
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
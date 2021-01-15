import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { ServicoComponent } from './servico.component';
import { AuthGuardGuard } from "../guardas/auth-guard.guard";

const servicoRoutes : Routes = [
    {path : 'serviços/:id', component : ServicoComponent, canActivate : [AuthGuardGuard] },
];

@NgModule({
    imports:[
        RouterModule.forChild(servicoRoutes)
    ],
    exports:[
        RouterModule
    ]
})

export class ServicoRoutingModule {}
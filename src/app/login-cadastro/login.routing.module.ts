import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { LoginCadastroComponent } from './login-cadastro.component';
import { RecuperarSenhaComponent } from './recuperar-senha/recuperar-senha.component';
import { LoginGuard } from './../guardas/login.guard';

const loginRoutes : Routes = [
    {path : 'login', component : LoginCadastroComponent, canActivate : [LoginGuard] },
    {path : 'recuperar-senha', component : RecuperarSenhaComponent},
];

@NgModule({
    imports:[
        RouterModule.forChild(loginRoutes)
    ],
    exports:[
        RouterModule
    ]
})

export class LoginRoutingModule {}
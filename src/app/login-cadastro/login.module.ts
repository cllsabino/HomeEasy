import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

import { LoginCadastroComponent } from "./login-cadastro.component";
import { RecuperarSenhaComponent } from './recuperar-senha/recuperar-senha.component';
import { LoginServiceService } from './login-service.service';
import { LoginRoutingModule } from './login.routing.module';

@NgModule({
    imports:[
        CommonModule,
        FormsModule, 
        LoginRoutingModule
    ],
    declarations:[
        LoginCadastroComponent,
        RecuperarSenhaComponent
    ],
    exports:[

    ],
    providers:[LoginServiceService]
})

export class LoginModule {}
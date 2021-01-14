import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { ChatComponent } from './chat.component';
import { ListaContatoComponent } from './lista-contato/lista-contato.component';
import { AuthGuardGuard } from "../guardas/auth-guard.guard";

const chatRoutes : Routes = [
    {path : 'chat/:id', component : ChatComponent, canActivate : [AuthGuardGuard] },
    {path : 'conversas', component : ListaContatoComponent, canActivate : [AuthGuardGuard] },
];

@NgModule({
    imports:[
        RouterModule.forChild(chatRoutes)
    ],
    exports:[
        RouterModule
    ]
})

export class ChatRoutingModule {}
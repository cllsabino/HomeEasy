import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { FeedComponent } from './feed.component';
import { ServicoDetalheComponent } from './servico-detalhe/servico-detalhe.component';


const feedRoutes : Routes = [
    {path : 'feed', component : FeedComponent },
    {path : 'serviço/:id', component : ServicoDetalheComponent}
];

@NgModule({
    imports:[
        RouterModule.forChild(feedRoutes)
    ],
    exports:[
        RouterModule
    ]
})

export class FeedRoutingModule {}
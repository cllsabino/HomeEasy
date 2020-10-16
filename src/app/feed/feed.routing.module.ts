import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { FeedComponent } from './feed.component';

const feedRoutes : Routes = [
    {path : 'feed', component : FeedComponent},
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
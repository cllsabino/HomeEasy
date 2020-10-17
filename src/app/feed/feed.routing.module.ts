import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { FeedComponent } from './feed.component';
import { AuthGuardGuard } from "../guardas/auth-guard.guard";

const feedRoutes : Routes = [
    {path : 'feed', component : FeedComponent, canActivate : [AuthGuardGuard] },
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
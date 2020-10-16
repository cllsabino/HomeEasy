import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

import { FeedComponent } from './feed.component';
import { FeedRoutingModule } from "./feed.routing.module";

@NgModule({
    imports:[
        CommonModule,
        FormsModule, 
        FeedRoutingModule
    ],
    declarations:[
        FeedComponent
    ], 
    exports:[

    ],
    providers:[]
})

export class FeedModule {}
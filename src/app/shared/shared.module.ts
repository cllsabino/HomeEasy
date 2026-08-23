import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NavbarComponent } from './navbar/navbar.component';
import { ServiceIconComponent } from './service-icon/service-icon.component';
import { ActionFeedbackComponent } from './action-feedback/action-feedback.component';
import { LoadingStateComponent } from './loading-state/loading-state.component';
import { BackLinkComponent } from './back-link/back-link.component';
import { DialogComponent } from './dialog/dialog.component';
import { RequestAttachmentGalleryComponent } from './request-attachment-gallery/request-attachment-gallery.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [NavbarComponent, ServiceIconComponent, ActionFeedbackComponent, LoadingStateComponent, BackLinkComponent, DialogComponent, RequestAttachmentGalleryComponent],
  exports: [NavbarComponent, ServiceIconComponent, ActionFeedbackComponent, LoadingStateComponent, BackLinkComponent, DialogComponent, RequestAttachmentGalleryComponent]
})
export class SharedModule {}

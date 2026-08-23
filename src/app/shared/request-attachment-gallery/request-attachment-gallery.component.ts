import { Component, Input } from '@angular/core';

import { RequestAttachment } from '../models/service-request-field';

@Component({
  standalone: false,
  selector: 'app-request-attachment-gallery',
  templateUrl: './request-attachment-gallery.component.html',
  styleUrls: ['./request-attachment-gallery.component.css']
})
export class RequestAttachmentGalleryComponent {
  visibleAttachments: RequestAttachment[] = [];

  @Input()
  set attachments(attachments: RequestAttachment[]) {
    this.visibleAttachments = (attachments || []).filter(attachment => Boolean(attachment.dataUrl));
  }
}

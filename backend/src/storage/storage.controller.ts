import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { AuthenticatedUser } from '../auth/authenticated-user.decorator';
import { Public } from '../auth/public.decorator';
import { PublicUser } from '../shared/utils/public-user.utils';
import { CreateUploadDto } from './dto/create-upload.dto';
import { StorageService } from './storage.service';

@Controller('media')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('uploads')
  createUpload(@AuthenticatedUser() authenticatedUser: PublicUser, @Body() createUploadDto: CreateUploadDto) {
    return this.storageService.createUpload(authenticatedUser.id, createUploadDto);
  }

  @Post(':mediaId/complete')
  completeUpload(
    @Param('mediaId', ParseUUIDPipe) mediaId: string,
    @AuthenticatedUser() authenticatedUser: PublicUser
  ) {
    return this.storageService.completeUpload(mediaId, authenticatedUser.id);
  }

  @Public()
  @Get(':mediaId/public')
  async openPublicProfilePhoto(@Param('mediaId', ParseUUIDPipe) mediaId: string, @Res() response: Response) {
    const downloadUrl = await this.storageService.createPublicProfilePhotoUrl(mediaId);
    return response.redirect(downloadUrl);
  }

  @Get(':mediaId/download')
  createDownloadUrl(
    @Param('mediaId', ParseUUIDPipe) mediaId: string,
    @AuthenticatedUser() authenticatedUser: PublicUser
  ) {
    return this.storageService.createDownloadUrl(mediaId, authenticatedUser.id, authenticatedUser.role);
  }
}

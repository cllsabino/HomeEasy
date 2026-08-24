import { Body, Controller, Get, Param, ParseFilePipeBuilder, ParseUUIDPipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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

  @Post(':mediaId/content')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  uploadContent(
    @Param('mediaId', ParseUUIDPipe) mediaId: string,
    @UploadedFile(new ParseFilePipeBuilder().addMaxSizeValidator({ maxSize: 10 * 1024 * 1024 }).build())
    file: { buffer: Buffer; mimetype: string; size: number },
    @AuthenticatedUser() authenticatedUser: PublicUser
  ) {
    return this.storageService.uploadContent(mediaId, authenticatedUser.id, file);
  }

  @Public()
  @Get(':mediaId/public')
  async openPublicProfilePhoto(@Param('mediaId', ParseUUIDPipe) mediaId: string, @Res() response: Response) {
    const photo = await this.storageService.openPublicProfilePhoto(mediaId);
    response.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    response.setHeader('Content-Type', photo.contentType);
    return photo.stream.pipe(response);
  }

  @Get(':mediaId/download')
  createDownloadUrl(
    @Param('mediaId', ParseUUIDPipe) mediaId: string,
    @AuthenticatedUser() authenticatedUser: PublicUser
  ) {
    return this.storageService.createDownloadUrl(mediaId, authenticatedUser.id, authenticatedUser.role);
  }
}

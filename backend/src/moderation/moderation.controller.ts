import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';

import { AdminGuard } from '../auth/admin.guard';
import { AuthenticatedUser } from '../auth/authenticated-user.decorator';
import { PublicUser } from '../shared/utils/public-user.utils';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { ReviewModerationDto } from './dto/review-moderation.dto';
import { SetVerificationStatusDto } from './dto/set-verification-status.dto';
import { SubmitDocumentDto } from './dto/submit-document.dto';
import { ModerationService } from './moderation.service';

@Controller()
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Post('verification/documents')
  submitDocument(
    @AuthenticatedUser() authenticatedUser: PublicUser,
    @Body() submitDocumentDto: SubmitDocumentDto
  ) {
    return this.moderationService.submitDocument(authenticatedUser.id, submitDocumentDto);
  }

  @Get('verification/documents/me')
  findOwnDocuments(@AuthenticatedUser() authenticatedUser: PublicUser) {
    return this.moderationService.findOwnDocuments(authenticatedUser.id);
  }

  @Post('reports')
  createReport(@AuthenticatedUser() authenticatedUser: PublicUser, @Body() createReportDto: CreateReportDto) {
    return this.moderationService.createReport(authenticatedUser.id, createReportDto);
  }

  @Post('orders/:orderId/disputes')
  createDispute(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @AuthenticatedUser() authenticatedUser: PublicUser,
    @Body() createDisputeDto: CreateDisputeDto
  ) {
    return this.moderationService.createDispute(orderId, authenticatedUser.id, createDisputeDto);
  }

  @UseGuards(AdminGuard)
  @Get('admin/moderation')
  findAdminQueue() {
    return this.moderationService.findAdminQueue();
  }

  @UseGuards(AdminGuard)
  @Get('admin/metrics')
  findAdminMetrics() {
    return this.moderationService.findAdminMetrics();
  }

  @UseGuards(AdminGuard)
  @Patch('admin/verification/documents/:documentId')
  reviewDocument(
    @Param('documentId', ParseUUIDPipe) documentId: string,
    @AuthenticatedUser() authenticatedUser: PublicUser,
    @Body() reviewModerationDto: ReviewModerationDto
  ) {
    return this.moderationService.reviewDocument(
      documentId,
      authenticatedUser.id,
      reviewModerationDto.status,
      reviewModerationDto.notes
    );
  }

  @UseGuards(AdminGuard)
  @Patch('admin/reports/:reportId')
  reviewReport(
    @Param('reportId', ParseUUIDPipe) reportId: string,
    @AuthenticatedUser() authenticatedUser: PublicUser,
    @Body() reviewModerationDto: ReviewModerationDto
  ) {
    return this.moderationService.reviewReport(
      reportId,
      authenticatedUser.id,
      reviewModerationDto.status,
      reviewModerationDto.notes
    );
  }

  @UseGuards(AdminGuard)
  @Patch('admin/disputes/:disputeId')
  reviewDispute(
    @Param('disputeId', ParseUUIDPipe) disputeId: string,
    @AuthenticatedUser() authenticatedUser: PublicUser,
    @Body() reviewModerationDto: ReviewModerationDto
  ) {
    return this.moderationService.reviewDispute(
      disputeId,
      authenticatedUser.id,
      reviewModerationDto.status,
      reviewModerationDto.notes
    );
  }

  @UseGuards(AdminGuard)
  @Patch('admin/professionals/:professionalId/verification')
  setVerificationStatus(
    @Param('professionalId', ParseUUIDPipe) professionalId: string,
    @Body() setVerificationStatusDto: SetVerificationStatusDto
  ) {
    return this.moderationService.setVerificationStatus(professionalId, setVerificationStatusDto.status);
  }
}

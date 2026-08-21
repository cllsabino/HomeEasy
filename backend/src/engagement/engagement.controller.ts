import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';

import { AuthenticatedUser } from '../auth/authenticated-user.decorator';
import { Public } from '../auth/public.decorator';
import { PublicUser } from '../shared/utils/public-user.utils';
import { CreateReviewDto } from './dto/create-review.dto';
import { RespondReviewDto } from './dto/respond-review.dto';
import { EngagementService } from './engagement.service';

@Controller()
export class EngagementController {
  constructor(private readonly engagementService: EngagementService) {}

  @Get('favorites')
  findFavorites(@AuthenticatedUser() authenticatedUser: PublicUser) {
    return this.engagementService.findFavorites(authenticatedUser.id);
  }

  @Put('favorites/:professionalId')
  addFavorite(
    @AuthenticatedUser() authenticatedUser: PublicUser,
    @Param('professionalId', ParseUUIDPipe) professionalId: string
  ) {
    return this.engagementService.addFavorite(authenticatedUser.id, professionalId);
  }

  @Delete('favorites/:professionalId')
  removeFavorite(
    @AuthenticatedUser() authenticatedUser: PublicUser,
    @Param('professionalId', ParseUUIDPipe) professionalId: string
  ) {
    return this.engagementService.removeFavorite(authenticatedUser.id, professionalId);
  }

  @Post('orders/:orderId/reviews')
  createReview(
    @AuthenticatedUser() authenticatedUser: PublicUser,
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @Body() createReviewDto: CreateReviewDto
  ) {
    return this.engagementService.createReview(orderId, authenticatedUser.id, createReviewDto);
  }

  @Post('reviews/:reviewId/response')
  respondReview(
    @AuthenticatedUser() authenticatedUser: PublicUser,
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
    @Body() respondReviewDto: RespondReviewDto
  ) {
    return this.engagementService.respondReview(reviewId, authenticatedUser.id, respondReviewDto.response);
  }

  @Public()
  @Get('professionals/:professionalId/reviews')
  findProfessionalReviews(@Param('professionalId', ParseUUIDPipe) professionalId: string) {
    return this.engagementService.findProfessionalReviews(professionalId);
  }
}

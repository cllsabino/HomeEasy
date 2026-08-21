import { SetMetadata } from '@nestjs/common';

export const publicRouteKey = 'isPublic';
export const Public = () => SetMetadata(publicRouteKey, true);

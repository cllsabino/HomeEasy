import { BadRequestException } from '@nestjs/common';

import { MediaPurpose } from './media-purpose.enum';

const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const allowedDocumentTypes = new Set([...allowedImageTypes, 'application/pdf']);

export function validateMediaType(purpose: MediaPurpose, contentType: string) {
  const allowedTypes =
    purpose === MediaPurpose.VerificationDocument ? allowedDocumentTypes : allowedImageTypes;
  if (!allowedTypes.has(contentType.toLowerCase())) {
    throw new BadRequestException('O formato do arquivo não é permitido para esta finalidade.');
  }
}

export function sanitizeFileName(fileName: string) {
  const sanitized = fileName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 120);
  return sanitized || 'arquivo';
}

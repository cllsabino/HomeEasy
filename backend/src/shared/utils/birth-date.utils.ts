import { BadRequestException } from '@nestjs/common';

const minimumAge = 18;

export function assertAdultBirthDate(birthDate: string) {
  const birth = new Date(`${birthDate}T00:00:00Z`);
  const today = new Date();
  let age = today.getUTCFullYear() - birth.getUTCFullYear();
  const hasNotHadBirthday =
    today.getUTCMonth() < birth.getUTCMonth() ||
    (today.getUTCMonth() === birth.getUTCMonth() && today.getUTCDate() < birth.getUTCDate());

  if (hasNotHadBirthday) {
    age -= 1;
  }
  if (!Number.isFinite(birth.getTime()) || age < minimumAge) {
    throw new BadRequestException('É necessário ter pelo menos 18 anos para criar uma conta.');
  }
}

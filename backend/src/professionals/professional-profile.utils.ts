import { ProfessionalProfile } from './professional-profile.entity';

function mapServices(profile: ProfessionalProfile) {
  return (profile.services || [])
    .filter((professionalService) => Boolean(professionalService.service))
    .map((professionalService) => ({
      id: professionalService.service.id,
      name: professionalService.service.name,
      category: professionalService.service.category,
      basePrice: professionalService.basePrice === null ? null : Number(professionalService.basePrice),
      description: professionalService.description,
      isActive: professionalService.isActive
    }));
}

export function toPublicProfessionalProfile(profile: ProfessionalProfile, distanceMeters?: number) {
  return {
    id: profile.userId,
    name: profile.user.name,
    bio: profile.bio,
    city: profile.city,
    state: profile.state,
    serviceRadiusKm: profile.serviceRadiusKm,
    yearsOfExperience: profile.yearsOfExperience,
    isAvailable: profile.isAvailable,
    verificationStatus: profile.verificationStatus,
    memberSince: profile.createdAt,
    distanceKm: distanceMeters === undefined ? null : Math.round(distanceMeters / 100) / 10,
    services: mapServices(profile)
  };
}

export function toPrivateProfessionalProfile(profile: ProfessionalProfile) {
  return {
    ...toPublicProfessionalProfile(profile),
    phone: profile.phone,
    latitude: profile.location.coordinates[1],
    longitude: profile.location.coordinates[0]
  };
}

export enum VerificationDocumentType {
  Identity = 'identity',
  AddressProof = 'address_proof',
  ProfessionalCertificate = 'professional_certificate'
}

export enum ModerationStatus {
  Pending = 'pending',
  InReview = 'in_review',
  Approved = 'approved',
  Rejected = 'rejected',
  Resolved = 'resolved'
}

export enum ReportCategory {
  Fraud = 'fraud',
  Harassment = 'harassment',
  InappropriateContent = 'inappropriate_content',
  SuspiciousRequest = 'suspicious_request',
  OffPlatformPayment = 'off_platform_payment',
  Other = 'other'
}

export enum DisputeReason {
  ServiceNotPerformed = 'service_not_performed',
  ServiceQuality = 'service_quality',
  PriceConflict = 'price_conflict',
  PropertyDamage = 'property_damage',
  Conduct = 'conduct',
  Other = 'other'
}

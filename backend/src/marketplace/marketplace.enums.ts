export enum ServiceRequestStatus {
  Requested = 'requested',
  ProposalReceived = 'proposal_received',
  Accepted = 'accepted',
  Cancelled = 'cancelled',
  Expired = 'expired'
}

export enum ProposalStatus {
  Sent = 'sent',
  Accepted = 'accepted',
  Rejected = 'rejected',
  Withdrawn = 'withdrawn',
  Expired = 'expired'
}

export enum OrderStatus {
  Accepted = 'accepted',
  Scheduled = 'scheduled',
  InProgress = 'in_progress',
  Completed = 'completed',
  CancelledByClient = 'cancelled_by_client',
  CancelledByProfessional = 'cancelled_by_professional',
  Disputed = 'disputed'
}

export enum CancellationReason {
  ScheduleConflict = 'schedule_conflict',
  PriceDisagreement = 'price_disagreement',
  ProfessionalUnavailable = 'professional_unavailable',
  ClientUnavailable = 'client_unavailable',
  ServiceNoLongerNeeded = 'service_no_longer_needed',
  Other = 'other'
}

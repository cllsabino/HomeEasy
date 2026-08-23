export enum MessageType {
  Text = 'text',
  Image = 'image',
  Budget = 'budget',
  System = 'system'
}

export enum NotificationType {
  NewServiceRequest = 'new_service_request',
  NewProposal = 'new_proposal',
  ProposalAccepted = 'proposal_accepted',
  OrderUpdated = 'order_updated',
  NewMessage = 'new_message',
  ReviewReceived = 'review_received',
  DisputeUpdated = 'dispute_updated'
}

export enum ContactMessageStatus {
  Pending = 'pending',
  Answered = 'answered',
  Archived = 'archived'
}

export enum ServiceRequestFieldType {
  Text = 'text',
  Number = 'number',
  Select = 'select'
}

export interface ServiceRequestFieldOption {
  value: string;
  label: string;
}

export interface ServiceRequestFieldDefinition {
  key: string;
  label: string;
  type: ServiceRequestFieldType;
  required: boolean;
  minimum?: number;
  unit?: string;
  options?: ServiceRequestFieldOption[];
}

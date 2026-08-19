export enum ServiceRequestFieldType {
  Text = 'text',
  Number = 'number',
  Select = 'select'
}

export interface ServiceRequestFieldOption {
  value: string;
  label: string;
}

export interface ServiceRequestField {
  key: string;
  label: string;
  type: ServiceRequestFieldType;
  placeholder?: string;
  unit?: string;
  required?: boolean;
  minimum?: number;
  options?: ServiceRequestFieldOption[];
}

export interface ServiceRequestAnswer {
  key: string;
  label: string;
  value: string | number;
  unit?: string;
}

export interface RequestAttachment {
  name: string;
  mimeType: string;
  dataUrl: string;
}

import { ServiceRequestField, ServiceRequestFieldType } from '../models/service-request-field';

const roomOptions = [
  { value: '1', label: '1 cômodo' },
  { value: '2', label: '2 cômodos' },
  { value: '3', label: '3 cômodos' },
  { value: '4+', label: '4 ou mais cômodos' }
];

const fieldsByService: { [serviceName: string]: ServiceRequestField[] } = {
  encanador: [
    { key: 'issueType', label: 'Qual é o problema?', type: ServiceRequestFieldType.Select, required: true, options: [
      { value: 'leak', label: 'Vazamento' }, { value: 'clog', label: 'Entupimento' },
      { value: 'installation', label: 'Instalação' }, { value: 'other', label: 'Outro' }
    ] },
    { key: 'waterShutOff', label: 'É possível fechar o registro?', type: ServiceRequestFieldType.Select, required: true, options: [
      { value: 'yes', label: 'Sim' }, { value: 'no', label: 'Não' }, { value: 'unknown', label: 'Não sei' }
    ] }
  ],
  pintura: [
    { key: 'roomCount', label: 'Quantos cômodos?', type: ServiceRequestFieldType.Select, required: true, options: roomOptions },
    { key: 'paintArea', label: 'Área aproximada', type: ServiceRequestFieldType.Number, minimum: 1, unit: 'm²', placeholder: 'Ex.: 60' },
    { key: 'paintIncluded', label: 'A tinta já foi comprada?', type: ServiceRequestFieldType.Select, required: true, options: [
      { value: 'yes', label: 'Sim' }, { value: 'no', label: 'Não' }, { value: 'partial', label: 'Parcialmente' }
    ] }
  ],
  'limpeza residencial': [
    { key: 'propertySize', label: 'Metragem do imóvel', type: ServiceRequestFieldType.Number, required: true, minimum: 1, unit: 'm²', placeholder: 'Ex.: 80' },
    { key: 'bedroomCount', label: 'Quantidade de quartos', type: ServiceRequestFieldType.Number, required: true, minimum: 0 },
    { key: 'cleaningSupplies', label: 'Possui materiais de limpeza?', type: ServiceRequestFieldType.Select, required: true, options: [
      { value: 'yes', label: 'Sim' }, { value: 'no', label: 'Não' }, { value: 'partial', label: 'Alguns' }
    ] }
  ],
  'limpeza pós-obra': [
    { key: 'propertySize', label: 'Metragem do imóvel', type: ServiceRequestFieldType.Number, required: true, minimum: 1, unit: 'm²', placeholder: 'Ex.: 120' },
    { key: 'debrisRemoval', label: 'Precisa retirar entulho?', type: ServiceRequestFieldType.Select, required: true, options: [
      { value: 'yes', label: 'Sim' }, { value: 'no', label: 'Não' }
    ] }
  ],
  diarista: [
    { key: 'propertySize', label: 'Metragem do imóvel', type: ServiceRequestFieldType.Number, required: true, minimum: 1, unit: 'm²' },
    { key: 'frequency', label: 'Frequência desejada', type: ServiceRequestFieldType.Select, required: true, options: [
      { value: 'once', label: 'Uma vez' }, { value: 'weekly', label: 'Semanal' }, { value: 'biweekly', label: 'Quinzenal' }
    ] }
  ],
  'instalação de ar-condicionado': [
    { key: 'deviceCount', label: 'Quantidade de aparelhos', type: ServiceRequestFieldType.Number, required: true, minimum: 1 },
    { key: 'devicePower', label: 'Capacidade do aparelho', type: ServiceRequestFieldType.Text, placeholder: 'Ex.: 12.000 BTUs' }
  ],
  'montagem de móveis': [
    { key: 'furnitureCount', label: 'Quantidade de móveis', type: ServiceRequestFieldType.Number, required: true, minimum: 1 },
    { key: 'furnitureType', label: 'Quais móveis?', type: ServiceRequestFieldType.Text, required: true, placeholder: 'Ex.: guarda-roupa e mesa' }
  ],
  'mudança e frete': [
    { key: 'origin', label: 'Bairro ou cidade de origem', type: ServiceRequestFieldType.Text, required: true },
    { key: 'destination', label: 'Bairro ou cidade de destino', type: ServiceRequestFieldType.Text, required: true },
    { key: 'helpersNeeded', label: 'Precisa de ajudantes?', type: ServiceRequestFieldType.Select, required: true, options: [
      { value: 'yes', label: 'Sim' }, { value: 'no', label: 'Não' }
    ] }
  ]
};

export function getServiceRequestFields(serviceName: string) {
  const normalizedName = normalizeServiceName(serviceName);
  return fieldsByService[normalizedName] || [];
}

function normalizeServiceName(serviceName: string) {
  return (serviceName || '').trim().toLowerCase();
}

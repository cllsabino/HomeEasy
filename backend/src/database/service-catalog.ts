import {
  ServiceRequestFieldDefinition,
  ServiceRequestFieldType
} from '../services/service-request-field.types';

export interface ServiceCatalogEntry {
  id: string;
  name: string;
  category: string;
  requestForm?: ServiceRequestFieldDefinition[];
}

const yesNoOptions = [
  { value: 'yes', label: 'Sim' },
  { value: 'no', label: 'Não' }
];

const serviceForms: Record<string, ServiceRequestFieldDefinition[]> = {
  re02: [
    {
      key: 'issueType',
      label: 'Qual é o problema?',
      type: ServiceRequestFieldType.Select,
      required: true,
      options: [
        { value: 'leak', label: 'Vazamento' },
        { value: 'clog', label: 'Entupimento' },
        { value: 'installation', label: 'Instalação' },
        { value: 'other', label: 'Outro' }
      ]
    },
    {
      key: 'waterShutOff',
      label: 'É possível fechar o registro?',
      type: ServiceRequestFieldType.Select,
      required: true,
      options: yesNoOptions
    }
  ],
  ma01: [
    {
      key: 'propertySize',
      label: 'Metragem do imóvel',
      type: ServiceRequestFieldType.Number,
      required: true,
      minimum: 1,
      unit: 'm²'
    },
    {
      key: 'bedroomCount',
      label: 'Quantidade de quartos',
      type: ServiceRequestFieldType.Number,
      required: true,
      minimum: 0
    },
    {
      key: 'cleaningSupplies',
      label: 'Possui materiais de limpeza?',
      type: ServiceRequestFieldType.Select,
      required: true,
      options: yesNoOptions
    }
  ],
  ma02: [
    {
      key: 'propertySize',
      label: 'Metragem do imóvel',
      type: ServiceRequestFieldType.Number,
      required: true,
      minimum: 1,
      unit: 'm²'
    },
    {
      key: 'debrisRemoval',
      label: 'Precisa retirar entulho?',
      type: ServiceRequestFieldType.Select,
      required: true,
      options: yesNoOptions
    }
  ],
  ma03: [
    {
      key: 'propertySize',
      label: 'Metragem do imóvel',
      type: ServiceRequestFieldType.Number,
      required: true,
      minimum: 1,
      unit: 'm²'
    },
    { key: 'frequency', label: 'Frequência desejada', type: ServiceRequestFieldType.Text, required: true }
  ],
  ma04: [
    {
      key: 'roomCount',
      label: 'Quantidade de cômodos',
      type: ServiceRequestFieldType.Number,
      required: true,
      minimum: 1
    },
    {
      key: 'paintArea',
      label: 'Área aproximada',
      type: ServiceRequestFieldType.Number,
      required: false,
      minimum: 1,
      unit: 'm²'
    },
    {
      key: 'paintIncluded',
      label: 'A tinta já foi comprada?',
      type: ServiceRequestFieldType.Select,
      required: true,
      options: yesNoOptions
    }
  ],
  ma06: [
    {
      key: 'furnitureCount',
      label: 'Quantidade de móveis',
      type: ServiceRequestFieldType.Number,
      required: true,
      minimum: 1
    },
    { key: 'furnitureType', label: 'Quais móveis?', type: ServiceRequestFieldType.Text, required: true }
  ],
  ma07: [
    {
      key: 'deviceCount',
      label: 'Quantidade de aparelhos',
      type: ServiceRequestFieldType.Number,
      required: true,
      minimum: 1
    },
    {
      key: 'devicePower',
      label: 'Capacidade do aparelho',
      type: ServiceRequestFieldType.Text,
      required: false
    }
  ],
  ma11: [
    {
      key: 'origin',
      label: 'Bairro ou cidade de origem',
      type: ServiceRequestFieldType.Text,
      required: true
    },
    {
      key: 'destination',
      label: 'Bairro ou cidade de destino',
      type: ServiceRequestFieldType.Text,
      required: true
    },
    {
      key: 'helpersNeeded',
      label: 'Precisa de ajudantes?',
      type: ServiceRequestFieldType.Select,
      required: true,
      options: yesNoOptions
    }
  ]
};

export const serviceCatalog: ServiceCatalogEntry[] = [
  { id: 'do01', name: 'Babá', category: 'Cuidados' },
  { id: 'do02', name: 'Cozinheiro', category: 'Serviços domésticos' },
  { id: 'do03', name: 'Lavadeira', category: 'Serviços domésticos' },
  { id: 'do04', name: 'Motorista', category: 'Transporte' },
  { id: 'do05', name: 'Segurança', category: 'Segurança residencial' },
  { id: 're01', name: 'Eletricista', category: 'Manutenção residencial' },
  { id: 're02', name: 'Encanador', category: 'Manutenção residencial' },
  { id: 're03', name: 'Marceneiro', category: 'Reforma' },
  { id: 're04', name: 'Pedreiro', category: 'Reforma' },
  { id: 're05', name: 'Arquiteto', category: 'Reforma' },
  { id: 're06', name: 'Decorador', category: 'Reforma' },
  { id: 'ma01', name: 'Limpeza residencial', category: 'Limpeza' },
  { id: 'ma02', name: 'Limpeza pós-obra', category: 'Limpeza' },
  { id: 'ma03', name: 'Diarista', category: 'Limpeza' },
  { id: 'ma04', name: 'Pintura', category: 'Reforma' },
  { id: 'ma05', name: 'Jardinagem', category: 'Área externa' },
  { id: 'ma06', name: 'Montagem de móveis', category: 'Manutenção residencial' },
  { id: 'ma07', name: 'Instalação de ar-condicionado', category: 'Climatização' },
  { id: 'ma08', name: 'Manutenção de eletrodomésticos', category: 'Manutenção residencial' },
  { id: 'ma09', name: 'Chaveiro', category: 'Segurança residencial' },
  { id: 'ma10', name: 'Dedetização', category: 'Controle de pragas' },
  { id: 'ma11', name: 'Mudança e frete', category: 'Transporte' },
  { id: 'ma12', name: 'Instalação de câmeras', category: 'Segurança residencial' },
  { id: 'ma13', name: 'Gesso e drywall', category: 'Reforma' },
  { id: 'ma14', name: 'Vidraceiro', category: 'Reforma' },
  { id: 'ma15', name: 'Telhadista', category: 'Reforma' },
  { id: 'ma16', name: 'Energia solar', category: 'Energia' },
  { id: 'ca01', name: 'Cuidador de idosos', category: 'Cuidados' },
  { id: 'ca02', name: 'Cuidador de animais', category: 'Cuidados' }
];

for (const service of serviceCatalog) {
  service.requestForm = serviceForms[service.id] || [];
}

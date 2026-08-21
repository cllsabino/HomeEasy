export interface ServiceCatalogEntry {
  id: string;
  name: string;
  category: string;
}

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

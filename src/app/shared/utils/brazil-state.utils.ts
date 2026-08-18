const brazilStateCodes: { [normalizedStateName: string]: string } = {
  acre: 'AC', alagoas: 'AL', amapa: 'AP', amazonas: 'AM', bahia: 'BA', ceara: 'CE',
  distritoFederal: 'DF', espiritoSanto: 'ES', goias: 'GO', maranhao: 'MA', matoGrosso: 'MT',
  matoGrossoDoSul: 'MS', minasGerais: 'MG', para: 'PA', paraiba: 'PB', parana: 'PR',
  pernambuco: 'PE', piaui: 'PI', rioDeJaneiro: 'RJ', rioGrandeDoNorte: 'RN',
  rioGrandeDoSul: 'RS', rondonia: 'RO', roraima: 'RR', santaCatarina: 'SC',
  saoPaulo: 'SP', sergipe: 'SE', tocantins: 'TO'
};

export function normalizeBrazilStateCode(state: string): string {
  if (!state) {
    return '';
  }

  const trimmedState = state.trim();
  if (trimmedState.length === 2) {
    return trimmedState.toUpperCase();
  }

  const normalizedStateName = trimmedState
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+(.)/g, (_, letter: string) => letter.toUpperCase())
    .replace(/^(.)/, (_, letter: string) => letter.toLowerCase());

  return brazilStateCodes[normalizedStateName] || trimmedState;
}

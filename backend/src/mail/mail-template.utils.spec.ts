import { buildBrandedMailHtml, buildBrandedMailText, BrandedMailTemplate } from './mail-template.utils';

describe('mail template utilities', () => {
  const template: BrandedMailTemplate = {
    eyebrow: 'Serviço contratado',
    title: 'Proposta aceita',
    greeting: 'Olá, Cliente!',
    message: 'O profissional confirmou o atendimento.',
    details: [{ label: 'Serviço', value: '<Limpeza & organização>' }],
    actionLabel: 'Ver pedido',
    actionUrl: 'https://homeeasy.example/pedido?id=1&origin=email',
    footer: 'Mensagem automática da Home Easy.'
  };

  it('escapes dynamic values in the HTML version', () => {
    const html = buildBrandedMailHtml(template);

    expect(html).toContain('&lt;Limpeza &amp; organização&gt;');
    expect(html).toContain('id=1&amp;origin=email');
    expect(html).toContain('src="cid:homeeasy-logo"');
    expect(html).not.toContain('<Limpeza & organização>');
  });

  it('keeps a readable plain text fallback', () => {
    const text = buildBrandedMailText(template);

    expect(text).toContain('Serviço: <Limpeza & organização>');
    expect(text).toContain('Ver pedido: https://homeeasy.example/pedido?id=1&origin=email');
  });
});

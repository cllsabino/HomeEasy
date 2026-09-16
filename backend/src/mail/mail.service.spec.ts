import { ConfigService } from '@nestjs/config';

import { MailService, MarketplaceMailDetails } from './mail.service';

describe('MailService transactional events', () => {
  const fetchMock = jest.fn();
  const orderDetails: MarketplaceMailDetails = {
    orderId: 'order-1',
    serviceName: 'Limpeza residencial',
    client: { id: 'client-1', name: 'Álvaro', email: 'alvaro@example.com' },
    professional: { id: 'professional-1', name: 'Marina', email: 'marina@example.com' },
    agreedPrice: 180,
    scheduledAt: new Date('2026-09-18T15:00:00.000Z'),
    address: 'Rua de teste, 10',
    city: 'Recife',
    state: 'PE'
  };
  let mailService: MailService;

  beforeEach(() => {
    fetchMock.mockReset().mockResolvedValue({ ok: true });
    global.fetch = fetchMock;
    const settings: Record<string, string | number | boolean> = {
      FRONTEND_BASE_URL: 'https://homeeasy-bd496.web.app',
      SMTP_FROM: 'Home Easy <onboarding@resend.dev>',
      RESEND_API_KEY: 'test-key'
    };
    const configService = {
      get: (key: string) => settings[key],
      getOrThrow: (key: string) => settings[key]
    } as ConfigService;
    mailService = new MailService(configService);
  });

  it('sends proposal acceptance to both participants', async () => {
    await mailService.sendProposalAccepted(orderDetails);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expectSentMessages([
      { to: 'alvaro@example.com', subject: 'Contratação confirmada: Limpeza residencial' },
      { to: 'marina@example.com', subject: 'Sua proposta foi aceita: Limpeza residencial' }
    ]);
  });

  it('sends service completion to both participants', async () => {
    await mailService.sendServiceCompleted(orderDetails);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expectSentMessages([
      { to: 'alvaro@example.com', subject: 'Serviço concluído: Limpeza residencial' },
      { to: 'marina@example.com', subject: 'Atendimento concluído: Limpeza residencial' }
    ]);
  });

  it('sends cancellation details to both participants', async () => {
    await mailService.sendOrderCancelled({
      ...orderDetails,
      cancelledByName: 'Álvaro',
      cancellationReason: 'Conflito de agenda',
      cancellationDetails: 'Não estarei disponível no horário.'
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expectSentMessages([
      { to: 'alvaro@example.com', subject: 'Pedido cancelado: Limpeza residencial' },
      { to: 'marina@example.com', subject: 'Pedido cancelado: Limpeza residencial' }
    ]);
    expect(readSentMessages()[0].html).toContain('Não estarei disponível no horário.');
  });

  it('sends dispute details to both participants', async () => {
    await mailService.sendDisputeOpened({
      ...orderDetails,
      openedByName: 'Álvaro',
      disputeReason: 'Qualidade do serviço',
      disputeDescription: 'O atendimento não correspondeu ao que foi combinado.'
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expectSentMessages([
      { to: 'alvaro@example.com', subject: 'Disputa aberta: Limpeza residencial' },
      { to: 'marina@example.com', subject: 'Disputa aberta: Limpeza residencial' }
    ]);
    expect(readSentMessages()[0].html).toContain('O atendimento não correspondeu ao que foi combinado.');
  });

  function readSentMessages() {
    return fetchMock.mock.calls.map(([, request]) => JSON.parse(String(request.body)) as Record<string, string>);
  }

  function expectSentMessages(expectedMessages: Array<{ to: string; subject: string }>) {
    const sentMessages = readSentMessages();
    expectedMessages.forEach((expectedMessage) => {
      expect(sentMessages).toContainEqual(expect.objectContaining(expectedMessage));
    });
  }
});

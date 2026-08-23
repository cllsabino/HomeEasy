import { ContactMessageStatus } from './communication.enums';
import { ContactMessage } from './contact-message.entity';

describe('ContactMessage', () => {
  it('instantiates with pending status by default', () => {
    const message = new ContactMessage();
    message.name = 'Alvaro';
    message.email = 'alvaro@example.com';
    message.phone = '87999999999';
    message.subject = 'Dúvida';
    message.message = 'Gostaria de saber mais sobre a plataforma.';
    message.status = ContactMessageStatus.Pending;

    expect(message.status).toBe(ContactMessageStatus.Pending);
    expect(message.name).toBe('Alvaro');
    expect(message.email).toBe('alvaro@example.com');
  });
});

import 'dotenv/config';

import { normalizeEmail } from '../../shared/utils/email.utils';
import { User } from '../../users/user.entity';
import { UserRole } from '../../users/user-role.enum';
import dataSource from '../data-source';

async function assignAdminRole() {
  const adminEmail = normalizeEmail(process.env.ADMIN_EMAIL || '');
  if (!adminEmail) {
    throw new Error(
      'Defina ADMIN_EMAIL com o e-mail da conta existente que receberá o papel administrativo.'
    );
  }

  await dataSource.initialize();
  try {
    const usersRepository = dataSource.getRepository(User);
    const user = await usersRepository.findOne({ where: { email: adminEmail, isActive: true } });
    if (!user) {
      throw new Error(`Nenhuma conta ativa foi encontrada para ${adminEmail}.`);
    }
    user.role = UserRole.Admin;
    await usersRepository.save(user);
    process.stdout.write(`Papel administrativo atribuído à conta ${adminEmail}.\n`);
  } finally {
    await dataSource.destroy();
  }
}

assignAdminRole().catch((error) => {
  process.stderr.write(
    `Falha ao atribuir papel administrativo: ${error instanceof Error ? error.message : String(error)}\n`
  );
  process.exitCode = 1;
});

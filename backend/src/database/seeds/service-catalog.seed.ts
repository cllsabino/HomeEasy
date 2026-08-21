import dataSource from '../data-source';
import { serviceCatalog } from '../service-catalog';
import { Service } from '../../services/service.entity';

async function seedServiceCatalog() {
  await dataSource.initialize();
  const servicesRepository = dataSource.getRepository(Service);
  await servicesRepository.upsert(
    serviceCatalog.map((service) => ({ ...service, isActive: true })),
    ['id']
  );
  await dataSource.destroy();
  process.stdout.write(`Catálogo criado com ${serviceCatalog.length} serviços.\n`);
}

seedServiceCatalog().catch((error) => {
  process.stderr.write(
    `Falha ao criar catálogo: ${error instanceof Error ? error.message : String(error)}\n`
  );
  process.exitCode = 1;
});

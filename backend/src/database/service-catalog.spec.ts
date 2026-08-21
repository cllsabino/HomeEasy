import { serviceCatalog } from './service-catalog';

describe('serviceCatalog', () => {
  it('keeps identifiers and names unique', () => {
    expect(new Set(serviceCatalog.map((service) => service.id)).size).toBe(serviceCatalog.length);
    expect(new Set(serviceCatalog.map((service) => service.name)).size).toBe(serviceCatalog.length);
  });
});

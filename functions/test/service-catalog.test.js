const assert = require("node:assert/strict");
const test = require("node:test");

const { serviceCatalog } = require("../src/service-catalog");

test("keeps service identifiers unique and required fields complete", () => {
  const serviceIds = new Set(serviceCatalog.map(service => service.id));

  assert.equal(serviceIds.size, serviceCatalog.length);
  serviceCatalog.forEach(service => {
    assert.ok(service.id);
    assert.ok(service.nome);
    assert.ok(service.tipo);
  });
});

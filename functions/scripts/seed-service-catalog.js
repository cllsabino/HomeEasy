const { applicationDefault, initializeApp } = require("firebase-admin/app");
const { FieldValue, getFirestore } = require("firebase-admin/firestore");

const { serviceCatalog } = require("../src/service-catalog");
const { readArgument } = require("./script-arguments");

async function seedServiceCatalog() {
  const projectId = readArgument("project");
  if (!projectId) {
    throw new Error("Use: npm run seed:services -- --project <project-id>");
  }

  initializeApp({ credential: applicationDefault(), projectId });
  const database = getFirestore();
  const batch = database.batch();
  serviceCatalog.forEach(service => {
    batch.set(database.collection("Serviços").doc(service.id), service, { merge: true });
  });
  batch.set(database.collection("SystemMigrations").doc("serviceCatalogV1"), {
    serviceCount: serviceCatalog.length,
    completedAt: FieldValue.serverTimestamp()
  });
  await batch.commit();

  process.stdout.write(`Catálogo criado com ${serviceCatalog.length} serviços no projeto ${projectId}.\n`);
}

seedServiceCatalog().catch(error => {
  process.stderr.write(`Falha ao criar catálogo: ${error.message}\n`);
  process.exitCode = 1;
});

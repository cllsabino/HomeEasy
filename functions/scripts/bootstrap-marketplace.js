const { applicationDefault, initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { FieldPath, FieldValue, getFirestore } = require("firebase-admin/firestore");

const { createPublicProfile } = require("../src/public-profile");
const { readArgument } = require("./script-arguments");

const migrationId = "publicProfilesV1";
const writeBatchSize = 400;

async function migratePublicProfiles(database) {
  let migratedProfiles = 0;
  let lastUserDocument = null;

  do {
    let usersQuery = database.collection("Usuarios")
      .orderBy(FieldPath.documentId())
      .limit(writeBatchSize);
    if (lastUserDocument) {
      usersQuery = usersQuery.startAfter(lastUserDocument);
    }

    const usersSnapshot = await usersQuery.get();
    if (usersSnapshot.empty) {
      break;
    }

    const batch = database.batch();
    usersSnapshot.docs.forEach(userDocument => {
      batch.set(
        database.collection("PublicProfiles").doc(userDocument.id),
        createPublicProfile(userDocument.id, userDocument.data())
      );
    });
    await batch.commit();
    migratedProfiles += usersSnapshot.size;
    lastUserDocument = usersSnapshot.docs[usersSnapshot.docs.length - 1];
  } while (lastUserDocument);

  return migratedProfiles;
}

async function assignAdministrator(database, adminEmail) {
  const authentication = getAuth();
  const administrator = await authentication.getUserByEmail(adminEmail);
  const currentClaims = administrator.customClaims || {};

  await authentication.setCustomUserClaims(administrator.uid, Object.assign({}, currentClaims, { admin: true }));
  await database.collection("Usuarios").doc(administrator.uid).set({ role: "admin" }, { merge: true });

  return administrator.uid;
}

async function runBootstrap() {
  const projectId = readArgument("project");
  const adminEmail = readArgument("admin-email");
  if (!projectId || !adminEmail) {
    throw new Error("Use: npm run bootstrap -- --project <project-id> --admin-email <email>");
  }

  initializeApp({ credential: applicationDefault(), projectId });
  const database = getFirestore();
  const administratorId = await assignAdministrator(database, adminEmail);
  const migratedProfiles = await migratePublicProfiles(database);

  await database.collection("SystemMigrations").doc(migrationId).set({
    administratorId,
    migratedProfiles,
    completedAt: FieldValue.serverTimestamp()
  });

  process.stdout.write(`Migração concluída: ${migratedProfiles} perfis públicos; administrador ${administratorId}.\n`);
}

runBootstrap().catch(error => {
  process.stderr.write(`Falha no bootstrap: ${error.message}\n`);
  process.exitCode = 1;
});

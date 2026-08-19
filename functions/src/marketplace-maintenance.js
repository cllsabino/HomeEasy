const { FieldValue, Timestamp } = require("firebase-admin/firestore");
const { logger } = require("firebase-functions");

const expirationBatchSize = 400;
const openOrderStatuses = ["requested", "proposalReceived"];

async function expireMarketplaceRecords(database) {
  const expirationTimestamp = Timestamp.now();
  const expiredOrders = await database.collection("Orders")
    .where("status", "in", openOrderStatuses)
    .where("expiresAt", "<=", expirationTimestamp)
    .limit(expirationBatchSize)
    .get();
  const expiredProposals = await database.collectionGroup("Proposals")
    .where("status", "==", "sent")
    .where("validUntil", "<=", expirationTimestamp)
    .limit(expirationBatchSize)
    .get();

  const batch = database.batch();
  expiredOrders.docs.forEach(document => batch.update(document.ref, {
    status: "expired",
    updatedAt: FieldValue.serverTimestamp()
  }));
  expiredProposals.docs.forEach(document => batch.update(document.ref, {
    status: "expired",
    updatedAt: FieldValue.serverTimestamp()
  }));

  const updateCount = expiredOrders.size + expiredProposals.size;
  if (updateCount > 0) {
    await batch.commit();
  }

  const result = {
    expiredOrders: expiredOrders.size,
    expiredProposals: expiredProposals.size
  };
  logger.info("Marketplace expiration completed", result);

  return result;
}

module.exports = { expireMarketplaceRecords };

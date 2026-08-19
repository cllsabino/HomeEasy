const { setGlobalOptions } = require("firebase-functions/v2");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const { expireMarketplaceRecords } = require("./src/marketplace-maintenance");

initializeApp();
setGlobalOptions({ region: "southamerica-east1", maxInstances: 1 });

exports.expireMarketplaceRecords = onSchedule({
  schedule: "every 15 minutes",
  timeZone: "America/Fortaleza",
  retryCount: 3
}, async () => expireMarketplaceRecords(getFirestore()));

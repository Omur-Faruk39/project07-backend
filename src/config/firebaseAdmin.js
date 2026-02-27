// firebaseAdmin.js
const admin = require("firebase-admin");

let serviceAccount;

try {
  serviceAccount = require("./firebase-service-account.json"); // download from Firebase → Project Settings → Service accounts
} catch (e) {
  console.error("Missing firebase-service-account.json");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;

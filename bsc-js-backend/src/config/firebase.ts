import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Determine the correct path for the service account key
const serviceAccountPath = process.env.SERVICE_ACCOUNT_KEY_PATH || path.resolve(__dirname, 'serviceAccountKey.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: '<your-firebase-storage-bucket>',
});

// Connect Firestore to emulator
const firestore = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage().bucket();

firestore.settings({
  host: 'localhost:8081', // Default emulator port
  ssl: false,
});

export { firestore };
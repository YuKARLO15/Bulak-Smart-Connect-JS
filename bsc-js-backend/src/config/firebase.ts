import * as admin from 'firebase-admin';
import * as fs from 'fs';

// Load the service account key
const serviceAccount = JSON.parse(
  fs.readFileSync('serviceAccountKey.json', 'utf-8')
);

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

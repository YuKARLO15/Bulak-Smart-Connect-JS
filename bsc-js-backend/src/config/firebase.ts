import * as admin from 'firebase-admin';
import * as serviceAccount from './serviceAccountKey.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: '<your-firebase-storage-bucket>',
});

// Connect Firestore to emulator
const firestore = admin.firestore();
firestore.settings({
  host: "localhost:8080", // Default emulator port
  ssl: false,
});

export { firestore };


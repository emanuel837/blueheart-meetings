import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './config';

const setupDocRef = doc(db, 'system', 'config');

export async function isAdminSetupComplete() {
  const snapshot = await getDoc(setupDocRef);
  return snapshot.exists() && snapshot.data().adminCreated === true;
}

export async function markAdminSetupComplete(uid) {
  await setDoc(setupDocRef, {
    adminCreated: true,
    adminUid: uid,
    createdAt: serverTimestamp(),
  });
}

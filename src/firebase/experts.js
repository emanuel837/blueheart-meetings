import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from './config';

export function subscribeToExperts(callback) {
  return onSnapshot(collection(db, 'experts'), (snapshot) => {
    const experts = snapshot.docs
      .map((item) => ({ id: item.id, ...item.data() }))
      .sort((a, b) => a.fullName.localeCompare(b.fullName, 'he'));
    callback(experts);
  });
}

export async function createExpert(expert) {
  const docRef = await addDoc(collection(db, 'experts'), {
    ...expert,
    isActive: expert.isActive ?? true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateExpert(expertId, expert) {
  await updateDoc(doc(db, 'experts', expertId), {
    ...expert,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteExpert(expertId) {
  await deleteDoc(doc(db, 'experts', expertId));
}

export async function toggleExpertActive(expertId, isActive) {
  await updateDoc(doc(db, 'experts', expertId), {
    isActive,
    updatedAt: serverTimestamp(),
  });
}

import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from './config';

export function subscribeToMeetings(callback) {
  return onSnapshot(collection(db, 'meetings'), (snapshot) => {
    const meetings = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));
    callback(meetings);
  });
}

export async function getBookedSlots(branchId, date) {
  const q = query(
    collection(db, 'meetings'),
    where('branchId', '==', branchId),
    where('date', '==', date),
    where('status', '==', 'confirmed')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data().time);
}

export async function createMeeting(meeting) {
  const docRef = await addDoc(collection(db, 'meetings'), {
    ...meeting,
    status: 'confirmed',
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateMeetingStatus(meetingId, status) {
  await updateDoc(doc(db, 'meetings', meetingId), { status });
}

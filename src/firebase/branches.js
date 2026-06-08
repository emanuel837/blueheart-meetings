import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from './config';

function sortBranches(branches) {
  return [...branches].sort((a, b) => a.name.localeCompare(b.name, 'he'));
}

export async function getActiveBranches() {
  const q = query(collection(db, 'branches'), where('isActive', '==', true));
  const snapshot = await getDocs(q);
  return sortBranches(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
}

export function subscribeToBranches(callback) {
  return onSnapshot(collection(db, 'branches'), (snapshot) => {
    const branches = sortBranches(
      snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
    );
    callback(branches);
  });
}

export async function toggleBranchActive(branchId, isActive) {
  await updateDoc(doc(db, 'branches', branchId), { isActive });
}

export async function updateBranchSchedule(branchId, schedule) {
  await updateDoc(doc(db, 'branches', branchId), {
    workingHours: schedule.workingHours,
    workingDays: schedule.workingDays,
  });
}

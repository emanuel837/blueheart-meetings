import { collection, doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

export function subscribeToClients(callback) {
  return onSnapshot(collection(db, 'clients'), (snapshot) => {
    const clients = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));
    callback(clients);
  });
}

export async function updateClientMeta(clientId, data) {
  await setDoc(
    doc(db, 'clients', clientId),
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function updateClientColor(clientId, color, baseData = {}) {
  await updateClientMeta(clientId, { ...baseData, color });
}

export async function addClientTag(clientId, tag, baseData = {}) {
  const normalizedTag = tag.trim();
  if (!normalizedTag) return;

  const existingTags = baseData.tags || [];
  if (existingTags.includes(normalizedTag)) return;

  await updateClientMeta(clientId, {
    ...baseData,
    tags: [...existingTags, normalizedTag],
  });
}

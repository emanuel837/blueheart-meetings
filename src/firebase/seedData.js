import { doc, setDoc } from 'firebase/firestore';
import { db } from './config';

const branches = [
  { id: '06', name: 'קניון הזהב', address: 'דוד סחרוב 21, ראשון לציון', phone: '03-9413437' },
  { id: '07', name: 'כפר סבא', address: 'רוטשילד 61, כפ״ס', phone: '09-7657635' },
  { id: '10', name: 'ירושלים', address: 'קניון ת.מרכזית, י-ם', phone: '02-5370040' },
  { id: '15', name: 'קניון הקריון', address: 'דרך עכו 192, קריית ביאליק', phone: '04-8744020' },
  { id: '16', name: 'אסף סנטר', address: 'קניון אסף הרופא, באר יעקב', phone: '08-9201565' },
  { id: '21', name: 'קניון אורות', address: 'הנשיא 1, אור עקיבא', phone: '04-8322523' },
  { id: '25', name: 'קניון מרום', address: 'חיים לנדאו 7, רמת גן', phone: '03-5477991' },
  { id: '26', name: 'נוף הגליל', address: 'דרך העמק 41, נצרת', phone: '04-6568166' },
  { id: '27', name: 'חוצות המפרץ', address: 'חוצות המפרץ, חיפה', phone: '04-8403441' },
  { id: '38', name: 'קניותר', address: 'האירוסים 53, נס ציונה', phone: '08-9229810' },
  { id: '39', name: 'קניון עופר השרון', address: 'הרצל 60, נתניה', phone: '072-2044901' },
  { id: '02', name: 'טיב טוב', address: 'ביאליק 4, רמת גן', phone: '03-6728725' },
];

export async function seedBranches() {
  await Promise.all(
    branches.map((branch) =>
      setDoc(doc(db, 'branches', branch.id), {
        ...branch,
        isActive: true,
        workingHours: { start: '09:00', end: '17:00' },
        workingDays: [0, 1, 2, 3, 4],
        slotDuration: 30,
      })
    )
  );

  return branches.length;
}

export { branches };

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { getBookedSlots } from '../../firebase/meetings';
import { generateTimeSlots } from '../../utils/timeSlots';
import { formatDateKey } from '../../utils/dates';

function TimeSelect({ branch, selectedDate, selectedTime, onSelect }) {
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const workingHours = branch?.workingHours ?? { start: '09:00', end: '17:00' };
  const slotDuration = branch?.slotDuration ?? 30;

  const slots = generateTimeSlots(
    workingHours.start,
    workingHours.end,
    slotDuration
  );

  useEffect(() => {
    if (!branch || !selectedDate) return;

    setLoading(true);
    setError(null);

    getBookedSlots(branch.id, formatDateKey(selectedDate))
      .then(setBookedSlots)
      .catch(() => setError('שגיאה בטעינת שעות תפוסות'))
      .finally(() => setLoading(false));
  }, [branch, selectedDate]);

  if (loading) {
    return <p className="text-center text-gray-500 py-12">טוען שעות פנויות...</p>;
  }

  if (error) {
    return <p className="text-center text-[var(--danger)] py-12">{error}</p>;
  }

  const availableCount = slots.filter((slot) => !bookedSlots.includes(slot)).length;

  if (availableCount === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="h-10 w-10 mx-auto text-gray-400 mb-3" />
        <p className="text-gray-600">אין שעות פנויות בתאריך זה</p>
        <p className="text-sm text-gray-500 mt-1">אנא בחרו תאריך אחר</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
      {slots.map((slot) => {
        const isBooked = bookedSlots.includes(slot);
        const isSelected = selectedTime === slot;

        return (
          <button
            key={slot}
            type="button"
            disabled={isBooked}
            onClick={() => onSelect(slot)}
            className={`rounded-lg border-2 py-3 text-sm font-medium transition-all ${
              isBooked
                ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through'
                : isSelected
                  ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                  : 'border-gray-200 bg-white text-[var(--primary)] hover:border-[var(--primary-light)]'
            }`}
          >
            <span dir="ltr">{slot}</span>
          </button>
        );
      })}
    </div>
  );
}

export default TimeSelect;

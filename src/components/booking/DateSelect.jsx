import { useMemo } from 'react';
import { DayPicker } from 'react-day-picker';
import { he } from 'date-fns/locale';
import { startOfDay } from 'date-fns';
import 'react-day-picker/style.css';

function DateSelect({ branch, selectedDate, onSelect }) {
  const workingDays = branch?.workingDays ?? [0, 1, 2, 3, 4];

  const disabledMatchers = useMemo(
    () => [
      { before: startOfDay(new Date()) },
      (date) => !workingDays.includes(date.getDay()),
    ],
    [workingDays]
  );

  return (
    <div className="flex justify-center">
      <DayPicker
        mode="single"
        locale={he}
        dir="rtl"
        selected={selectedDate}
        onSelect={onSelect}
        disabled={disabledMatchers}
        className="booking-calendar"
      />
    </div>
  );
}

export default DateSelect;

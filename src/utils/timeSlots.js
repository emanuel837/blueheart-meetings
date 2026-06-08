import { getIsraelMinutesFromMidnight, isTodayInIsrael } from './dates';

export function generateTimeSlots(start, end, durationMinutes) {
  const slots = [];
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);

  let totalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;

  while (totalMinutes + durationMinutes <= endTotalMinutes) {
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    slots.push(
      `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    );
    totalMinutes += durationMinutes;
  }

  return slots;
}

export function filterPastSlotsForToday(slots, selectedDate, minLeadMinutes = 30) {
  if (!selectedDate || !isTodayInIsrael(selectedDate)) {
    return slots;
  }

  const minSlotMinutes = getIsraelMinutesFromMidnight() + minLeadMinutes;

  return slots.filter((slot) => {
    const [hours, minutes] = slot.split(':').map(Number);
    return hours * 60 + minutes >= minSlotMinutes;
  });
}

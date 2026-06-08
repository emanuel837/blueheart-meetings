import { format } from 'date-fns';

const ISRAEL_TZ = 'Asia/Jerusalem';

export function formatDateKey(date) {
  return format(date, 'yyyy-MM-dd');
}

export function formatIsraelDateKey(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: ISRAEL_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function getIsraelMinutesFromMidnight(date = new Date()) {
  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: ISRAEL_TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);

  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function isTodayInIsrael(date) {
  return formatDateKey(date) === formatIsraelDateKey(new Date());
}

import { addMinutes, format, parse } from 'date-fns';

function toGoogleDateTime(dateStr, timeStr) {
  const date = parse(`${dateStr} ${timeStr}`, 'yyyy-MM-dd HH:mm', new Date());
  return format(date, "yyyyMMdd'T'HHmmss");
}

export function buildGoogleCalendarUrl({ title, date, time, durationMinutes, location, details }) {
  const start = toGoogleDateTime(date, time);
  const endDate = addMinutes(parse(`${date} ${time}`, 'yyyy-MM-dd HH:mm', new Date()), durationMinutes);
  const end = format(endDate, "yyyyMMdd'T'HHmmss");

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${start}/${end}`,
    details,
    location,
    ctz: 'Asia/Jerusalem',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

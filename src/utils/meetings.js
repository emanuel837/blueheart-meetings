import {
  endOfWeek,
  format,
  isAfter,
  isWithinInterval,
  parse,
  startOfDay,
  startOfWeek,
} from 'date-fns';

export function getMeetingDateTime(meeting) {
  return parse(`${meeting.date} ${meeting.time}`, 'yyyy-MM-dd HH:mm', new Date());
}

export function getMeetingsToday(meetings) {
  const today = format(new Date(), 'yyyy-MM-dd');
  return meetings.filter((meeting) => meeting.date === today);
}

export function getMeetingsThisWeek(meetings) {
  const now = new Date();
  const interval = {
    start: startOfWeek(now, { weekStartsOn: 0 }),
    end: endOfWeek(now, { weekStartsOn: 0 }),
  };

  return meetings.filter((meeting) =>
    isWithinInterval(getMeetingDateTime(meeting), interval)
  );
}

export function getUniqueClientsCount(meetings) {
  const clients = new Set(
    meetings.map((meeting) => meeting.phone || meeting.email).filter(Boolean)
  );
  return clients.size;
}

export function getUpcomingMeetings(meetings, limit = 5) {
  const now = new Date();

  return meetings
    .filter(
      (meeting) =>
        meeting.status !== 'cancelled' && isAfter(getMeetingDateTime(meeting), now)
    )
    .sort((a, b) => getMeetingDateTime(a) - getMeetingDateTime(b))
    .slice(0, limit);
}

export function filterMeetings(meetings, { branchId, status, dateFrom, dateTo }) {
  return meetings
    .filter((meeting) => {
      if (branchId && meeting.branchId !== branchId) return false;
      if (status && meeting.status !== status) return false;

      const meetingDate = startOfDay(parse(meeting.date, 'yyyy-MM-dd', new Date()));

      if (dateFrom) {
        const from = startOfDay(parse(dateFrom, 'yyyy-MM-dd', new Date()));
        if (meetingDate < from) return false;
      }

      if (dateTo) {
        const to = startOfDay(parse(dateTo, 'yyyy-MM-dd', new Date()));
        if (meetingDate > to) return false;
      }

      return true;
    })
    .sort((a, b) => getMeetingDateTime(b) - getMeetingDateTime(a));
}

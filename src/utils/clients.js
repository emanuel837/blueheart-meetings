import { format, parse } from 'date-fns';
import { he } from 'date-fns/locale';
import { getMeetingDateTime } from './meetings';
import { normalizePhone } from './validation';

export function getClientKey(meeting) {
  if (meeting.phone) return normalizePhone(meeting.phone);
  if (meeting.email) return meeting.email.trim().toLowerCase();
  return null;
}

export function aggregateClients(meetings, clientsMeta = []) {
  const metaById = Object.fromEntries(clientsMeta.map((client) => [client.id, client]));
  const map = new Map();

  meetings.forEach((meeting) => {
    const key = getClientKey(meeting);
    if (!key) return;

    if (!map.has(key)) {
      const meta = metaById[key] || {};
      map.set(key, {
        id: key,
        phone: meeting.phone || meta.phone || '',
        fullName: meeting.fullName || meta.fullName || '',
        email: meeting.email || meta.email || '',
        meetingCount: 0,
        lastMeeting: null,
        color: meta.color || '#233667',
        tags: meta.tags || [],
      });
    }

    const client = map.get(key);
    client.meetingCount += 1;
    client.fullName = meeting.fullName || client.fullName;
    client.email = meeting.email || client.email;
    client.phone = meeting.phone || client.phone;

    const meetingDate = getMeetingDateTime(meeting);
    if (!client.lastMeeting || meetingDate > getMeetingDateTime(client.lastMeeting)) {
      client.lastMeeting = meeting;
    }
  });

  clientsMeta.forEach((meta) => {
    if (!map.has(meta.id)) {
      map.set(meta.id, {
        id: meta.id,
        phone: meta.phone || '',
        fullName: meta.fullName || '',
        email: meta.email || '',
        meetingCount: 0,
        lastMeeting: null,
        color: meta.color || '#233667',
        tags: meta.tags || [],
      });
    } else {
      const client = map.get(meta.id);
      client.color = meta.color || client.color;
      client.tags = meta.tags || client.tags;
    }
  });

  return Array.from(map.values()).sort((a, b) =>
    a.fullName.localeCompare(b.fullName, 'he')
  );
}

export function filterClients(clients, search) {
  const term = search.trim().toLowerCase();
  if (!term) return clients;

  return clients.filter(
    (client) =>
      client.fullName.toLowerCase().includes(term) ||
      client.phone.includes(term) ||
      client.email.toLowerCase().includes(term)
  );
}

export function formatLastMeeting(meeting) {
  if (!meeting) return '—';
  return format(getMeetingDateTime(meeting), 'd MMM yyyy, HH:mm', { locale: he });
}

export function getClientMeetings(meetings, client) {
  return meetings
    .filter((meeting) => getClientKey(meeting) === client.id)
    .sort((a, b) => getMeetingDateTime(b) - getMeetingDateTime(a));
}

export function getClientBaseData(client) {
  return {
    phone: client.phone,
    fullName: client.fullName,
    email: client.email,
    tags: client.tags,
    color: client.color,
  };
}

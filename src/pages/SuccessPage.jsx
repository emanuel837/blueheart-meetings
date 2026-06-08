import { Link, useLocation, Navigate } from 'react-router-dom';
import { format, parse } from 'date-fns';
import { he } from 'date-fns/locale';
import { Calendar, CheckCircle, MapPin, Clock, User } from 'lucide-react';
import { buildGoogleCalendarUrl } from '../utils/googleCalendar';

function SuccessPage() {
  const { state } = useLocation();
  const meeting = state?.meeting;

  if (!meeting) {
    return <Navigate to="/" replace />;
  }

  const formattedDate = format(
    parse(meeting.date, 'yyyy-MM-dd', new Date()),
    'EEEE, d בMMMM yyyy',
    { locale: he }
  );

  const calendarUrl = buildGoogleCalendarUrl({
    title: `פגישה ב-Blue Heart - ${meeting.branchName}`,
    date: meeting.date,
    time: meeting.time,
    durationMinutes: meeting.slotDuration ?? 30,
    location: meeting.branchAddress,
    details: `שם: ${meeting.fullName}\nטלפון: ${meeting.phone}\nאימייל: ${meeting.email}${
      meeting.notes ? `\nהערות: ${meeting.notes}` : ''
    }`,
  });

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full rounded-2xl bg-white border border-gray-200 p-8 shadow-sm text-center">
        <CheckCircle className="h-16 w-16 mx-auto text-[var(--success)] mb-4" />

        <h1 className="text-2xl font-bold text-[var(--primary)]">
          הפגישה נקבעה בהצלחה!
        </h1>
        <p className="mt-2 text-gray-600">
          תודה {meeting.fullName}, הפגישה שלך אושרה.
        </p>

        <div className="mt-8 rounded-xl bg-gray-50 p-5 text-right space-y-3 text-sm">
          <p className="flex items-center gap-3 text-gray-700">
            <MapPin className="h-5 w-5 shrink-0 text-[var(--primary)]" />
            <span>
              <span className="font-medium">{meeting.branchName}</span>
              <br />
              <span className="text-gray-500">{meeting.branchAddress}</span>
            </span>
          </p>
          <p className="flex items-center gap-3 text-gray-700">
            <Calendar className="h-5 w-5 shrink-0 text-[var(--primary)]" />
            <span>{formattedDate}</span>
          </p>
          <p className="flex items-center gap-3 text-gray-700">
            <Clock className="h-5 w-5 shrink-0 text-[var(--primary)]" />
            <span dir="ltr">{meeting.time}</span>
          </p>
          <p className="flex items-center gap-3 text-gray-700">
            <User className="h-5 w-5 shrink-0 text-[var(--primary)]" />
            <span>{meeting.fullName}</span>
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-lg bg-[var(--primary)] py-3 text-white font-semibold hover:bg-[var(--primary-light)] transition-colors"
          >
            <Calendar className="h-5 w-5" />
            הוספה ליומן Google
          </a>

          <Link
            to="/"
            className="block w-full rounded-lg border-2 border-[var(--primary)] py-3 text-[var(--primary)] font-semibold hover:bg-[var(--primary)]/5 transition-colors"
          >
            קביעת פגישה נוספת
          </Link>
        </div>
      </div>
    </main>
  );
}

export default SuccessPage;

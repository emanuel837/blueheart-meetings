import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import {
  Building2,
  Calendar,
  CalendarDays,
  Users,
} from 'lucide-react';
import StatusBadge from '../../components/admin/StatusBadge';
import { subscribeToBranches, toggleBranchActive } from '../../firebase/branches';
import { subscribeToMeetings } from '../../firebase/meetings';
import {
  getMeetingDateTime,
  getMeetingsThisWeek,
  getMeetingsToday,
  getUniqueClientsCount,
  getUpcomingMeetings,
} from '../../utils/meetings';

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="rounded-lg bg-[#233667]/5 p-2">
          <Icon className="h-5 w-5 text-[#233667]" />
        </div>
      </div>
      <p className="mt-4 text-3xl font-bold text-[#233667]">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{label}</p>
    </div>
  );
}

function Dashboard() {
  const [meetings, setMeetings] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    let meetingsReady = false;
    let branchesReady = false;

    function checkReady() {
      if (meetingsReady && branchesReady) setLoading(false);
    }

    const unsubMeetings = subscribeToMeetings((data) => {
      setMeetings(data);
      meetingsReady = true;
      checkReady();
    });

    const unsubBranches = subscribeToBranches((data) => {
      setBranches(data);
      branchesReady = true;
      checkReady();
    });

    return () => {
      unsubMeetings();
      unsubBranches();
    };
  }, []);

  const stats = useMemo(
    () => ({
      today: getMeetingsToday(meetings).length,
      week: getMeetingsThisWeek(meetings).length,
      clients: getUniqueClientsCount(meetings),
      activeBranches: branches.filter((branch) => branch.isActive).length,
    }),
    [meetings, branches]
  );

  const upcomingMeetings = useMemo(
    () => getUpcomingMeetings(meetings, 5),
    [meetings]
  );

  async function handleToggleBranch(branch) {
    setTogglingId(branch.id);
    try {
      await toggleBranchActive(branch.id, !branch.isActive);
    } finally {
      setTogglingId(null);
    }
  }

  if (loading) {
    return <p className="text-center text-gray-500 py-12">טוען נתונים...</p>;
  }

  return (
    <div dir="rtl">
      <h1 className="text-2xl font-bold text-[#233667]">דשבורד</h1>
      <p className="mt-1 text-sm text-gray-500">סקירה כללית — מתעדכן בזמן אמת</p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Calendar} label="פגישות היום" value={stats.today} />
        <StatCard icon={CalendarDays} label="פגישות השבוע" value={stats.week} />
        <StatCard icon={Users} label="סה״כ לקוחות" value={stats.clients} />
        <StatCard icon={Building2} label="סניפים פעילים" value={stats.activeBranches} />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-[#233667] mb-4">סניפים</h2>

          <ul className="space-y-2 max-h-[420px] overflow-y-auto">
            {branches.map((branch) => (
              <li
                key={branch.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">{branch.name}</p>
                  <p className="text-xs text-gray-500 truncate">{branch.address}</p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={branch.isActive}
                  aria-label={`${branch.name} - ${branch.isActive ? 'פעיל' : 'לא פעיל'}`}
                  disabled={togglingId === branch.id}
                  onClick={() => handleToggleBranch(branch)}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
                    branch.isActive ? 'bg-[#233667]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
                      branch.isActive ? 'start-1' : 'end-1'
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-[#233667] mb-4">פגישות קרובות</h2>

          {upcomingMeetings.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">אין פגישות קרובות</p>
          ) : (
            <ul className="space-y-3">
              {upcomingMeetings.map((meeting) => (
                <li
                  key={meeting.id}
                  className="rounded-lg border border-gray-100 p-4 hover:border-gray-200 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900">{meeting.fullName}</p>
                      <p className="text-sm text-gray-500 mt-1" dir="ltr">
                        {format(getMeetingDateTime(meeting), 'EEEE d/M, HH:mm', {
                          locale: he,
                        })}
                      </p>
                    </div>
                    <StatusBadge status={meeting.status} />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <p>
                      <span className="text-gray-400">סניף: </span>
                      {meeting.branchName}
                    </p>
                    <p>
                      <span className="text-gray-400">מומחה: </span>
                      {meeting.expertName || meeting.expert || 'לא שויך'}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;

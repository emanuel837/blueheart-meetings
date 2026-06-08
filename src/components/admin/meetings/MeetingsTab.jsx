import { useMemo, useState } from 'react';
import { format, parse } from 'date-fns';
import { he } from 'date-fns/locale';
import { CheckCircle, XCircle } from 'lucide-react';
import StatusBadge from '../StatusBadge';
import { updateMeetingStatus } from '../../../firebase/meetings';
import { filterMeetings } from '../../../utils/meetings';

function MeetingsTab({ meetings, branches }) {
  const [branchId, setBranchId] = useState('');
  const [status, setStatus] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const filteredMeetings = useMemo(
    () => filterMeetings(meetings, { branchId, status, dateFrom, dateTo }),
    [meetings, branchId, status, dateFrom, dateTo]
  );

  async function handleStatusChange(meetingId, newStatus) {
    setUpdatingId(meetingId);
    try {
      await updateMeetingStatus(meetingId, newStatus);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <select
          value={branchId}
          onChange={(e) => setBranchId(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#233667]"
        >
          <option value="">כל הסניפים</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#233667]"
        >
          <option value="">כל הסטטוסים</option>
          <option value="confirmed">מאושר</option>
          <option value="cancelled">בוטל</option>
          <option value="completed">הושלם</option>
        </select>

        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#233667]"
          placeholder="מתאריך"
        />

        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#233667]"
          placeholder="עד תאריך"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
              <th className="px-4 py-3 text-right font-medium">תאריך</th>
              <th className="px-4 py-3 text-right font-medium">שעה</th>
              <th className="px-4 py-3 text-right font-medium">לקוח</th>
              <th className="px-4 py-3 text-right font-medium">טלפון</th>
              <th className="px-4 py-3 text-right font-medium">מומחה</th>
              <th className="px-4 py-3 text-right font-medium">סניף</th>
              <th className="px-4 py-3 text-right font-medium">סטטוס</th>
              <th className="px-4 py-3 text-right font-medium">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {filteredMeetings.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-gray-500">
                  לא נמצאו פגישות
                </td>
              </tr>
            ) : (
              filteredMeetings.map((meeting) => (
                <tr key={meeting.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {format(
                      parse(meeting.date, 'yyyy-MM-dd', new Date()),
                      'd MMM yyyy',
                      { locale: he }
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap" dir="ltr">
                    {meeting.time}
                  </td>
                  <td className="px-4 py-3">{meeting.fullName}</td>
                  <td className="px-4 py-3" dir="ltr">
                    {meeting.phone}
                  </td>
                  <td className="px-4 py-3">
                    {meeting.expertName || meeting.expert || 'לא שויך'}
                  </td>
                  <td className="px-4 py-3">{meeting.branchName}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={meeting.status} />
                  </td>
                  <td className="px-4 py-3">
                    {meeting.status === 'confirmed' && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          title="סימון כהושלם"
                          disabled={updatingId === meeting.id}
                          onClick={() => handleStatusChange(meeting.id, 'completed')}
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-[#233667] disabled:opacity-50"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          title="ביטול פגישה"
                          disabled={updatingId === meeting.id}
                          onClick={() => handleStatusChange(meeting.id, 'cancelled')}
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MeetingsTab;

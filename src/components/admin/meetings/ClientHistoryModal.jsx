import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { format, parse } from 'date-fns';
import { he } from 'date-fns/locale';
import { X } from 'lucide-react';
import StatusBadge from '../StatusBadge';

function ClientHistoryModal({ client, meetings, open, onClose }) {
  if (!client) return null;

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl max-h-[85vh] overflow-hidden flex flex-col">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <DialogTitle className="text-xl font-bold text-[#233667]">
                היסטוריית פגישות
              </DialogTitle>
              <p className="mt-1 text-sm text-gray-500">{client.fullName}</p>
              <p className="text-sm text-gray-400" dir="ltr">
                {client.phone} · {client.email}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {meetings.length === 0 ? (
            <p className="text-center text-gray-500 py-8">אין פגישות</p>
          ) : (
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="py-2 text-right font-medium">תאריך</th>
                    <th className="py-2 text-right font-medium">שעה</th>
                    <th className="py-2 text-right font-medium">סניף</th>
                    <th className="py-2 text-right font-medium">מומחה</th>
                    <th className="py-2 text-right font-medium">סטטוס</th>
                  </tr>
                </thead>
                <tbody>
                  {meetings.map((meeting) => (
                    <tr key={meeting.id} className="border-b border-gray-100">
                      <td className="py-3">
                        {format(
                          parse(meeting.date, 'yyyy-MM-dd', new Date()),
                          'd MMM yyyy',
                          { locale: he }
                        )}
                      </td>
                      <td className="py-3" dir="ltr">
                        {meeting.time}
                      </td>
                      <td className="py-3">{meeting.branchName}</td>
                      <td className="py-3">
                        {meeting.expertName || meeting.expert || 'לא שויך'}
                      </td>
                      <td className="py-3">
                        <StatusBadge status={meeting.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default ClientHistoryModal;

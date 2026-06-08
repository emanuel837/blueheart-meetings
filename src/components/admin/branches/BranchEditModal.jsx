import { useEffect, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { X } from 'lucide-react';
import { branchScheduleToForm } from '../../../utils/branches';
import { WEEK_DAYS } from '../../../utils/experts';

const DEFAULT_FORM = {
  workingDays: [0, 1, 2, 3, 4],
  workingHours: { start: '09:00', end: '17:00' },
};

function BranchEditModal({ open, onClose, onSubmit, branch, saving }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && branch) {
      setForm(branchScheduleToForm(branch));
      setError(null);
    }
  }, [open, branch]);

  function toggleDay(dayValue) {
    setForm((prev) => {
      const workingDays = prev.workingDays.includes(dayValue)
        ? prev.workingDays.filter((d) => d !== dayValue)
        : [...prev.workingDays, dayValue].sort((a, b) => a - b);

      return { ...prev, workingDays };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    if (!form.workingDays.length) {
      setError('נא לבחור לפחות יום אחד');
      return;
    }

    try {
      await onSubmit(form);
      onClose();
    } catch {
      setError('שגיאה בעדכון הסניף');
    }
  }

  if (!branch) return null;

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <DialogTitle className="text-xl font-bold text-[#233667]">
                עריכת שעות פעילות
              </DialogTitle>
              <p className="mt-1 text-sm text-gray-500">{branch.name}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <fieldset>
              <legend className="block text-sm font-medium text-gray-700 mb-2">
                ימי פעילות
              </legend>
              <div className="flex flex-wrap gap-2">
                {WEEK_DAYS.map((day) => (
                  <label
                    key={day.value}
                    className={`flex items-center rounded-lg border px-3 py-1.5 text-sm cursor-pointer transition-colors ${
                      form.workingDays.includes(day.value)
                        ? 'border-[#233667] bg-[#233667]/10 text-[#233667]'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.workingDays.includes(day.value)}
                      onChange={() => toggleDay(day.value)}
                      className="sr-only"
                    />
                    {day.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="start" className="block text-sm font-medium text-gray-700 mb-1">
                  שעת פתיחה
                </label>
                <input
                  id="start"
                  type="time"
                  value={form.workingHours.start}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      workingHours: { ...prev.workingHours, start: e.target.value },
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-[#233667]"
                />
              </div>
              <div>
                <label htmlFor="end" className="block text-sm font-medium text-gray-700 mb-1">
                  שעת סגירה
                </label>
                <input
                  id="end"
                  type="time"
                  value={form.workingHours.end}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      workingHours: { ...prev.workingHours, end: e.target.value },
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-[#233667]"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600 text-center">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                ביטול
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-lg bg-[#233667] py-2.5 text-sm font-semibold text-white hover:bg-[#2d4a8a] disabled:opacity-50"
              >
                {saving ? 'שומר...' : 'שמירה'}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default BranchEditModal;

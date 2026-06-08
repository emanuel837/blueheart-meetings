import { useEffect, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { X } from 'lucide-react';
import { EMPTY_EXPERT_FORM, WEEK_DAYS } from '../../../utils/experts';

function ExpertFormModal({ open, onClose, onSubmit, branches, initialData, saving }) {
  const [form, setForm] = useState(EMPTY_EXPERT_FORM);
  const [error, setError] = useState(null);
  const isEdit = Boolean(initialData?.id);

  useEffect(() => {
    if (open) {
      setForm(initialData?.form || EMPTY_EXPERT_FORM);
      setError(null);
    }
  }, [open, initialData]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleDay(dayValue) {
    setForm((prev) => {
      const days = prev.availability.days.includes(dayValue)
        ? prev.availability.days.filter((d) => d !== dayValue)
        : [...prev.availability.days, dayValue].sort((a, b) => a - b);

      return {
        ...prev,
        availability: { ...prev.availability, days },
      };
    });
  }

  function updateAvailability(field, value) {
    setForm((prev) => ({
      ...prev,
      availability: { ...prev.availability, [field]: value },
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    if (!form.fullName.trim()) {
      setError('נא להזין שם מלא');
      return;
    }

    if (!form.branchId) {
      setError('נא לבחור סניף');
      return;
    }

    if (!form.availability.days.length) {
      setError('נא לבחור לפחות יום אחד בזמינות');
      return;
    }

    const branch = branches.find((item) => item.id === form.branchId);

    try {
      await onSubmit({
        fullName: form.fullName.trim(),
        branchId: form.branchId,
        branchName: branch?.name || '',
        phone: form.phone.trim(),
        specialty: form.specialty.trim(),
        isActive: form.isActive,
        availability: form.availability,
      });
      onClose();
    } catch {
      setError('שגיאה בשמירת המומחה');
    }
  }

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-start justify-between gap-4 mb-6">
            <DialogTitle className="text-xl font-bold text-[#233667]">
              {isEdit ? 'עריכת מומחה' : 'הוספת מומחה'}
            </DialogTitle>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                שם מלא <span className="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                value={form.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-[#233667] focus:ring-2 focus:ring-[#233667]/20"
              />
            </div>

            <div>
              <label htmlFor="branchId" className="block text-sm font-medium text-gray-700 mb-1">
                סניף <span className="text-red-500">*</span>
              </label>
              <select
                id="branchId"
                value={form.branchId}
                onChange={(e) => updateField('branchId', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-[#233667] focus:ring-2 focus:ring-[#233667]/20"
              >
                <option value="">בחר סניף</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                טלפון
              </label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                dir="ltr"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-[#233667] focus:ring-2 focus:ring-[#233667]/20"
              />
            </div>

            <div>
              <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
                התמחות
              </label>
              <input
                id="specialty"
                type="text"
                value={form.specialty}
                onChange={(e) => updateField('specialty', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-[#233667] focus:ring-2 focus:ring-[#233667]/20"
              />
            </div>

            <fieldset>
              <legend className="block text-sm font-medium text-gray-700 mb-2">זמינות</legend>
              <div className="flex flex-wrap gap-2 mb-3">
                {WEEK_DAYS.map((day) => (
                  <label
                    key={day.value}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm cursor-pointer transition-colors ${
                      form.availability.days.includes(day.value)
                        ? 'border-[#233667] bg-[#233667]/10 text-[#233667]'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.availability.days.includes(day.value)}
                      onChange={() => toggleDay(day.value)}
                      className="sr-only"
                    />
                    {day.label}
                  </label>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="start" className="block text-xs text-gray-500 mb-1">
                    משעה
                  </label>
                  <input
                    id="start"
                    type="time"
                    value={form.availability.start}
                    onChange={(e) => updateAvailability('start', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#233667]"
                  />
                </div>
                <div>
                  <label htmlFor="end" className="block text-xs text-gray-500 mb-1">
                    עד שעה
                  </label>
                  <input
                    id="end"
                    type="time"
                    value={form.availability.end}
                    onChange={(e) => updateAvailability('end', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#233667]"
                  />
                </div>
              </div>
            </fieldset>

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
                {saving ? 'שומר...' : isEdit ? 'עדכון' : 'הוספה'}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default ExpertFormModal;

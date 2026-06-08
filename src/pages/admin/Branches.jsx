import { useEffect, useMemo, useState } from 'react';
import { Clock, MapPin, Pencil, Phone } from 'lucide-react';
import BranchEditModal from '../../components/admin/branches/BranchEditModal';
import {
  subscribeToBranches,
  toggleBranchActive,
  updateBranchSchedule,
} from '../../firebase/branches';
import { formatWorkingDays, formatWorkingHours } from '../../utils/branches';

function Branches() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [editingBranch, setEditingBranch] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToBranches((data) => {
      setBranches(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const sortedBranches = useMemo(
    () => [...branches].sort((a, b) => Number(a.id) - Number(b.id)),
    [branches]
  );

  async function handleToggle(branch) {
    setTogglingId(branch.id);
    try {
      await toggleBranchActive(branch.id, !branch.isActive);
    } finally {
      setTogglingId(null);
    }
  }

  async function handleSaveSchedule(schedule) {
    setSaving(true);
    try {
      await updateBranchSchedule(editingBranch.id, schedule);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-center text-gray-500 py-12">טוען סניפים...</p>;
  }

  return (
    <div dir="rtl">
      <h1 className="text-2xl font-bold text-[#233667]">סניפים</h1>
      <p className="mt-1 text-sm text-gray-500">
        {sortedBranches.length} סניפים · סניפים לא פעילים לא יוצגו בדף ההזמנות
      </p>

      {sortedBranches.length === 0 ? (
        <p className="mt-8 text-center text-gray-500 py-12">
          אין סניפים. טענו סניפים בדף /admin/seed
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {sortedBranches.map((branch) => {
            const isActive = branch.isActive !== false;

            return (
              <article
                key={branch.id}
                className={`rounded-2xl border p-5 transition-all ${
                  isActive
                    ? 'bg-white border-gray-200 shadow-sm'
                    : 'bg-gray-100 border-gray-200 opacity-75'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2 min-w-0">
                    {isActive && (
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
                    )}
                    <span
                      className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold ${
                        isActive
                          ? 'bg-[#233667] text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {branch.id}
                    </span>
                    <h2
                      className={`text-lg font-semibold truncate ${
                        isActive ? 'text-[#233667]' : 'text-gray-500'
                      }`}
                    >
                      {branch.name}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEditingBranch(branch)}
                    className="shrink-0 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-[#233667] transition-colors"
                    title="עריכה"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </div>

                <div
                  className={`space-y-2.5 text-sm ${
                    isActive ? 'text-gray-600' : 'text-gray-400'
                  }`}
                >
                  <p className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{branch.address}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0" />
                    <span dir="ltr">{branch.phone}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 shrink-0" />
                    <span dir="ltr">{formatWorkingHours(branch.workingHours)}</span>
                  </p>
                  <p className="text-xs">{formatWorkingDays(branch.workingDays)}</p>
                </div>

                <div className="mt-5">
                  <div
                    className={`grid grid-cols-2 rounded-xl border-2 overflow-hidden ${
                      isActive ? 'border-gray-200' : 'border-gray-300'
                    }`}
                  >
                    <button
                      type="button"
                      disabled={togglingId === branch.id}
                      onClick={() => !isActive && handleToggle(branch)}
                      className={`py-3 text-sm font-semibold transition-colors disabled:opacity-50 ${
                        isActive
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      פעיל
                    </button>
                    <button
                      type="button"
                      disabled={togglingId === branch.id}
                      onClick={() => isActive && handleToggle(branch)}
                      className={`py-3 text-sm font-semibold transition-colors disabled:opacity-50 ${
                        !isActive
                          ? 'bg-gray-500 text-white'
                          : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      לא פעיל
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <BranchEditModal
        open={Boolean(editingBranch)}
        onClose={() => setEditingBranch(null)}
        onSubmit={handleSaveSchedule}
        branch={editingBranch}
        saving={saving}
      />
    </div>
  );
}

export default Branches;

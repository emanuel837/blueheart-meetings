import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import ExpertFormModal from '../../components/admin/experts/ExpertFormModal';
import { subscribeToBranches } from '../../firebase/branches';
import {
  createExpert,
  deleteExpert,
  subscribeToExperts,
  toggleExpertActive,
  updateExpert,
} from '../../firebase/experts';
import { expertToForm } from '../../utils/experts';

function Experts() {
  const [experts, setExperts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpert, setEditingExpert] = useState(null);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    let expertsReady = false;
    let branchesReady = false;

    function checkReady() {
      if (expertsReady && branchesReady) setLoading(false);
    }

    const unsubExperts = subscribeToExperts((data) => {
      setExperts(data);
      expertsReady = true;
      checkReady();
    });

    const unsubBranches = subscribeToBranches((data) => {
      setBranches(data);
      branchesReady = true;
      checkReady();
    });

    return () => {
      unsubExperts();
      unsubBranches();
    };
  }, []);

  function openAddModal() {
    setEditingExpert(null);
    setModalOpen(true);
  }

  function openEditModal(expert) {
    setEditingExpert(expert);
    setModalOpen(true);
  }

  async function handleSubmit(data) {
    setSaving(true);
    try {
      if (editingExpert) {
        await updateExpert(editingExpert.id, data);
      } else {
        await createExpert(data);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(expert) {
    if (!window.confirm(`למחוק את ${expert.fullName}?`)) return;

    setActionId(expert.id);
    try {
      await deleteExpert(expert.id);
    } finally {
      setActionId(null);
    }
  }

  async function handleToggleActive(expert) {
    setActionId(expert.id);
    try {
      await toggleExpertActive(expert.id, !expert.isActive);
    } finally {
      setActionId(null);
    }
  }

  if (loading) {
    return <p className="text-center text-gray-500 py-12">טוען נתונים...</p>;
  }

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[#233667]">מומחים</h1>
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-lg bg-[#233667] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2d4a8a] transition-colors"
        >
          <Plus className="h-4 w-4" />
          הוספת מומחה
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
              <th className="px-4 py-3 text-right font-medium">שם</th>
              <th className="px-4 py-3 text-right font-medium">סניף</th>
              <th className="px-4 py-3 text-right font-medium">טלפון</th>
              <th className="px-4 py-3 text-right font-medium">התמחות</th>
              <th className="px-4 py-3 text-right font-medium">סטטוס</th>
              <th className="px-4 py-3 text-right font-medium">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {experts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                  אין מומחים. לחצו &quot;הוספת מומחה&quot; להתחלה.
                </td>
              </tr>
            ) : (
              experts.map((expert) => (
                <tr key={expert.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium">{expert.fullName}</td>
                  <td className="px-4 py-3">{expert.branchName}</td>
                  <td className="px-4 py-3" dir="ltr">
                    {expert.phone || '—'}
                  </td>
                  <td className="px-4 py-3">{expert.specialty || '—'}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      disabled={actionId === expert.id}
                      onClick={() => handleToggleActive(expert)}
                      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors disabled:opacity-50 ${
                        expert.isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      {expert.isActive ? 'פעיל' : 'לא פעיל'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        title="עריכה"
                        onClick={() => openEditModal(expert)}
                        className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-[#233667]"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title="מחיקה"
                        disabled={actionId === expert.id}
                        onClick={() => handleDelete(expert)}
                        className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ExpertFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        branches={branches}
        initialData={editingExpert ? { id: editingExpert.id, form: expertToForm(editingExpert) } : null}
        saving={saving}
      />
    </div>
  );
}

export default Experts;

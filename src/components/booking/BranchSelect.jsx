import { useEffect, useState } from 'react';
import { MapPin, Phone } from 'lucide-react';
import { getActiveBranches } from '../../firebase/branches';

function BranchSelect({ selectedBranch, onSelect }) {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getActiveBranches()
      .then(setBranches)
      .catch(() => setError('שגיאה בטעינת הסניפים'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500 py-12">טוען סניפים...</p>;
  }

  if (error) {
    return <p className="text-center text-[var(--danger)] py-12">{error}</p>;
  }

  if (branches.length === 0) {
    return <p className="text-center text-gray-500 py-12">לא נמצאו סניפים פעילים</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {branches.map((branch) => {
        const isSelected = selectedBranch?.id === branch.id;

        return (
          <button
            key={branch.id}
            type="button"
            onClick={() => onSelect(branch)}
            className={`text-right rounded-xl border-2 p-5 transition-all hover:shadow-md ${
              isSelected
                ? 'border-[var(--primary)] bg-[var(--primary)]/5 shadow-md'
                : 'border-gray-200 bg-white hover:border-[var(--primary-light)]'
            }`}
          >
            <h3 className="text-lg font-semibold text-[var(--primary)]">{branch.name}</h3>
            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-[var(--accent)]" />
                <span>{branch.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-[var(--accent)]" />
                <span dir="ltr">{branch.phone}</span>
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default BranchSelect;

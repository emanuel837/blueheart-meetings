import { useState } from 'react';
import { seedBranches } from '../../firebase/seedData';

function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  async function handleSeed() {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const count = await seedBranches();
      setMessage(`${count} סניפים נטענו בהצלחה ל-Firebase`);
    } catch (err) {
      setError(err.message || 'שגיאה בטעינת הסניפים');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold text-[var(--primary)]">טעינת נתוני סניפים</h1>

        <button
          type="button"
          onClick={handleSeed}
          disabled={loading}
          className="rounded-lg bg-[var(--primary)] px-6 py-3 text-white font-medium hover:bg-[var(--primary-light)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'טוען...' : 'טען סניפים ל-Firebase'}
        </button>

        {message && (
          <p className="text-[var(--success)]">{message}</p>
        )}

        {error && (
          <p className="text-[var(--danger)]">{error}</p>
        )}
      </div>
    </main>
  );
}

export default SeedPage;

import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Shield } from 'lucide-react';
import { auth } from '../../firebase/config';
import { isAdminSetupComplete, markAdminSetupComplete } from '../../firebase/setup';
import { useAuth } from '../../context/AuthContext';
import { getSetupErrorMessage } from '../../utils/authErrors';

function AdminSetup() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [setupComplete, setSetupComplete] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    isAdminSetupComplete()
      .then(setSetupComplete)
      .catch(() => setSetupComplete(false));
  }, []);

  if (authLoading || setupComplete === null) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">טוען...</p>
      </main>
    );
  }

  if (setupComplete) {
    return <Navigate to="/admin" replace />;
  }

  if (user) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('הסיסמאות אינן תואמות');
      return;
    }

    if (password.length < 6) {
      setError('הסיסמה חייבת להכיל לפחות 6 תווים');
      return;
    }

    setLoading(true);

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      await markAdminSetupComplete(credential.user.uid);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(getSetupErrorMessage(err));
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md rounded-2xl bg-white border border-gray-200 p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary)]/10">
            <Shield className="h-7 w-7 text-[var(--primary)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--primary)]">הגדרת מנהל ראשון</h1>
          <p className="mt-1 text-sm text-gray-500">
            יצירה חד-פעמית של חשבון מנהל למערכת
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              אימייל
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              dir="ltr"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              סיסמה
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              dir="ltr"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              אשר סיסמה
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              dir="ltr"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-[var(--danger)] text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[var(--primary)] py-3 text-white font-semibold hover:bg-[var(--primary-light)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'יוצר מנהל...' : 'יצירת מנהל'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default AdminSetup;

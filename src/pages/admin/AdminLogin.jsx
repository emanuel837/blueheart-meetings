import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Lock } from 'lucide-react';
import { auth } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';

function formatFirebaseError(error) {
  if (!error) return 'Unknown error';

  const code = error.code ? `[${error.code}] ` : '';
  const message = error.message || String(error);
  return `${code}${message}`;
}

function AdminLogin() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('[AdminLogin] Auth instance:', {
      authReady: Boolean(auth),
      appName: auth?.app?.name,
      currentUser: auth?.currentUser?.email ?? null,
    });
  }, []);

  if (authLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">טוען...</p>
      </main>
    );
  }

  if (user) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('[AdminLogin] Attempting sign in for:', email.trim());
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      console.error('[AdminLogin] Firebase auth error:', err);
      console.error('[AdminLogin] Error code:', err?.code);
      console.error('[AdminLogin] Error message:', err?.message);
      setError(formatFirebaseError(err));
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md rounded-2xl bg-white border border-gray-200 p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary)]/10">
            <Lock className="h-7 w-7 text-[var(--primary)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--primary)]">כניסת מנהל</h1>
          <p className="mt-1 text-sm text-gray-500">Blue Heart — מערכת ניהול</p>
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
              autoComplete="current-password"
              dir="ltr"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-[var(--danger)] text-center break-words" dir="ltr">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[var(--primary)] py-3 text-white font-semibold hover:bg-[var(--primary-light)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'מתחבר...' : 'כניסה'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default AdminLogin;

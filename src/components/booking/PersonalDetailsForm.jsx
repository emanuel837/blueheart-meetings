import { useState } from 'react';
import {
  isValidEmail,
  isValidIsraeliPhone,
  normalizePhone,
} from '../../utils/validation';

function PersonalDetailsForm({ onSubmit, submitting }) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  function validate() {
    const nextErrors = {};

    if (!fullName.trim()) {
      nextErrors.fullName = 'נא להזין שם מלא';
    }

    if (!phone.trim()) {
      nextErrors.phone = 'נא להזין מספר טלפון';
    } else if (!isValidIsraeliPhone(phone)) {
      nextErrors.phone = 'מספר טלפון לא תקין (05X-XXXXXXX)';
    }

    if (!email.trim()) {
      nextErrors.email = 'נא להזין כתובת אימייל';
    } else if (!isValidEmail(email)) {
      nextErrors.email = 'כתובת אימייל לא תקינה';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;

    onSubmit({
      fullName: fullName.trim(),
      phone: normalizePhone(phone),
      email: email.trim(),
      notes: notes.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg mx-auto">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
          שם מלא <span className="text-[var(--danger)]">*</span>
        </label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none"
          placeholder="ישראל ישראלי"
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-[var(--danger)]">{errors.fullName}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          טלפון <span className="text-[var(--danger)]">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none"
          placeholder="050-1234567"
          dir="ltr"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-[var(--danger)]">{errors.phone}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          אימייל <span className="text-[var(--danger)]">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none"
          placeholder="name@example.com"
          dir="ltr"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-[var(--danger)]">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          הערות
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 outline-none resize-none"
          placeholder="הערות נוספות (אופציונלי)"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-[var(--primary)] py-3 text-white font-semibold hover:bg-[var(--primary-light)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? 'שולח...' : 'אישור וקביעת פגישה'}
      </button>
    </form>
  );
}

export default PersonalDetailsForm;

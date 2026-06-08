const AUTH_ERROR_MESSAGES = {
  'auth/invalid-email': 'כתובת אימייל לא תקינה',
  'auth/user-disabled': 'המשתמש הושבת',
  'auth/user-not-found': 'אימייל או סיסמה שגויים',
  'auth/wrong-password': 'אימייל או סיסמה שגויים',
  'auth/invalid-credential': 'אימייל או סיסמה שגויים',
  'auth/too-many-requests': 'יותר מדי ניסיונות. נסו שוב מאוחר יותר',
  'auth/email-already-in-use': 'כתובת אימייל כבר בשימוש',
  'auth/weak-password': 'הסיסמה חלשה מדי (מינימום 6 תווים)',
};

export function getAuthErrorMessage(error) {
  return AUTH_ERROR_MESSAGES[error?.code] || 'שגיאה בהתחברות. אנא נסו שוב';
}

export function getSetupErrorMessage(error) {
  return AUTH_ERROR_MESSAGES[error?.code] || 'שגיאה ביצירת מנהל. אנא נסו שוב';
}

const ISRAELI_PHONE_REGEX = /^05\d{8}$/;

export function normalizePhone(phone) {
  return phone.replace(/\D/g, '');
}

export function isValidIsraeliPhone(phone) {
  return ISRAELI_PHONE_REGEX.test(normalizePhone(phone));
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

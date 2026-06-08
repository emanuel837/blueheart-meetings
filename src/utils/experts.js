export const WEEK_DAYS = [
  { value: 0, label: 'ראשון' },
  { value: 1, label: 'שני' },
  { value: 2, label: 'שלישי' },
  { value: 3, label: 'רביעי' },
  { value: 4, label: 'חמישי' },
  { value: 5, label: 'שישי' },
  { value: 6, label: 'שבת' },
];

export const EMPTY_EXPERT_FORM = {
  fullName: '',
  branchId: '',
  phone: '',
  specialty: '',
  isActive: true,
  availability: {
    days: [0, 1, 2, 3, 4],
    start: '09:00',
    end: '17:00',
  },
};

export function formatAvailability(availability) {
  if (!availability?.days?.length) return 'לא הוגדר';

  const dayLabels = WEEK_DAYS.filter((day) =>
    availability.days.includes(day.value)
  )
    .map((day) => day.label)
    .join(', ');

  return `${dayLabels} · ${availability.start}–${availability.end}`;
}

export function expertToForm(expert) {
  return {
    fullName: expert.fullName || '',
    branchId: expert.branchId || '',
    phone: expert.phone || '',
    specialty: expert.specialty || '',
    isActive: expert.isActive ?? true,
    availability: {
      days: expert.availability?.days || [0, 1, 2, 3, 4],
      start: expert.availability?.start || '09:00',
      end: expert.availability?.end || '17:00',
    },
  };
}

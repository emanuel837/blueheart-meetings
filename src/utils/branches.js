import { WEEK_DAYS } from './experts';

export function formatWorkingDays(workingDays = []) {
  if (!workingDays.length) return 'לא הוגדר';

  return WEEK_DAYS.filter((day) => workingDays.includes(day.value))
    .map((day) => day.label)
    .join(', ');
}

export function formatWorkingHours(workingHours) {
  if (!workingHours?.start || !workingHours?.end) return 'לא הוגדר';
  return `${workingHours.start} – ${workingHours.end}`;
}

export function branchScheduleToForm(branch) {
  return {
    workingDays: branch.workingDays || [0, 1, 2, 3, 4],
    workingHours: {
      start: branch.workingHours?.start || '09:00',
      end: branch.workingHours?.end || '17:00',
    },
  };
}

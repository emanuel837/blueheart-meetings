import { format } from 'date-fns';

export function formatDateKey(date) {
  return format(date, 'yyyy-MM-dd');
}

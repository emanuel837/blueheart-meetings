const STATUS_STYLES = {
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
  completed: 'bg-gray-100 text-gray-600 border-gray-200',
};

const STATUS_LABELS = {
  confirmed: 'מאושר',
  pending: 'ממתין',
  cancelled: 'בוטל',
  completed: 'הושלם',
};

function StatusBadge({ status = 'confirmed' }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.confirmed;
  const label = STATUS_LABELS[status] || status;

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${style}`}>
      {label}
    </span>
  );
}

export default StatusBadge;

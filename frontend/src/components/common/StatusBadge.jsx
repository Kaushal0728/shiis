const statusStyles = {
  active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  inactive: 'bg-surface-700/40 text-surface-400 border-surface-600/30',
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  completed: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  cancelled: 'bg-red-500/15 text-red-400 border-red-500/20',
  booked: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
};

export default function StatusBadge({ status = 'active', label }) {
  const key = status.toLowerCase();
  const style = statusStyles[key] || statusStyles.active;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full border ${style}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {label || status}
    </span>
  );
}

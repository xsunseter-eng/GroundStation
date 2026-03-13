interface TelemetryCardProps {
  label: string;
  value: string | number;
  unit?: string;
  status?: 'normal' | 'warning' | 'critical';
}

export function TelemetryCard({ label, value, unit, status = 'normal' }: TelemetryCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'warning':
        return 'text-amber-400';
      case 'critical':
        return 'text-red-400';
      default:
        return 'text-emerald-400';
    }
  };

  return (
    <div className="flex flex-col gap-1 p-3 border border-red-950/50 bg-black/40">
      <div className="text-xs text-red-400/60 uppercase tracking-wider">{label}</div>
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-mono ${getStatusColor()}`}>{value}</span>
        {unit && <span className="text-sm text-red-300/40">{unit}</span>}
      </div>
    </div>
  );
}
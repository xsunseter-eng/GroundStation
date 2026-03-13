interface StatusIndicatorProps {
  label: string;
  active: boolean;
}

export function StatusIndicator({ label, active }: StatusIndicatorProps) {
  return (
    <div className="flex items-center gap-2 p-2 border border-red-950/50 bg-black/40">
      <div className={`w-2 h-2 rounded-full ${active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-red-950/50'}`} />
      <span className="text-xs text-red-300/60 uppercase tracking-wide">{label}</span>
    </div>
  );
}
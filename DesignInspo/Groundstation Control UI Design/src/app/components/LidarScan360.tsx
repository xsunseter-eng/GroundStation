export function LidarScan360() {
  return (
    <div className="border border-red-950/50 bg-black/60 overflow-hidden" style={{ height: '180px' }}>
      <img 
        src="https://images.unsplash.com/photo-1706442969354-58c81fa38bd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzNjAlMjBwYW5vcmFtaWMlMjByYWRhciUyMHNjYW58ZW58MXx8fHwxNzczMjQzMzU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        alt="360° LIDAR Scan"
        className="w-full h-full object-cover opacity-50"
        style={{ filter: 'hue-rotate(320deg) saturate(0.6) brightness(0.8)' }}
      />
      
      {/* Distance markers */}
      <div className="absolute inset-0 flex items-end justify-around px-4 pb-2 pointer-events-none">
        {[0, 90, 180, 270, 360].map((angle) => (
          <span key={angle} className="text-[10px] font-mono text-red-300/40">
            {angle}°
          </span>
        ))}
      </div>
    </div>
  );
}
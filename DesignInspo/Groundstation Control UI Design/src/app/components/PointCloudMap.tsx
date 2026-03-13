interface Waypoint {
  id: number;
  x: number;
  y: number;
  reached: boolean;
}

interface PointCloudMapProps {
  waypoints: Waypoint[];
  currentPosition: { x: number; y: number };
}

export function PointCloudMap({ waypoints, currentPosition }: PointCloudMapProps) {
  return (
    <div className="relative border border-red-950/50 bg-black/60 overflow-hidden" style={{ height: '380px' }}>
      {/* Background LIDAR point cloud */}
      <img 
        src="https://images.unsplash.com/photo-1748723594319-142e211b46a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWRhciUyMHBvaW50JTIwY2xvdWQlMjB0b3Bkb3duJTIwc2NhbnxlbnwxfHx8fDE3NzMyNDMzNTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        alt="Point Cloud Map"
        className="w-full h-full object-cover opacity-40"
        style={{ filter: 'hue-rotate(320deg) saturate(0.7)' }}
      />
      
      {/* Overlay with waypoints */}
      <div className="absolute inset-0">
        <svg className="w-full h-full">
          {/* Draw path lines between waypoints */}
          {waypoints.map((waypoint, index) => {
            if (index < waypoints.length - 1) {
              const nextWaypoint = waypoints[index + 1];
              return (
                <line
                  key={`line-${waypoint.id}`}
                  x1={`${waypoint.x}%`}
                  y1={`${waypoint.y}%`}
                  x2={`${nextWaypoint.x}%`}
                  y2={`${nextWaypoint.y}%`}
                  stroke="rgba(239, 68, 68, 0.3)"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
              );
            }
            return null;
          })}
          
          {/* Draw waypoints */}
          {waypoints.map((waypoint) => (
            <g key={waypoint.id}>
              <circle
                cx={`${waypoint.x}%`}
                cy={`${waypoint.y}%`}
                r="4"
                fill={waypoint.reached ? 'rgba(16, 185, 129, 0.8)' : 'rgba(239, 68, 68, 0.6)'}
                stroke={waypoint.reached ? 'rgba(16, 185, 129, 1)' : 'rgba(239, 68, 68, 0.9)'}
                strokeWidth="1"
              />
              <text
                x={`${waypoint.x}%`}
                y={`${waypoint.y}%`}
                dy="-8"
                fill="rgba(254, 202, 202, 0.8)"
                fontSize="10"
                textAnchor="middle"
                className="font-mono"
              >
                WP{waypoint.id}
              </text>
            </g>
          ))}
          
          {/* Current vehicle position */}
          <g>
            <circle
              cx={`${currentPosition.x}%`}
              cy={`${currentPosition.y}%`}
              r="6"
              fill="rgba(16, 185, 129, 0.3)"
            />
            <circle
              cx={`${currentPosition.x}%`}
              cy={`${currentPosition.y}%`}
              r="3"
              fill="rgba(16, 185, 129, 1)"
              className="animate-pulse"
            />
          </g>
        </svg>
      </div>
      
      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none" 
           style={{
             backgroundImage: 'linear-gradient(rgba(127, 29, 29, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(127, 29, 29, 0.1) 1px, transparent 1px)',
             backgroundSize: '50px 50px'
           }} 
      />
    </div>
  );
}

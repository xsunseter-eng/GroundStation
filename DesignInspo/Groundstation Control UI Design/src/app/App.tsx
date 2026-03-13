import { useState, useEffect } from 'react';
import { TelemetryCard } from './components/TelemetryCard';
import { StatusIndicator } from './components/StatusIndicator';
import { VehicleStatus } from './components/VehicleStatus';
import { PointCloudMap } from './components/PointCloudMap';
import { LidarScan360 } from './components/LidarScan360';
import { Activity, Navigation, Battery, Zap } from 'lucide-react';

export default function App() {
  const [telemetry, setTelemetry] = useState({
    engineTemp1: 72,
    engineTemp2: 68,
    batteryVoltage: 24.8,
    batteryCurrent: 12.3,
    latitude: 59.9139,
    longitude: 10.7522,
    heading: 245,
    speed: 5.2,
  });

  const [waypoints] = useState([
    { id: 1, x: 20, y: 80, reached: true },
    { id: 2, x: 35, y: 60, reached: true },
    { id: 3, x: 45, y: 45, reached: true },
    { id: 4, x: 60, y: 35, reached: true },
    { id: 5, x: 70, y: 50, reached: false },
    { id: 6, x: 80, y: 30, reached: false },
  ]);

  const [currentPosition] = useState({ x: 62, y: 38 });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        engineTemp1: prev.engineTemp1 + (Math.random() - 0.5) * 2,
        engineTemp2: prev.engineTemp2 + (Math.random() - 0.5) * 2,
        batteryVoltage: prev.batteryVoltage + (Math.random() - 0.5) * 0.2,
        batteryCurrent: prev.batteryCurrent + (Math.random() - 0.5) * 1,
        latitude: prev.latitude + (Math.random() - 0.5) * 0.0001,
        longitude: prev.longitude + (Math.random() - 0.5) * 0.0001,
        heading: (prev.heading + (Math.random() - 0.5) * 2 + 360) % 360,
        speed: Math.max(0, prev.speed + (Math.random() - 0.5) * 0.3),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getEngineStatus = (temp: number) => {
    if (temp > 85) return 'critical';
    if (temp > 75) return 'warning';
    return 'normal';
  };

  return (
    <div className="size-full bg-neutral-950 text-red-100/90 p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-red-950/50">
        <div>
          <h1 className="text-2xl font-mono tracking-tight text-red-400">GROUNDSTATION</h1>
          <p className="text-sm text-red-400/50 mt-1">Autonomous Sea Vehicle Control</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Activity className="w-4 h-4 text-emerald-500" />
          <span className="text-red-300/70">CONNECTED</span>
          <span className="text-red-950/50">|</span>
          <span className="text-red-300/70 font-mono">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Panel - Telemetry */}
        <div className="col-span-3 space-y-6">
          {/* Engine Temperatures */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-red-400/60" />
              <h2 className="text-sm text-red-400/60 uppercase tracking-wider">Engine Systems</h2>
            </div>
            <div className="h-px bg-red-950/50 mb-3" />
            <div className="space-y-2">
              <TelemetryCard 
                label="Engine 1 Temp" 
                value={telemetry.engineTemp1.toFixed(1)} 
                unit="°C"
                status={getEngineStatus(telemetry.engineTemp1)}
              />
              <TelemetryCard 
                label="Engine 2 Temp" 
                value={telemetry.engineTemp2.toFixed(1)} 
                unit="°C"
                status={getEngineStatus(telemetry.engineTemp2)}
              />
            </div>
          </div>

          {/* Battery Systems */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Battery className="w-4 h-4 text-red-400/60" />
              <h2 className="text-sm text-red-400/60 uppercase tracking-wider">Power Systems</h2>
            </div>
            <div className="h-px bg-red-950/50 mb-3" />
            <div className="space-y-2">
              <TelemetryCard 
                label="Battery Voltage" 
                value={telemetry.batteryVoltage.toFixed(2)} 
                unit="V"
              />
              <TelemetryCard 
                label="Current Draw" 
                value={telemetry.batteryCurrent.toFixed(2)} 
                unit="A"
              />
              <TelemetryCard 
                label="Power" 
                value={(telemetry.batteryVoltage * telemetry.batteryCurrent).toFixed(0)} 
                unit="W"
              />
            </div>
          </div>

          {/* System Status */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-red-400/60" />
              <h2 className="text-sm text-red-400/60 uppercase tracking-wider">System Status</h2>
            </div>
            <div className="h-px bg-red-950/50 mb-3" />
            <div className="space-y-2">
              <StatusIndicator label="GPS Lock" active={true} />
              <StatusIndicator label="Autopilot" active={true} />
              <StatusIndicator label="Communications" active={true} />
              <StatusIndicator label="Navigation" active={true} />
            </div>
          </div>
        </div>

        {/* Center Panel - LIDAR Views */}
        <div className="col-span-6">
          {/* Point Cloud Map */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Navigation className="w-4 h-4 text-red-400/60" />
              <h2 className="text-sm text-red-400/60 uppercase tracking-wider">Point Cloud Map</h2>
            </div>
            <div className="h-px bg-red-950/50 mb-3" />
            <PointCloudMap waypoints={waypoints} currentPosition={currentPosition} />
          </div>

          {/* 360° LIDAR Scan */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-red-400/60" />
              <h2 className="text-sm text-red-400/60 uppercase tracking-wider">360° LIDAR Scan</h2>
            </div>
            <div className="h-px bg-red-950/50 mb-3" />
            <LidarScan360 />
          </div>
        </div>

        {/* Right Panel - Navigation Data */}
        <div className="col-span-3 space-y-6">
          {/* Vehicle Position */}
          <div className="p-4 border border-red-950/50 bg-black/40">
            <VehicleStatus 
              latitude={telemetry.latitude}
              longitude={telemetry.longitude}
              heading={Math.round(telemetry.heading)}
              speed={telemetry.speed}
            />
          </div>

          {/* Mission Data */}
          <div>
            <div className="text-xs text-red-400/60 uppercase tracking-wider mb-3">Mission Data</div>
            <div className="h-px bg-red-950/50 mb-3" />
            <div className="space-y-2">
              <TelemetryCard 
                label="Distance Traveled" 
                value="32.4" 
                unit="km"
              />
              <TelemetryCard 
                label="Mission Time" 
                value="2:47" 
                unit="hrs"
              />
              <TelemetryCard 
                label="Waypoint" 
                value="5/12" 
              />
            </div>
          </div>

          {/* Environmental */}
          <div>
            <div className="text-xs text-red-400/60 uppercase tracking-wider mb-3">Environment</div>
            <div className="h-px bg-red-950/50 mb-3" />
            <div className="space-y-2">
              <TelemetryCard 
                label="Water Temp" 
                value="14.2" 
                unit="°C"
              />
              <TelemetryCard 
                label="Depth" 
                value="2.8" 
                unit="m"
              />
              <TelemetryCard 
                label="Wave Height" 
                value="0.6" 
                unit="m"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
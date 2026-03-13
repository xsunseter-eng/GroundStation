import { useState, useEffect } from 'react';

interface VehicleStatusProps {
  latitude: number;
  longitude: number;
  heading: number;
  speed: number;
}

export function VehicleStatus({ latitude, longitude, heading, speed }: VehicleStatusProps) {
  return (
    <div className="space-y-2">
      <div className="text-xs text-red-400/60 uppercase tracking-wider mb-3">Vehicle Status</div>
      <div className="grid grid-cols-2 gap-2 text-sm font-mono">
        <div>
          <span className="text-red-400/60">LAT:</span>
          <span className="text-red-100/90 ml-2">{latitude.toFixed(6)}°</span>
        </div>
        <div>
          <span className="text-red-400/60">LON:</span>
          <span className="text-red-100/90 ml-2">{longitude.toFixed(6)}°</span>
        </div>
        <div>
          <span className="text-red-400/60">HDG:</span>
          <span className="text-red-100/90 ml-2">{heading}°</span>
        </div>
        <div>
          <span className="text-red-400/60">SPD:</span>
          <span className="text-red-100/90 ml-2">{speed} kn</span>
        </div>
      </div>
    </div>
  );
}
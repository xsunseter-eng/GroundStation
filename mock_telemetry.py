import socket
import json
import time
import math
import random

HOST = '127.0.0.1'
PORT = 4242

def generate_mock_telemetry(t):
    """Generates mock telemetry data based on an elapsed time t (seconds)."""
    # Simple sine wave based GPS simulation around a base coordinate
    base_lat = 48.31
    base_lon = -125.10
    
    lat = base_lat + math.sin(t / 10.0) * 0.01
    lon = base_lon + math.cos(t / 10.0) * 0.01

    # Battery draining over time
    battery_v = max(20.0, 25.2 - (t / 100.0))
    # Fluctuating current
    current_a = 10.0 + random.uniform(-2.0, 5.0)
    capacity_pct = max(0, min(100, int((battery_v - 20.0) / (25.2 - 20.0) * 100)))

    return {
        "timestamp": time.time(),
        "gnss": {
            "lat": lat,
            "lon": lon,
            "heading": (t * 5) % 360,
            "speed_kn": random.uniform(4.0, 6.0)
        },
        "power": {
            "voltage_v": round(battery_v, 2),
            "current_a": round(current_a, 2),
            "capacity_pct": capacity_pct,
            "power_w": round(battery_v * current_a, 2)
        },
        "engines": {
            "temp_1_c": round(65.0 + math.sin(t / 5.0) * 10, 1),
            "temp_2_c": round(62.0 + math.sin(t / 6.0) * 8, 1)
        },
        "mission": {
            "distance_m": round(t * 2.5, 1),
            "current_wp": 2,
            "total_wp": 12,
            "range_est_km": round((capacity_pct / 100.0) * 50.0, 1)
        },
        "environment": {
            "water_temp_c": 14.2,
            "depth_m": round(110.0 + random.uniform(-5.0, 5.0), 1),
            "wave_height_m": 0.6
        }
    }

def main():
    print(f"Starting mock telemetry generator. Connecting to {HOST}:{PORT}...")
    
    # We will use a TCP socket.
    while True:
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.connect((HOST, PORT))
                print("Connected to Ground Station daemon!")
                
                t = 0
                while True:
                    data_obj = generate_mock_telemetry(t)
                    # Payload must be newline terminated for easy framing
                    payload = json.dumps(data_obj) + "\n"
                    s.sendall(payload.encode('utf-8'))
                    
                    time.sleep(0.5) # 2 Hz update rate
                    t += 0.5
        except ConnectionRefusedError:
            print("Connection refused. Make sure the Rust daemon is running. Retrying in 2 seconds...")
            time.sleep(2)
        except Exception as e:
            print(f"Connection error: {e}. Reconnecting...")
            time.sleep(2)

if __name__ == "__main__":
    main()

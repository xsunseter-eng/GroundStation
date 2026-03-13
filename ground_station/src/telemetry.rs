use serde::{Deserialize, Serialize};
use tokio::io::AsyncBufReadExt;
use tokio::net::TcpListener;
use tokio::sync::mpsc;
use tokio::io::BufReader;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GnssData {
    pub lat: f64,
    pub lon: f64,
    pub heading: f64,
    pub speed_kn: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PowerData {
    pub voltage_v: f64,
    pub current_a: f64,
    pub capacity_pct: u8,
    pub power_w: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EngineData {
    pub temp_1_c: f64,
    pub temp_2_c: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MissionData {
    pub distance_m: f64,
    pub current_wp: u32,
    pub total_wp: u32,
    pub range_est_km: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EnvironmentData {
    pub water_temp_c: f64,
    pub depth_m: f64,
    pub wave_height_m: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TelemetryPayload {
    pub timestamp: f64,
    pub gnss: GnssData,
    pub power: PowerData,
    pub engines: EngineData,
    pub mission: MissionData,
    pub environment: EnvironmentData,
}

/// Starts a TCP server on 127.0.0.1:4242 to receive telemetry.
/// It sends parsed TelemetryPayload objects across the provided channel.
pub async fn start_telemetry_listener(tx: mpsc::UnboundedSender<TelemetryPayload>) {
    let addr = "127.0.0.1:4242";
    let listener = match TcpListener::bind(addr).await {
        Ok(l) => {
            log::info!("Telemetry daemon listening on {}", addr);
            l
        }
        Err(e) => {
            log::error!("Failed to bind telemetry listener to {}: {}", addr, e);
            return;
        }
    };

    loop {
        match listener.accept().await {
            Ok((socket, addr)) => {
                log::info!("New telemetry connection from {}", addr);
                let tx_clone = tx.clone();
                tokio::spawn(async move {
                    let mut reader = BufReader::new(socket);
                    let mut line = String::new();
                    
                    loop {
                        line.clear();
                        match reader.read_line(&mut line).await {
                            Ok(0) => {
                                log::info!("Telemetry connection closed.");
                                break;
                            }
                            Ok(_) => {
                                match serde_json::from_str::<TelemetryPayload>(&line) {
                                    Ok(payload) => {
                                        if let Err(_) = tx_clone.send(payload) {
                                            log::warn!("Failed to send telemetry payload to app channel");
                                            break;
                                        }
                                    }
                                    Err(e) => {
                                        log::warn!("Failed to parse telemetry JSON: {:?}", e);
                                    }
                                }
                            }
                            Err(e) => {
                                log::error!("Error reading telemetry TCP stream: {:?}", e);
                                break;
                            }
                        }
                    }
                });
            }
            Err(e) => {
                log::error!("Error accepting connection: {:?}", e);
            }
        }
    }
}

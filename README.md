# Ground Station: TEKNOFEST 2026 Autonomous Naval Vehicle (İDA)

This repository contains the source code, technical reports, and design assets for the **Antigravity Ground Station**, a Linux-native control system developed for the **TEKNOFEST 2026 Unmanned Naval Vehicle Competition**.

## 🚀 Overview
The system is built with **Rust** and uses the **libcosmic** toolkit (System76) to provide a high-performance, aesthetically modern, and stable interface for managing autonomous naval operations.

### Key Features
- **Real-Time Telemetry:** Visualization of GPS, IMU, and sensor data from the naval platform.
- **Autonomous Mission Control:** Interface for defining waypoints, monitoring path planning, and overriding autonomous behavior.
- **UAV-USV Coordination:** Logic for processing targets detected by unmanned aerial vehicles (UAV) and guiding the USV accordingly.
- **Decision Making:** Integration of COLREG-compliant navigation and obstacle avoidance algorithms.

## 🛠 Tech Stack
- **UI Framework:** `libcosmic` (based on `iced.rs`)
- **Backend Language:** Rust (Edition 2024)
- **Async Runtime:** `tokio`
- **Data Serialization:** `serde`, `serde_json`, `serde_yaml`
- **Simulation/Testing:** Python scripts for telemetry mocking and Gazebo/VRX integration logic.

## 📥 Download & Setup

### Prerequisites
- **Rust (latest stable):** [Install Rust](https://rustup.rs/)
- **Cosmic Environment:** Optimized for Linux distros supporting `libcosmic`.

### Installation
1. Clone the repository:
   ```bash
   git clone <REPO_LINK>
   cd GroundStation
   ```
2. Build the project:
   ```bash
   cd ground_station
   cargo build --release
   ```
3. Run the application:
   ```bash
   ./target/release/ground_station
   ```

## 📄 Documentation
- Detailed technical specifications can be found in `techstack.md` and `Context.md`.
- A comprehensive project report is available in the `Report/` directory.

---
Developed by **Antigravity Team** for TEKNOFEST 2026.

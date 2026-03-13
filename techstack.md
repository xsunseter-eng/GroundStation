---
name: Cosmic Rust Development
description: Guidelines and tech stack details for building native Linux applications using Rust and libcosmic (iced.rs).
---
# Cosmic Rust Development Skill
This skill outlines the tech stack, architecture, and best practices for developing desktop applications using Rust and the `libcosmic` GUI toolkit. 
## Technology Stack
- **Core Language:** Rust (edition 2021)
- **GUI Framework:** `libcosmic` (System76's toolkit built on top of `iced.rs`)
  - Features: `["winit", "tokio", "multi-window"]`
- **Data Persistence:** `serde` and `serde_yaml` for reading/writing configuration and data files locally.
- **Path Management:** `dirs` crate for cross-platform data/config directory resolution (e.g., `dirs::config_dir()`, `dirs::document_dir()`).
- **Date/Time:** `chrono` for date handling and deadline calculations.
- **Logging:** `env_logger` for internal debug logs (`RUST_LOG=warn`).
## Architecture Details
1. **Elm Architecture Structure:**
   - Applications are built around a state `struct App { ... }` that implements `cosmic::Application`.
   - `Message` enum defines every possible user interaction and state transition.
   - `init()` function initializes the state and loads data from standard directories.
   - `update(&mut self, message: Self::Message)` processes actions, mutates state, and returns `cosmic::app::Task<Self::Message>`.
   - `view(&self) -> Element<'_, Self::Message>` is a pure function returning the UI layout describing the current state.
2. **Styling & Components:**
   - Built-in `cosmic::widget` components are heavily utilized (`row`, `column`, `container`, `button`, `text`, `scrollable`, `dropdown`).
   - Use `cosmic::theme::spacing()` for consistent paddings and gaps.
   - Icons are loaded via `widget::icon::from_name("icon-name-symbolic")`.
   - Containers use `class(cosmic::style::Container::Card)` or `List` to mimic OS-native aesthetic panels.
3. **Application State & Data Management:**
   - Data logic is usually abstracted into a separate module (e.g., `src/data.rs`), providing structs and methods for heavy lifting (JSON/YAML parsing, complex calculations).
   - Use mutable bindings `&mut self` and inner mutable references explicitly during `update` to modify state directly, then trigger an `auto_save` or discrete file write.
4. **Detached Launcher Configurations:**
   - Applications are compiled with `cargo build --release`.
   - They can be launched without holding an open terminal window by using shell aliases/functions containing detached `nohup` calls:
     ```bash
     nohup target/release/app_name > /dev/null 2>&1 & disown
     ```
   - Standard `/home/user/.local/share/applications/` (or specialized sub-folders) handle `.desktop` integrations.

mod telemetry;

use cosmic::app::{Core, Task};
use cosmic::widget::{column, container, row, text, space};
use cosmic::Element;
use cosmic::iced::Length;
use tokio::sync::mpsc;
use std::sync::{Arc, Mutex};
use telemetry::TelemetryPayload;

#[derive(Debug, Clone)]
pub enum Message {
    TelemetryReceived(TelemetryPayload),
    Tick,
}

pub struct App {
    core: Core,
    telemetry_data: Option<TelemetryPayload>,
    rx_channel: Arc<Mutex<Option<mpsc::UnboundedReceiver<TelemetryPayload>>>>,
}

impl cosmic::Application for App {
    type Executor = cosmic::executor::Default;
    type Flags = ();
    type Message = Message;
    const APP_ID: &'static str = "com.antigravity.groundstation";

    fn core(&self) -> &Core {
        &self.core
    }

    fn core_mut(&mut self) -> &mut Core {
        &mut self.core
    }

    fn init(core: Core, _flags: Self::Flags) -> (Self, Task<Self::Message>) {
        let (tx, rx) = mpsc::unbounded_channel();
        
        tokio::spawn(async move {
            telemetry::start_telemetry_listener(tx).await;
        });

        (
            App {
                core,
                telemetry_data: None,
                rx_channel: Arc::new(Mutex::new(Some(rx))),
            },
            Task::none()
        )
    }

    fn update(&mut self, message: Self::Message) -> Task<Self::Message> {
        match message {
            Message::TelemetryReceived(payload) => {
                self.telemetry_data = Some(payload);
                Task::none()
            }
            Message::Tick => {
                if let Ok(mut rx_guard) = self.rx_channel.try_lock() {
                    if let Some(rx) = rx_guard.as_mut() {
                        while let Ok(payload) = rx.try_recv() {
                            self.telemetry_data = Some(payload);
                        }
                    }
                }
                Task::none()
            }
        }
    }

    fn view(&self) -> Element<'_, Self::Message> {
        // Top Header
        let header = row()
            .push(
                column()
                    .push(text("GROUNDSTATION").size(24).class(cosmic::theme::Text::Custom(text_destructive)))
                    .push(text("Autonomous Sea Vehicle Control").size(14).class(cosmic::theme::Text::Custom(text_dim)))
            )
            .push(space().width(Length::Fill))
            .push(
                text(if self.telemetry_data.is_some() { "CONNECTED" } else { "DISCONNECTED" })
                    .class(if self.telemetry_data.is_some() { cosmic::theme::Text::Custom(text_success) } else { cosmic::theme::Text::Custom(text_destructive) })
            )
            .padding(16)
            .align_y(cosmic::iced::Alignment::Center);

        // Define column contents based on telemetry
        let (eng1, eng2, bat_v, bat_a, bat_p, lat, lon, hdg, spd, dist, wpc, wpt, wtr, dep, wv) = match &self.telemetry_data {
            Some(t) => (
                format!("{:.1} °C", t.engines.temp_1_c),
                format!("{:.1} °C", t.engines.temp_2_c),
                format!("{:.2} V", t.power.voltage_v),
                format!("{:.2} A", t.power.current_a),
                format!("{:.0} W", t.power.power_w),
                format!("{:.6}° N", t.gnss.lat),
                format!("{:.6}° W", t.gnss.lon.abs()), // Assuming W is negative
                format!("{:.0}°", t.gnss.heading),
                format!("{:.2} kn", t.gnss.speed_kn),
                format!("{:.1} km", t.mission.distance_m / 1000.0),
                format!("{}", t.mission.current_wp),
                format!("{}", t.mission.total_wp),
                format!("{:.1} °C", t.environment.water_temp_c),
                format!("{:.1} m", t.environment.depth_m),
                format!("{:.1} m", t.environment.wave_height_m),
            ),
            None => (
                "--- °C".to_string(), "--- °C".to_string(),
                "--- V".to_string(), "--- A".to_string(), "--- W".to_string(),
                "---".to_string(), "---".to_string(), "---".to_string(), "---".to_string(),
                "---".to_string(), "-".to_string(), "-".to_string(),
                "--- °C".to_string(), "---".to_string(), "---".to_string(),
            )
        };

        // Left Panel (Engine & Power)
        let left_panel = column()
            .push(text("ENGINE SYSTEMS").class(cosmic::theme::Text::Custom(text_dim)))
            .push(card_value("ENGINE 1 TEMP", eng1, true))
            .push(card_value("ENGINE 2 TEMP", eng2, true))
            .push(space().height(Length::Fixed(20.0)))
            .push(text("POWER SYSTEMS").class(cosmic::theme::Text::Custom(text_dim)))
            .push(card_value("BATTERY VOLTAGE", bat_v, true))
            .push(card_value("CURRENT DRAW", bat_a, true))
            .push(card_value("POWER", bat_p, true))
            .push(space().height(Length::Fixed(20.0)))
            .push(text("SYSTEM STATUS").class(cosmic::theme::Text::Custom(text_dim)))
            .push(card_value("GPS LOCK", "ACTIVE", true))
            .push(card_value("AUTOPILOT", "ENGAGED", true))
            .push(card_value("COMMUNICATIONS", "NOMINAL", true))
            .spacing(10)
            .width(Length::Fixed(250.0));

        // Center Panel (Map & Lidar Placeholders)
        let center_panel = column()
            .push(text("POINT CLOUD MAP").class(cosmic::theme::Text::Custom(text_dim)))
            .push(container(text("[ MAP RENDER AREA ]"))
                .width(Length::Fill)
                .height(Length::FillPortion(2))
                .align_x(cosmic::iced::alignment::Horizontal::Center)
                .align_y(cosmic::iced::alignment::Vertical::Center)
                .class(cosmic::theme::Container::Card))
            .push(space().height(Length::Fixed(20.0)))
            .push(text("360° LIDAR SCAN").class(cosmic::theme::Text::Custom(text_dim)))
            .push(container(text("[ LIDAR RENDER AREA ]"))
                .width(Length::Fill)
                .height(Length::FillPortion(1))
                .align_x(cosmic::iced::alignment::Horizontal::Center)
                .align_y(cosmic::iced::alignment::Vertical::Center)
                .class(cosmic::theme::Container::Card))
            .spacing(10)
            .width(Length::Fill);

        // Right Panel (Mission & Env)
        let right_panel = column()
            .push(text("VEHICLE STATUS").class(cosmic::theme::Text::Custom(text_dim)))
            .push(
                container(
                    column()
                        .push(row().push(text("LAT: ").class(cosmic::theme::Text::Custom(text_dim))).push(text(lat)).spacing(5))
                        .push(row().push(text("LON: ").class(cosmic::theme::Text::Custom(text_dim))).push(text(lon)).spacing(5))
                        .push(row().push(text("HDG: ").class(cosmic::theme::Text::Custom(text_dim))).push(text(hdg)).spacing(5))
                        .push(row().push(text("SPD: ").class(cosmic::theme::Text::Custom(text_dim))).push(text(spd)).spacing(5))
                        .spacing(5)
                ).class(cosmic::theme::Container::Card).padding(10).width(Length::Fill)
            )
            .push(space().height(Length::Fixed(20.0)))
            .push(text("MISSION DATA").class(cosmic::theme::Text::Custom(text_dim)))
            .push(card_value("DISTANCE TRAVELED", dist, true))
            .push(card_value("WAYPOINT", format!("{}/{}", wpc, wpt), true))
            .push(space().height(Length::Fixed(20.0)))
            .push(text("ENVIRONMENT").class(cosmic::theme::Text::Custom(text_dim)))
            .push(card_value("WATER TEMP", wtr, true))
            .push(card_value("DEPTH", dep, true))
            .push(card_value("WAVE HEIGHT", wv, true))
            .spacing(10)
            .width(Length::Fixed(250.0));

        let main_content = row()
            .push(left_panel)
            .push(center_panel)
            .push(right_panel)
            .spacing(20)
            .padding(20)
            .height(Length::Fill);

        column()
            .push(header)
            .push(main_content)
            .into()
    }

    fn subscription(&self) -> cosmic::iced::Subscription<Self::Message> {
        cosmic::iced::time::every(std::time::Duration::from_millis(500))
            .map(|_| Message::Tick)
    }
}

// Custom text styling functions for libcosmic Text::Custom
fn text_destructive(theme: &cosmic::Theme) -> cosmic::iced_widget::text::Style {
    cosmic::iced_widget::text::Style { color: Some(theme.cosmic().destructive.base.into()) }
}

fn text_success(theme: &cosmic::Theme) -> cosmic::iced_widget::text::Style {
    cosmic::iced_widget::text::Style { color: Some(theme.cosmic().success.base.into()) }
}

fn text_dim(theme: &cosmic::Theme) -> cosmic::iced_widget::text::Style {
    cosmic::iced_widget::text::Style { color: Some(theme.cosmic().palette.neutral_5.into()) }
}

// Helper function to build a standardized labeled card
fn card_value<'a>(label: &'a str, val: impl Into<std::borrow::Cow<'a, str>> + 'a, success: bool) -> cosmic::Element<'a, Message> {
    container(
        column()
            .push(text(label).size(12).class(cosmic::theme::Text::Custom(text_dim)))
            .push(text(val).size(24).class(if success { cosmic::theme::Text::Custom(text_success) } else { cosmic::theme::Text::Custom(text_destructive) }))
            .spacing(5)
    )
    .class(cosmic::theme::Container::Card)
    .padding(10)
    .width(Length::Fill)
    .into()
}

pub fn main() -> cosmic::iced::Result {
    env_logger::init();
    // Force dark theme as per requirements
    // Set some window defaults for testing
    let settings = cosmic::app::Settings::default()
        .size(cosmic::iced::Size::new(1280.0, 720.0));
    
    cosmic::app::run::<App>(settings, ())
}

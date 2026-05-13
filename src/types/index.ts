/* Type Declarations */

export type DeviceType = "light" | "fan" | "temperature" | "humidity" | "door" | "motion";

export interface Device {
    id: string;
    name: string;
    type: DeviceType;
    status: boolean;
    value?: number;
}

export interface ApiEnvelope<T> {
    status: "success" | "error";
    message: string;
    data: T;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
}

export interface MeResponse {
    id: string;
    email: string;
    name: string;
}

export interface DashboardResponse {
    devices: Device[];
    automations: Automation[];
    notifications: Notification[];
}

export interface AllDevicesResponse {
    devices: Device[];
}

export interface DeviceStatusResponse {
    id: string;
    status: boolean;
    value?: number;
    updatedAt: string;
}

export interface SendDeviceCommandRequest {
    deviceId: string;
    command: string;
    value?: number | string;
}

export interface UpdateDeviceModeRequest {
    deviceId: string;
    mode: string;
}

export interface UpdateFanThresholdRequest {
    deviceId: string;
    threshold: number;
}

export interface UpdateLedThresholdRequest {
    deviceId: string;
    threshold: number;
}

export interface Automation {
    id: string;
    name: string;
    enabled: boolean;
    trigger: string;
    action: string;
}

export interface AutomationConfigResponse {
    automations: Automation[];
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: "info" | "warning" | "error" | "success";
    timestamp: string;
    read: boolean;
}
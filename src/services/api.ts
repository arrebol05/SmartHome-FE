import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// ==================== TYPES ====================
// Response wrapper từ BE
export interface ApiResponse<T = unknown> {
    statusCode: number;
    message: string;
    data?: T;
}

export interface ErrorResponse {
    statusCode: number;
    message: string;
    data?: null;
}

// ==================== AUTH TYPES ====================
export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string; // "Bearer"
    expiresAt: string; // ISO datetime
    refreshExpiresAt: string;
    username: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface MeResponse {
    id: string;
    username: string;
    enabled: boolean;
}

// ==================== DEVICE TYPES ====================
export type DeviceType = 'LED' | 'FAN';
export type DeviceMode = 'MANUAL' | 'AUTO';
export type DeviceState = 'ON' | 'OFF';
export type CommandSource = 'MANUAL_USER' | 'AUTOMATION';

export interface DeviceStatusResponse {
    deviceType: DeviceType;
    mode: DeviceMode;
    state: DeviceState;
    lastCommandPayload: string;
    lastCommandSource: CommandSource;
    lastCommandReason: string;
    lastCommandAt: string; // ISO datetime
    updatedAt: string;
}

export interface DeviceCommandRequest {
    state: DeviceState;
    reason?: string;
}

export interface DeviceModeRequest {
    mode: DeviceMode;
}

// ==================== SENSOR TYPES ====================
export type SensorType = 'TEMP' | 'HUMI' | 'LIGHT' | 'PIR';

export interface SensorLatestResponse {
    sensorType: SensorType;
    value: number;
    receivedAt: string; // ISO datetime
}

// ==================== AUTOMATION TYPES ====================
export interface AutomationConfigResponse {
    fanLowTemp: number;
    fanHighTemp: number;
    ledOnThreshold: number;
    ledOffThreshold: number;
    pirAlertCooldownSeconds: number;
}

export interface UpdateFanThresholdRequest {
    lowTemp: number;
    highTemp: number;
}

// ==================== DASHBOARD TYPES ====================
export interface DashboardResponse {
    temp: SensorLatestResponse;
    humi: SensorLatestResponse;
    light: SensorLatestResponse;
    pir: SensorLatestResponse;
    led: DeviceStatusResponse;
    fan: DeviceStatusResponse;
    automationConfig: AutomationConfigResponse;
}

export interface TestSensorRequest {
    sensorType: SensorType;
    value: number;
}

// ==================== API CONFIG ====================
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

// ==================== STORAGE KEYS ====================
const STORAGE_KEYS = {
    ACCESS_TOKEN: 'smartHome_accessToken',
    REFRESH_TOKEN: 'smartHome_refreshToken',
    TOKEN_EXPIRES_AT: 'smartHome_tokenExpiresAt',
};

// ==================== AXIOS INSTANCE ====================
const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    isRefreshing = false;
    failedQueue = [];
};

// ==================== INTERCEPTORS ====================
// Request Interceptor - Thêm token vào header
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response Interceptor - Xử lý 401 và refresh token
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        // Nếu gặp 401 và chưa retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Nếu đang refresh, thêm request vào queue
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (token) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            return api(originalRequest);
                        }
                        return Promise.reject(error);
                    })
                    .catch(() => {
                        redirectToLogin();
                        return Promise.reject(error);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
                if (!refreshToken) {
                    redirectToLogin();
                    return Promise.reject(error);
                }

                const response = await axios.post<ApiResponse<LoginResponse>>(
                    `${API_BASE_URL}/auth/refresh`,
                    { refreshToken }
                );

                const { accessToken, refreshToken: newRefreshToken, expiresAt } =
                    response.data.data!;

                // Lưu token mới
                setAuthTokens(accessToken, newRefreshToken, expiresAt);

                // Retry request gốc
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                processQueue(null, accessToken);

                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                redirectToLogin();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// ==================== AUTH APIs ====================
export const authApi = {
    login: (credentials: LoginRequest) =>
        api.post<ApiResponse<LoginResponse>>('/auth/login', credentials),

    refreshToken: (refreshToken: string) =>
        api.post<ApiResponse<LoginResponse>>('/auth/refresh', { refreshToken }),

    getMe: () => api.get<ApiResponse<MeResponse>>('/auth/me'),

    logout: () => api.post<ApiResponse>('/auth/logout'),
};

// ==================== DASHBOARD APIs ====================
export const dashboardApi = {
    // Snapshot của dashboard hiện tại
    getSnapshot: () => api.get<ApiResponse<DashboardResponse>>('/dashboard'),

    // Realtime stream sử dụng SSE
    subscribeStream: () => {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const url = token
            ? `${API_BASE_URL}/dashboard/stream?token=${encodeURIComponent(token)}`
            : `${API_BASE_URL}/dashboard/stream`;
        return new EventSource(url);
    },
};

// ==================== DEVICE APIs ====================
export const deviceApi = {
    // Lấy trạng thái thiết bị theo loại
    getStatus: (deviceType: DeviceType) =>
        api.get<ApiResponse<DeviceStatusResponse>>(`/devices/${deviceType}`),

    // Lấy trạng thái LED
    getLedStatus: () => deviceApi.getStatus('LED'),

    // Lấy trạng thái FAN
    getFanStatus: () => deviceApi.getStatus('FAN'),

    // Đổi mode thiết bị (MANUAL/AUTO)
    changeMode: (deviceType: DeviceType, mode: DeviceMode) =>
        api.put<ApiResponse<DeviceStatusResponse>>(`/devices/${deviceType}/mode`, {
            mode,
        }),

    // Gửi lệnh tay (bật/tắt)
    sendCommand: (
        deviceType: DeviceType,
        state: DeviceState,
        reason?: string
    ) =>
        api.post<ApiResponse<DeviceStatusResponse>>(
            `/devices/${deviceType}/command`,
            { state, reason }
        ),

    // Helper methods
    toggleLed: (state: DeviceState, reason?: string) =>
        deviceApi.sendCommand('LED', state, reason),

    toggleFan: (state: DeviceState, reason?: string) =>
        deviceApi.sendCommand('FAN', state, reason),

    setLedMode: (mode: DeviceMode) => deviceApi.changeMode('LED', mode),

    setFanMode: (mode: DeviceMode) => deviceApi.changeMode('FAN', mode),
};

// ==================== AUTOMATION APIs ====================
export const automationApi = {
    // Lấy configuration automation hiện tại
    getConfig: () =>
        api.get<ApiResponse<AutomationConfigResponse>>('/automation/config'),

    // Cập nhật ngưỡng nhiệt độ cho FAN
    updateFanThreshold: (lowTemp: number, highTemp: number) =>
        api.put<ApiResponse<AutomationConfigResponse>>(
            '/automation/fan-threshold',
            { lowTemp, highTemp }
        ),
};

// ==================== SENSOR TEST APIs ====================
export const testSensorApi = {
    // Gửi dữ liệu sensor fake để test realtime
    ingestData: (sensorType: SensorType, value: number) =>
        api.post<ApiResponse>('/test/sensors/ingest', { sensorType, value }),
};

// ==================== ERROR HANDLER ====================
export const handleApiError = (error: unknown): ErrorResponse => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiResponse>;
        return {
            statusCode: axiosError.response?.status || 500,
            message: axiosError.response?.data?.message || axiosError.message,
            data: null,
        };
    }

    return {
        statusCode: 500,
        message: 'An unexpected error occurred',
        data: null,
    };
};

// ==================== UTILITY FUNCTIONS ====================
const redirectToLogin = () => {
    removeAuthTokens();
    window.location.href = '/login';
};

export const setAuthTokens = (
    accessToken: string,
    refreshToken: string,
    expiresAt: string
) => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRES_AT, expiresAt);
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
};

export const removeAuthTokens = () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRES_AT);
    delete api.defaults.headers.common['Authorization'];
};

export const getAccessToken = (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

export const getRefreshToken = (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
};

export const getTokenExpiresAt = (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRES_AT);
};

export const isTokenValid = (): boolean => {
    const token = getAccessToken();
    const expiresAt = getTokenExpiresAt();

    if (!token || !expiresAt) return false;

    const now = new Date().getTime();
    const expirationTime = new Date(expiresAt).getTime();

    // Coi token hết hạn nếu còn dưới 1 phút
    return expirationTime - now > 60000;
};

export default api;

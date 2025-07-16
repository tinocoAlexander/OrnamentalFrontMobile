/**
 * Posición del carrito en el mapa
 */
export interface CartPosition {
  x: number;
  y: number;
  timestamp: number;
}

/**
 * Lectura de sensores registrada
 */
export interface SensorData {
  _id: string;
  temperature: number;
  humidity: number;
  timestamp: string; // ISO date string
}

/**
 * Obstáculo detectado
 */
export interface Obstacle {
  position: CartPosition;
  severity: 'low' | 'medium' | 'high';
  timestamp: string; // ISO date string
}

/**
 * Datos de una sesión de trabajo
 */
export interface Session {
  _id: string;
  startTime: string; // ISO date string
  endTime?: string;  // ISO date string
  status: 'mapping' | 'cutting' | 'completed' | 'interrupted';
  mappingPath: CartPosition[];
  cuttingPath: CartPosition[];
  areaCovered: number;
  obstacles: Obstacle[];
  averageTemperature: number;
  averageHumidity: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Notificación en la app
 */
export interface Notification {
  id: string;
  type: 'obstacle' | 'session_complete' | 'error' | 'connection';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  dismissed: boolean;
  priority: 'low' | 'medium' | 'high';
}

/**
 * Conexión Wi-Fi simulada
 */
export interface WiFiConnection {
  connected: boolean;
  ssid: string;
}

/**
 * Resumen del estado del sistema (opcional)
 */
export interface SystemDiagnostics {
  appVersion: string;
  lastSync: string; // ISO date string
  totalWorkingHours: number;
}

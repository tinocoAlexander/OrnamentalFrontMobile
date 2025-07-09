export interface CartPosition {
  x: number;
  y: number;
  timestamp: number;
}

export interface SensorData {
  temperature: number;
  humidity: number;
  batteryLevel: number;
  timestamp: number;
}

export interface SensorHealth {
  ultrasonic: 'conectado' | 'desconectado';
  gyroscope: 'conectado' | 'desconectado';
  accelerometer: 'conectado' | 'desconectado';
  dht11: 'conectado' | 'desconectado';
  lastChecked: number;
}

export interface ObstacleData {
  position: CartPosition;
  type: 'ultrasonido';
  severity: 'bajo' | 'medio' | 'alto';
  timestamp: number;
}

export interface WorkingSession {
  id: string;
  startTime: number;
  endTime?: number;
  mappingPath: CartPosition[];
  cuttingPath: CartPosition[];
  areaCovered: number; // in square meters
  obstacles: ObstacleData[];
  status: 'mapping' | 'cutting' | 'completed' | 'interrupted';
  sensorData: SensorData[];
  averageTemperature: number;
  averageHumidity: number;
  batteryUsed: number; // percentage
}

export interface NotificationData {
  id: string;
  type: 'obstacle' | 'low_battery' | 'maintenance' | 'session_complete' | 'error' | 'connection';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  dismissed: boolean;
}

export interface MaintenanceRecord {
  id: string;
  type: 'blade_replacement' | 'cleaning' | 'battery_check' | 'sensor_calibration' | 'general';
  lastPerformed: number;
  nextDue: number;
  hoursWorked: number;
  description: string;
}

export interface WiFiConnection {
  connected: boolean;
  signalStrength: number;
  ssid: string;
  ipAddress?: string;
  lastConnected?: number;
}

export interface SystemDiagnostics {
  appVersion: string;
  cartFirmwareVersion?: string;
  connectionStatus: WiFiConnection;
  sensorHealth: SensorHealth;
  lastSync: number;
  totalWorkingHours: number;
}
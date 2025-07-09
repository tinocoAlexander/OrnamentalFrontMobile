import { CartPosition, SensorData } from '@/types';

export function calculateArea(path: CartPosition[]): number {
  if (path.length < 3) return 0;
  
  // Using shoelace formula for polygon area
  let area = 0;
  for (let i = 0; i < path.length; i++) {
    const j = (i + 1) % path.length;
    area += path[i].x * path[j].y;
    area -= path[j].x * path[i].y;
  }
  return Math.abs(area) / 2;
}

export function calculateDistance(pos1: CartPosition, pos2: CartPosition): number {
  const dx = pos2.x - pos1.x;
  const dy = pos2.y - pos1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function calculateSessionDuration(startTime: number, endTime?: number): number {
  return Math.floor(((endTime || Date.now()) - startTime) / 1000 / 60); // in minutes
}

export function calculateCompletionPercentage(completedPath: CartPosition[], totalPath: CartPosition[]): number {
  if (totalPath.length === 0) return 0;
  return (completedPath.length / totalPath.length) * 100;
}

export function calculateAverageTemperature(sensorData: SensorData[]): number {
  if (sensorData.length === 0) return 0;
  return sensorData.reduce((sum, data) => sum + data.temperature, 0) / sensorData.length;
}

export function calculateAverageHumidity(sensorData: SensorData[]): number {
  if (sensorData.length === 0) return 0;
  return sensorData.reduce((sum, data) => sum + data.humidity, 0) / sensorData.length;
}

export function estimateRemainingTime(
  completedPath: CartPosition[],
  totalPath: CartPosition[],
  area: number
): number {
  const completionPercentage = calculateCompletionPercentage(completedPath, totalPath);
  const remainingPercentage = 100 - completionPercentage;
  
  // Estimate 3 minutes per square meter for cutting
  const totalEstimatedTime = area * 3 * 60 * 1000; // in milliseconds
  return (totalEstimatedTime * remainingPercentage) / 100;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

export function formatArea(area: number): string {
  if (area < 1000) {
    return `${area.toFixed(1)} m²`;
  }
  return `${(area / 1000).toFixed(2)} km²`;
}

export function formatTemperature(temp: number): string {
  return `${temp.toFixed(1)}°C`;
}

export function formatHumidity(humidity: number): string {
  return `${humidity.toFixed(1)}%`;
}

export function formatBattery(battery: number): string {
  return `${battery.toFixed(0)}%`;
}

export function getWorkingHours(sessions: any[]): number {
  return sessions.reduce((total, session) => {
    if (session.endTime) {
      return total + calculateSessionDuration(session.startTime, session.endTime);
    }
    return total;
  }, 0) / 60; // Convert to hours
}
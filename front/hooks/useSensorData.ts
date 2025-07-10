// Este es un hook personalizado para poder traer la lectura de los sensores
import { useState, useEffect } from 'react';
import { SensorData, SensorHealth } from '@/types';

export function useSensorData() {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [currentData, setCurrentData] = useState<SensorData | null>(null);
  const [sensorHealth, setSensorHealth] = useState<SensorHealth>({
    ultrasonic: 'conectado',
    gyroscope: 'conectado',
    accelerometer: 'conectado',
    dht11: 'conectado',
    lastChecked: Date.now(),
  });

  useEffect(() => {
    // TODO: Remplazar con llamada a API real
    const interval = setInterval(() => {
      const newData: SensorData = {
        temperature: 20 + Math.random() * 15,
        humidity: 40 + Math.random() * 30, 
        batteryLevel: Math.max(0, 100 - (Date.now() % 200000) / 2000), 
        timestamp: Date.now(),
      };

      setCurrentData(newData);
      setSensorData(prev => [...prev.slice(-200), newData]); 

      // Simula la salud de los sensores, si esta conectado o desconectado
      setSensorHealth(prev => ({
        ...prev,
        ultrasonic: Math.random() > 0.95 ? 'desconectado' : 'conectado',
        gyroscope: Math.random() > 0.98 ? 'desconectado' : 'conectado',
        accelerometer: Math.random() > 0.97 ? 'desconectado' : 'conectado',
        dht11: Math.random() > 0.96 ? 'desconectado' : 'conectado',
        lastChecked: Date.now(),
      }));
    }, 1200); // Se actualiza cada 2 minutos

    return () => clearInterval(interval);
  }, []);

  // Funciones para calcular promedios de temperatura y humedad en el rango de tiempo especificado
  const getAverageTemperature = (timeRange: number = 3600000): number => {
    const cutoff = Date.now() - timeRange;
    const recentData = sensorData.filter(data => data.timestamp > cutoff);
    if (recentData.length === 0) return 0;
    return recentData.reduce((sum, data) => sum + data.temperature, 0) / recentData.length;
  };

  const getAverageHumidity = (timeRange: number = 3600000): number => {
    const cutoff = Date.now() - timeRange;
    const recentData = sensorData.filter(data => data.timestamp > cutoff);
    if (recentData.length === 0) return 0;
    return recentData.reduce((sum, data) => sum + data.humidity, 0) / recentData.length;
  };

  return {
    sensorData,
    currentData,
    sensorHealth,
    getAverageTemperature,
    getAverageHumidity,
  };
}
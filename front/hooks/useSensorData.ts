import { useState, useEffect } from 'react';
import axios from 'axios';
import { SensorData } from '@/types';

const API_URL = 'https://ornamentalbackmobile-production.up.railway.app';

/**
 * Hook para obtener las lecturas de los sensores.
 * - Obtiene periódicamente los datos desde el backend.
 */
export function useSensorData() {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Cargar las lecturas de sensores desde el backend.
   */
  const fetchSensorData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<{ success: boolean, data: SensorData[] }>(`${API_URL}/api/sensors/latest`);
      setSensorData(data.data);
      setError(null);
    } catch (err) {
      setError('Error fetching sensor data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 10000); // Actualiza cada 5s
    return () => clearInterval(interval);
  }, []);

  return {
    sensorData,
    loading,
    error,
    fetchSensorData,
  };
}

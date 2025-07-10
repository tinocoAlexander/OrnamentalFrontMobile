import { useState, useCallback } from 'react';
import { WorkingSession, CartPosition, ObstacleData, SensorData } from '@/types';

export function useWorkingSession() {
  const [currentSession, setCurrentSession] = useState<WorkingSession | null>(null);
  const [sessionHistory, setSessionHistory] = useState<WorkingSession[]>([]);

  const startSession = useCallback(() => {
    const session: WorkingSession = {
      id: `session_${Date.now()}`,
      startTime: Date.now(),
      mappingPath: [],
      cuttingPath: [],
      areaCovered: 0,
      obstacles: [],
      status: 'mapping',
      sensorData: [],
      averageTemperature: 0,
      averageHumidity: 0,
      batteryUsed: 0,
    };
    setCurrentSession(session);
    console.log('Nueva sesión iniciada');
  }, []);

  const updateSessionPath = useCallback((position: CartPosition, phase: 'mapping' | 'cutting') => {
    setCurrentSession(prev => {
      if (!prev) return null;

      if (phase === 'mapping') {
        const updatedPath = [...prev.mappingPath, position];
        const area = calculateArea(updatedPath);

        // Si ya tiene suficientes puntos, dejamos en "mapping_completed"
        const status = updatedPath.length >= 50 ? 'mapping_completed' : 'mapping';

        return {
          ...prev,
          mappingPath: updatedPath,
          areaCovered: area,
          status,
        };
      } else {
        return {
          ...prev,
          cuttingPath: [...prev.cuttingPath, position],
        };
      }
    });
  }, []);

  const addObstacle = useCallback((obstacle: ObstacleData) => {
    setCurrentSession(prev => prev ? {
      ...prev,
      obstacles: [...prev.obstacles, obstacle],
    } : null);
  }, []);

  const updateSensorData = useCallback((sensorData: SensorData) => {
    setCurrentSession(prev => {
      if (!prev) return null;

      const newSensorData = [...prev.sensorData, sensorData];
      const avgTemp = newSensorData.reduce((sum, d) => sum + d.temperature, 0) / newSensorData.length;
      const avgHumidity = newSensorData.reduce((sum, d) => sum + d.humidity, 0) / newSensorData.length;

      return {
        ...prev,
        sensorData: newSensorData,
        averageTemperature: avgTemp,
        averageHumidity: avgHumidity,
        batteryUsed: Math.max(0, 100 - sensorData.batteryLevel),
      };
    });
  }, []);

  const transitionToCutting = useCallback(() => {
    setCurrentSession(prev => prev ? {
      ...prev,
      status: 'cutting',
    } : null);
    console.log('Transición a fase de corte');
  }, []);

  const pauseSession = useCallback(() => {
    setCurrentSession(prev => prev ? {
      ...prev,
      status: 'interrupted',
    } : null);
    console.log('Sesión pausada');
  }, []);

  const completeSession = useCallback(() => {
    setCurrentSession(prev => {
      if (!prev) return null;

      const completed = {
        ...prev,
        endTime: Date.now(),
        status: 'completed',
      };

      setSessionHistory(history => [completed, ...history]);
      console.log('Sesión completada y guardada');
      return null;
    });
  }, []);

  const stopSession = useCallback(() => {
    setCurrentSession(prev => {
      if (!prev) return null;

      const stopped = {
        ...prev,
        endTime: Date.now(),
        status: 'interrupted',
      };

      setSessionHistory(history => [stopped, ...history]);
      console.log('Sesión detenida y guardada');
      return null;
    });
  }, []);

  return {
    currentSession,
    sessionHistory,
    startSession,
    updateSessionPath,
    addObstacle,
    updateSensorData,
    transitionToCutting,
    pauseSession,
    completeSession,
    stopSession,
  };
}

function calculateArea(path: CartPosition[]): number {
  if (path.length < 3) return 0;

  let area = 0;
  for (let i = 0; i < path.length; i++) {
    const j = (i + 1) % path.length;
    area += path[i].x * path[j].y;
    area -= path[j].x * path[i].y;
  }
  return Math.abs(area) / 2;
}

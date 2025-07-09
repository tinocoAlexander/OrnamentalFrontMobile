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
    console.log('Started new working session');
  }, []);

  const updateSessionPath = useCallback((position: CartPosition, phase: 'mapping' | 'cutting') => {
    if (!currentSession) return;

    setCurrentSession(prev => {
      if (!prev) return null;
      
      if (phase === 'mapping') {
        return {
          ...prev,
          mappingPath: [...prev.mappingPath, position],
          areaCovered: calculateArea([...prev.mappingPath, position]),
        };
      } else {
        return {
          ...prev,
          cuttingPath: [...prev.cuttingPath, position],
        };
      }
    });
  }, [currentSession]);

  const addObstacle = useCallback((obstacle: ObstacleData) => {
    if (!currentSession) return;

    setCurrentSession(prev => prev ? {
      ...prev,
      obstacles: [...prev.obstacles, obstacle],
    } : null);
  }, [currentSession]);

  const updateSensorData = useCallback((sensorData: SensorData) => {
    if (!currentSession) return;

    setCurrentSession(prev => {
      if (!prev) return null;
      
      const newSensorData = [...prev.sensorData, sensorData];
      const avgTemp = newSensorData.reduce((sum, data) => sum + data.temperature, 0) / newSensorData.length;
      const avgHumidity = newSensorData.reduce((sum, data) => sum + data.humidity, 0) / newSensorData.length;
      
      return {
        ...prev,
        sensorData: newSensorData,
        averageTemperature: avgTemp,
        averageHumidity: avgHumidity,
        batteryUsed: Math.max(0, 100 - sensorData.batteryLevel),
      };
    });
  }, [currentSession]);

  const transitionToCutting = useCallback(() => {
    if (!currentSession || currentSession.status !== 'mapping') return;

    setCurrentSession(prev => prev ? {
      ...prev,
      status: 'cutting',
    } : null);
    console.log('Transitioned to cutting phase');
  }, [currentSession]);

  const pauseSession = useCallback(() => {
    if (!currentSession) return;

    setCurrentSession(prev => prev ? {
      ...prev,
      status: 'interrupted',
    } : null);
    console.log('Session paused');
  }, [currentSession]);

  const completeSession = useCallback(() => {
    if (!currentSession) return;

    const completedSession: WorkingSession = {
      ...currentSession,
      endTime: Date.now(),
      status: 'completed',
    };

    setCurrentSession(null);
    setSessionHistory(prev => [completedSession, ...prev]);
    console.log('Session completed and saved to history');
  }, [currentSession]);

  const stopSession = useCallback(() => {
    if (!currentSession) return;

    const stoppedSession: WorkingSession = {
      ...currentSession,
      endTime: Date.now(),
      status: 'interrupted',
    };

    setCurrentSession(null);
    setSessionHistory(prev => [stoppedSession, ...prev]);
    console.log('Session stopped and saved to history');
  }, [currentSession]);

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
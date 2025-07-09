import { useState, useCallback } from 'react';
import { MappingSession, CuttingSession, CartPosition } from '@/types';

export function useCartSession() {
  const [mappingSession, setMappingSession] = useState<MappingSession | null>(null);
  const [cuttingSession, setCuttingSession] = useState<CuttingSession | null>(null);
  const [currentPosition, setCurrentPosition] = useState<CartPosition | null>(null);

  const startMapping = useCallback(() => {
    const session: MappingSession = {
      id: `mapping_${Date.now()}`,
      startTime: Date.now(),
      path: [],
      area: 0,
      obstacles: [],
      status: 'mapping',
    };
    setMappingSession(session);
  }, []);

  const stopMapping = useCallback(() => {
    if (mappingSession) {
      setMappingSession(prev => prev ? {
        ...prev,
        endTime: Date.now(),
        status: 'completed',
      } : null);
    }
  }, [mappingSession]);

  const startCutting = useCallback((mappingSessionId: string) => {
    if (!mappingSession) return;

    const session: CuttingSession = {
      id: `cutting_${Date.now()}`,
      mappingSessionId,
      startTime: Date.now(),
      completedPath: [],
      totalPath: mappingSession.path,
      status: 'cutting',
      estimatedCompletionTime: Date.now() + (mappingSession.area * 2 * 60 * 1000), // 2 minutes per square meter
    };
    setCuttingSession(session);
  }, [mappingSession]);

  const pauseCutting = useCallback(() => {
    if (cuttingSession) {
      setCuttingSession(prev => prev ? {
        ...prev,
        status: 'paused',
        pausedAt: Date.now(),
      } : null);
    }
  }, [cuttingSession]);

  const resumeCutting = useCallback(() => {
    if (cuttingSession) {
      setCuttingSession(prev => prev ? {
        ...prev,
        status: 'cutting',
        resumedAt: Date.now(),
      } : null);
    }
  }, [cuttingSession]);

  const stopCutting = useCallback(() => {
    if (cuttingSession) {
      setCuttingSession(prev => prev ? {
        ...prev,
        status: 'stopped',
        endTime: Date.now(),
      } : null);
    }
  }, [cuttingSession]);

  return {
    mappingSession,
    cuttingSession,
    currentPosition,
    startMapping,
    stopMapping,
    startCutting,
    pauseCutting,
    resumeCutting,
    stopCutting,
  };
}
// Importaciones
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Session } from '@/types';

const API_URL = 'https://ornamentalbackmobile-production.up.railway.app/api';

/**
 * Hook para gestionar las sesiones de trabajo.
 * - Obtiene historial y sesión actual.
 * - Permite iniciar, detener y actualizar estado.
 */
export function useWorkingSession() {
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [sessionHistory, setSessionHistory] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<{ success: boolean; data: Session[] }>(`${API_URL}/sessions`);
      setSessionHistory(data.data); // 👈 aquí accedes al array
      setError(null);
    } catch (err) {
      setError('Error cargando historial de sesiones');
    } finally {
      setLoading(false);
    }
  };

  const startSession = async () => {
  setLoading(true);
  try {
    const { data } = await axios.get<{ success: boolean; data: Session }>(`${API_URL}/sessions/latest`);
    setCurrentSession(data.data); // aquí accedes a data.data porque tu backend devuelve { success, data }
    setError(null);
    fetchHistory();
  } catch (err) {
    setError('Error iniciando sesión');
  } finally {
    setLoading(false);
  }
};

  const updateSessionStatus = async (id: string, status: Session['status']) => {
    setLoading(true);
    try {
      const { data } = await axios.patch<Session>(`${API_URL}/sessions/${id}/status`, { status });
      setCurrentSession(data);
      setError(null);
      fetchHistory();
    } catch (err) {
      setError('Error actualizando estado de la sesión');
    } finally {
      setLoading(false);
    }
  };

  const stopSession = async (id: string) => {
    setLoading(true);
    try {
      const { data } = await axios.patch<Session>(`${API_URL}/sessions/${id}/status`, {
        status: 'interrupted',
      });
      setCurrentSession(null);
      setError(null);
      fetchHistory();
    } catch (err) {
      setError('Error deteniendo la sesión');
    } finally {
      setLoading(false);
    }
  };

  return {
    currentSession,
    sessionHistory,
    loading,
    error,
    startSession,
    updateSessionStatus,
    stopSession,
    fetchHistory,
  };
}

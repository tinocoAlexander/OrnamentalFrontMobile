import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { CartPosition } from '@/types';

const API_URL = 'https://ornamentalbackmobile-production.up.railway.app';

type Phase = 'mapping' | 'cutting';

/**
 * Hook para gestionar la ruta de una sesión (mapeo o corte).
 * - Obtiene el path actual desde el backend.
 * - Permite añadir nuevas posiciones.
 */
export function useSessionPath(sessionId: string, phase: Phase) {
  const [path, setPath] = useState<CartPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Cargar la ruta actual desde el backend.
   */
  const fetchPath = useCallback(async () => {
    if (!sessionId) return;

    setLoading(true);
    try {
      const { data } = await axios.get<CartPosition[]>(
        `${API_URL}/sessions/${sessionId}/path`,
        { params: { phase } }
      );
      setPath(data);
      setError(null);
    } catch (err) {
      setError(`Error fetching ${phase} path`);
    } finally {
      setLoading(false);
    }
  }, [sessionId, phase]);

  /**
   * Añadir una posición al path en el backend.
   */
  const addPosition = useCallback(
    async (position: CartPosition) => {
      try {
        await axios.patch(
          `${API_URL}/sessions/${sessionId}/path`,
          { position, phase }
        );
        fetchPath();
      } catch (err) {
        console.error(`Error adding position to ${phase} path`);
      }
    },
    [sessionId, phase, fetchPath]
  );

  useEffect(() => {
    fetchPath();
  }, [fetchPath]);

  return {
    path,
    loading,
    error,
    fetchPath,
    addPosition,
  };
}

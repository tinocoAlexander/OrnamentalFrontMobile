import { useState, useEffect } from 'react';
import axios from 'axios';
import { Session, CartPosition } from '@/types';

const API_URL = 'https://ornamentalbackmobile-production.up.railway.app';

export function useSessionPath(sessionId: string, phase: 'mapping' | 'cutting') {
  const [path, setPath] = useState<CartPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = async () => {
    if (!sessionId) return;

    setLoading(true);
    try {
      const { data } = await axios.get<{ data: Session }>(
        `${API_URL}/api/sessions/${sessionId}`
      );

      const session = data.data;

      setPath(phase === 'mapping' ? session.mappingPath : session.cuttingPath);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch session ${sessionId}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
    const interval = setInterval(fetchSession, 3000);
    return () => clearInterval(interval);
  }, [sessionId, phase]);

  return { path, loading, error };
}

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Notification } from '@/types';

const API_URL = 'https://ornamentalbackmobile-production.up.railway.app/api';

/**
 * Hook para gestionar las notificaciones del sistema.
 * - Obtiene las notificaciones desde el backend.
 * - Permite marcarlas como leídas y eliminarlas por id.
 * - Permite eliminar todas las notificaciones.
 * - Calcula cuántas no han sido leídas.
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga las notificaciones desde el backend.
   */
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<{ success: boolean; data: Notification[] }>(`${API_URL}/notifications`);
      setNotifications(data.data);
      setError(null);
    } catch (err) {
      setError('Error fetching notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Elimina una notificación por id.
   */
  const dismissNotification = useCallback(async (id: string) => {
    try {
      await axios.delete(`${API_URL}/notifications/${id}`);
      fetchNotifications();
    } catch (err) {
      console.error('Error dismissing notification');
    }
  }, [fetchNotifications]);

  /**
   * Elimina todas las notificaciones.
   */
  const clearAllNotifications = useCallback(async () => {
    try {
      await axios.delete(`${API_URL}/notifications`);
      fetchNotifications();
    } catch (err) {
      console.error('Error clearing notifications');
    }
  }, [fetchNotifications]);

  /**
   * Marca una notificación como leída.
   */
  const markAsRead = useCallback(async (id: string) => {
    try {
      await axios.patch(`${API_URL}/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error('Error marking notification as read');
    }
  }, [fetchNotifications]);

  /**
   * Devuelve la cantidad de notificaciones no leídas.
   */
  const getUnreadCount = () => {
    return notifications.filter((n) => !n.read).length;
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 10000); // cada 10s
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
    dismissNotification,
    clearAllNotifications,
    markAsRead,
    getUnreadCount,
  };
}

import { useState, useCallback } from 'react';
import { NotificationData } from '@/types';

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const addNotification = useCallback((
    type: NotificationData['type'],
    title: string,
    message: string,
    priority: NotificationData['priority'] = 'medium'
  ) => {
    const notification: NotificationData = {
      id: `notificacion_${Date.now()}_${Math.random()}`,
      type,
      title,
      message,
      timestamp: Date.now(),
      read: false,
      dismissed: false,
      priority,
    };

    setNotifications(prev => [notification, ...prev]);
    console.log(`Nueva notificación: ${title}`);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const getUnreadCount = useCallback(() => {
    return notifications.filter(n => !n.read && !n.dismissed).length;
  }, [notifications]);

  // Generar notificaciones de ejemplo para demostración
  const generateSampleNotifications = useCallback(() => {
    addNotification(
      'obstacle',
      'Obstáculo detectado',
      'El carrito encontró un obstáculo en las coordenadas (15.2, 8.7)',
      'high'
    );
    addNotification(
      'low_battery',
      'Advertencia de batería baja',
      'El nivel de batería está en 15%. Considera cargar pronto.',
      'medium'
    );
    addNotification(
      'maintenance',
      'Mantenimiento requerido',
      'Se recomienda afilar las cuchillas después de 48 horas de operación.',
      'low'
    );
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    dismissNotification,
    markAsRead,
    clearAllNotifications,
    getUnreadCount,
    generateSampleNotifications,
  };
}

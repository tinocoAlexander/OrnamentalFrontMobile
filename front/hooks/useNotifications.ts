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
      id: `notification_${Date.now()}_${Math.random()}`,
      type,
      title,
      message,
      timestamp: Date.now(),
      read: false,
      priority,
      dismissed: false,
    };

    setNotifications(prev => [notification, ...prev]);
    console.log(`New notification: ${title}`);
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

  // Auto-generate sample notifications for demo
  const generateSampleNotifications = useCallback(() => {
    addNotification('obstacle', 'Obstacle Detected', 'Cart encountered an obstacle at coordinates (15.2, 8.7)', 'high');
    addNotification('low_battery', 'Low Battery Warning', 'Battery level is at 15%. Consider charging soon.', 'medium');
    addNotification('maintenance', 'Maintenance Due', 'Blade sharpening is due after 48 hours of operation.', 'low');
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
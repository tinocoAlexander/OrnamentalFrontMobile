import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { X, TriangleAlert as AlertTriangle, Battery, Wrench, CircleCheck as CheckCircle, Wifi } from 'lucide-react-native';
import { NotificationData } from '@/types';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

interface NotificationCardProps {
  notification: NotificationData;
  onDismiss: (id: string) => void;
}

export function NotificationCard({ notification, onDismiss }: NotificationCardProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'obstacle': return <AlertTriangle size={20} color={getIconColor()} />;
      case 'low_battery': return <Battery size={20} color={getIconColor()} />;
      case 'maintenance': return <Wrench size={20} color={getIconColor()} />;
      case 'session_complete': return <CheckCircle size={20} color={getIconColor()} />;
      case 'connection': return <Wifi size={20} color={getIconColor()} />;
      default: return <AlertTriangle size={20} color={getIconColor()} />;
    }
  };

  const getIconColor = () => {
    switch (notification.priority) {
      case 'high': return COLORS.error;
      case 'medium': return COLORS.warning;
      case 'low': return COLORS.info;
      default: return COLORS.gray500;
    }
  };

  const getBorderColor = () => {
    switch (notification.priority) {
      case 'high': return COLORS.error;
      case 'medium': return COLORS.warning;
      case 'low': return COLORS.info;
      default: return COLORS.gray300;
    }
  };

  const getBackgroundColor = () => {
    switch (notification.priority) {
      case 'high': return `${COLORS.error}10`;
      case 'medium': return `${COLORS.warning}10`;
      case 'low': return `${COLORS.info}10`;
      default: return COLORS.surface;
    }
  };

  const formatTime = (timestamp: number) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return notificationTime.toLocaleDateString();
  };

  return (
    <View style={[
      styles.container,
      { 
        borderLeftColor: getBorderColor(),
        backgroundColor: getBackgroundColor(),
      }
    ]}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          {getIcon()}
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{notification.title}</Text>
          <Text style={styles.timestamp}>{formatTime(notification.timestamp)}</Text>
        </View>
        <TouchableOpacity
          style={styles.dismissButton}
          onPress={() => onDismiss(notification.id)}
        >
          <X size={18} color={COLORS.gray500} />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.message}>{notification.message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderLeftWidth: 4,
    ...SHADOWS.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  iconContainer: {
    marginRight: SPACING.sm,
    marginTop: 2,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: TYPOGRAPHY.base,
    fontFamily: TYPOGRAPHY.primarySemiBold,
    color: COLORS.gray800,
    marginBottom: 2,
  },
  timestamp: {
    fontSize: TYPOGRAPHY.xs,
    fontFamily: TYPOGRAPHY.primary,
    color: COLORS.gray500,
  },
  dismissButton: {
    padding: SPACING.xs / 2,
  },
  message: {
    fontSize: TYPOGRAPHY.sm,
    fontFamily: TYPOGRAPHY.primary,
    color: COLORS.gray600,
    lineHeight: 20,
  },
});
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

interface StatusCardProps {
  title: string;
  value: string;
  status?: 'healthy' | 'warning' | 'error' | 'info';
  subtitle?: string;
  icon?: React.ReactNode;
  compact?: boolean;
}

export function StatusCard({ 
  title, 
  value, 
  status = 'healthy', 
  subtitle, 
  icon,
  compact = false 
}: StatusCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'healthy': return COLORS.success;
      case 'warning': return COLORS.warning;
      case 'error': return COLORS.error;
      case 'info': return COLORS.info;
      default: return COLORS.gray500;
    }
  };

  const getStatusBackgroundColor = () => {
    switch (status) {
      case 'healthy': return `${COLORS.success}10`;
      case 'warning': return `${COLORS.warning}10`;
      case 'error': return `${COLORS.error}10`;
      case 'info': return `${COLORS.info}10`;
      default: return COLORS.gray50;
    }
  };

  return (
    <View style={[
      styles.container, 
      { 
        borderLeftColor: getStatusColor(),
        backgroundColor: getStatusBackgroundColor(),
      },
      compact && styles.compact
    ]}>
      <View style={styles.header}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={[styles.value, { color: getStatusColor() }]}>{value}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderLeftWidth: 4,
    ...SHADOWS.sm,
    marginBottom: SPACING.sm,
  },
  compact: {
    padding: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  icon: {
    marginRight: SPACING.xs,
  },
  title: {
    fontSize: TYPOGRAPHY.sm,
    fontFamily: TYPOGRAPHY.primaryMedium,
    color: COLORS.gray600,
  },
  value: {
    fontSize: TYPOGRAPHY['2xl'],
    fontFamily: TYPOGRAPHY.primaryBold,
    marginBottom: SPACING.xs / 2,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.xs,
    fontFamily: TYPOGRAPHY.primary,
    color: COLORS.gray500,
  },
});
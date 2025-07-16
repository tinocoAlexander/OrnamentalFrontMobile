import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import LinearGradient from 'react-native-linear-gradient';

interface StatusCardProps {
  title: string;
  value: string;
  status?: 'healthy' | 'warning' | 'error' | 'info';
  subtitle?: string;
  icon?: React.ReactNode;
  compact?: boolean;
}

/**
 * StatusCard muestra un bloque informativo con un título, valor, estado y un icono opcional.
 * Su color y fondo cambian según el estado ('healthy', 'warning', 'error', 'info').
 */
export function StatusCard({ 
  title, 
  value, 
  status = 'healthy', 
  subtitle, 
  icon,
  compact = false 
}: StatusCardProps) {
  // Devuelve los colores asociados al estado
  const getStatusColors = () => {
    switch (status) {
      case 'healthy': return { text: COLORS.success, bg: ['#d4fc79', '#96e6a1'] };
      case 'warning': return { text: COLORS.warning, bg: ['#fbd786', '#f7797d'] };
      case 'error': return { text: COLORS.error, bg: ['#ff758c', '#ff7eb3'] };
      case 'info': return { text: COLORS.info, bg: ['#43cea2', '#185a9d'] };
      default: return { text: COLORS.gray500, bg: ['#e0eafc', '#cfdef3'] };
    }
  };

  const { text, bg } = getStatusColors();

  return (
    <View
      style={[
        styles.container,
        compact && styles.compact,
        { shadowColor: text }
      ]}
    >
      {/* Fondo degradado */}
      <LinearGradient
        colors={bg}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />

      {/* Contenido */}
      <View style={styles.content}>
        <View style={styles.header}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text style={styles.title}>{title}</Text>
        </View>

        <Text style={[styles.value, { color: text }]}>{value}</Text>

        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
    borderRadius: BORDER_RADIUS.xl,
  },
  content: {
    zIndex: 1,
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
    marginRight: SPACING.sm,
  },
  title: {
    fontSize: TYPOGRAPHY.sm,
    fontFamily: TYPOGRAPHY.primaryMedium,
    color: COLORS.gray800,
  },
  value: {
    fontSize: TYPOGRAPHY['3xl'],
    fontFamily: TYPOGRAPHY.primaryBold,
    marginBottom: SPACING.xs / 2,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.xs,
    fontFamily: TYPOGRAPHY.primary,
    color: COLORS.gray600,
  },
});

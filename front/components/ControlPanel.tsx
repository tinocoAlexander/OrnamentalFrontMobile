import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Square } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

interface ControlPanelProps {
  status: 'idle' | 'mapping' | 'cutting' | 'paused' | 'completed';
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
}

/**
 * Panel de control con solo dos botones: Iniciar y Detener.
 */
export function ControlPanel({
  status,
  onStart,
  onStop,
  disabled = false,
}: ControlPanelProps) {
  const getStatusText = () => {
    switch (status) {
      case 'mapping': return 'Mapeando área…';
      case 'cutting': return 'Cortando césped…';
      case 'paused': return 'Pausado';
      case 'completed': return 'Sesión completada';
      case 'idle': return 'Listo para iniciar';
      default: return 'Estado desconocido';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'mapping': return COLORS.info;
      case 'cutting': return COLORS.success;
      case 'paused': return COLORS.warning;
      case 'completed': return COLORS.primary;
      case 'idle': return COLORS.gray500;
      default: return COLORS.gray400;
    }
  };

  const hasSession =
    status !== 'idle' && status !== 'interrupted';

  return (
    <View style={styles.container}>
      {/* Estado actual */}
      <View style={styles.statusContainer}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]} />
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {getStatusText()}
        </Text>
      </View>

      {/* Botones */}
      <View style={styles.buttonsRow}>
        {!hasSession && (
          <TouchableOpacity
            style={[styles.button, styles.start, disabled && styles.disabled]}
            onPress={onStart}
            disabled={disabled}
          >
            <Play size={24} color={COLORS.white} />
            <Text style={styles.buttonText}>Iniciar</Text>
          </TouchableOpacity>
        )}

        {hasSession && (
          <TouchableOpacity
            style={[styles.button, styles.stop, disabled && styles.disabled]}
            onPress={onStop}
            disabled={disabled}
          >
            <Square size={24} color={COLORS.white} />
            <Text style={styles.buttonText}>Detener</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.md,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  statusBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.sm,
  },
  statusText: {
    fontSize: TYPOGRAPHY.lg,
    fontFamily: TYPOGRAPHY.primarySemiBold,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    minWidth: 120,
    ...SHADOWS.sm,
  },
  start: {
    backgroundColor: COLORS.success,
  },
  stop: {
    backgroundColor: COLORS.error,
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.base,
    fontFamily: TYPOGRAPHY.primarySemiBold,
    marginLeft: SPACING.xs,
  },
});

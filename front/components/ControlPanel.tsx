import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Pause, Square, RotateCcw } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

interface ControlPanelProps {
  status: 'idle' | 'mapping' | 'cutting' | 'paused' | 'completed';
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onReset?: () => void;
  disabled?: boolean;
}

/**
 * Panel de control con botones para iniciar, pausar, detener o reiniciar la sesión.
 */
export function ControlPanel({
  status,
  onStart,
  onPause,
  onStop,
  onReset,
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

  const canStart = status === 'idle' || status === 'paused' || status === 'completed';
  const canPause = status === 'mapping' || status === 'cutting';
  const canStop = status === 'mapping' || status === 'cutting' || status === 'paused';

  return (
    <View style={styles.container}>
      {/* Estado actual */}
      <View style={styles.statusContainer}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]} />
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {getStatusText()}
        </Text>
      </View>

      {/* Botones de acción */}
      <View style={styles.buttonsRow}>
        {canStart && (
          <TouchableOpacity
            style={[styles.button, styles.start, disabled && styles.disabled]}
            onPress={onStart}
            disabled={disabled}
          >
            <Play size={24} color={COLORS.white} />
            <Text style={styles.buttonText}>Iniciar</Text>
          </TouchableOpacity>
        )}

        {canPause && (
          <TouchableOpacity
            style={[styles.button, styles.pause, disabled && styles.disabled]}
            onPress={onPause}
            disabled={disabled}
          >
            <Pause size={24} color={COLORS.white} />
            <Text style={styles.buttonText}>Pausar</Text>
          </TouchableOpacity>
        )}

        {canStop && (
          <TouchableOpacity
            style={[styles.button, styles.stop, disabled && styles.disabled]}
            onPress={onStop}
            disabled={disabled}
          >
            <Square size={24} color={COLORS.white} />
            <Text style={styles.buttonText}>Detener</Text>
          </TouchableOpacity>
        )}

        {onReset && status === 'completed' && (
          <TouchableOpacity
            style={[styles.button, styles.reset, disabled && styles.disabled]}
            onPress={onReset}
            disabled={disabled}
          >
            <RotateCcw size={24} color={COLORS.white} />
            <Text style={styles.buttonText}>Reiniciar</Text>
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
    flexWrap: 'wrap',
    gap: SPACING.sm,
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    flex: 1,
    minWidth: 100,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  start: {
    backgroundColor: COLORS.success,
  },
  pause: {
    backgroundColor: COLORS.warning,
  },
  stop: {
    backgroundColor: COLORS.error,
  },
  reset: {
    backgroundColor: COLORS.primary,
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

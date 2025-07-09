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

export function ControlPanel({
  status,
  onStart,
  onPause,
  onStop,
  onReset,
  disabled = false
}: ControlPanelProps) {
  const getStatusText = () => {
    switch (status) {
      case 'mapping': return 'Mapping Area...';
      case 'cutting': return 'Cutting Grass...';
      case 'paused': return 'Paused';
      case 'completed': return 'Session Complete';
      case 'idle': return 'Ready to Start';
      default: return 'Unknown Status';
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
      <View style={styles.statusContainer}>
        <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {getStatusText()}
        </Text>
      </View>

      <View style={styles.controlsContainer}>
        {canStart && (
          <TouchableOpacity
            style={[styles.button, styles.startButton, disabled && styles.disabled]}
            onPress={onStart}
            disabled={disabled}
          >
            <Play size={20} color={COLORS.white} />
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        )}

        {canPause && (
          <TouchableOpacity
            style={[styles.button, styles.pauseButton, disabled && styles.disabled]}
            onPress={onPause}
            disabled={disabled}
          >
            <Pause size={20} color={COLORS.white} />
            <Text style={styles.buttonText}>Pause</Text>
          </TouchableOpacity>
        )}

        {canStop && (
          <TouchableOpacity
            style={[styles.button, styles.stopButton, disabled && styles.disabled]}
            onPress={onStop}
            disabled={disabled}
          >
            <Square size={20} color={COLORS.white} />
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableOpacity>
        )}

        {onReset && status === 'completed' && (
          <TouchableOpacity
            style={[styles.button, styles.resetButton, disabled && styles.disabled]}
            onPress={onReset}
            disabled={disabled}
          >
            <RotateCcw size={20} color={COLORS.white} />
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.md,
    marginBottom: SPACING.md,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    justifyContent: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.sm,
  },
  statusText: {
    fontSize: TYPOGRAPHY.base,
    fontFamily: TYPOGRAPHY.primarySemiBold,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: SPACING.sm,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    minWidth: 80,
    flex: 1,
  },
  startButton: {
    backgroundColor: COLORS.success,
  },
  pauseButton: {
    backgroundColor: COLORS.warning,
  },
  stopButton: {
    backgroundColor: COLORS.error,
  },
  resetButton: {
    backgroundColor: COLORS.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.sm,
    fontFamily: TYPOGRAPHY.primarySemiBold,
    marginLeft: SPACING.xs,
  },
});
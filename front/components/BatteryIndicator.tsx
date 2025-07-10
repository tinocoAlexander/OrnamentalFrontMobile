import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BatteryCharging, BatteryFull, BatteryLow } from 'lucide-react-native';
import { SensorData } from '@/types';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

interface BatteryIndicatorProps {
  data: SensorData[];
}

export const BatteryIndicator = ({ data }: BatteryIndicatorProps) => {
  const batteryLevel =
    data.length > 0 ? data[data.length - 1].batteryLevel : 0;

  let color = COLORS.success;
  let icon = <BatteryFull color={COLORS.success} size={32} />;
  if (batteryLevel < 20) {
    color = COLORS.error;
    icon = <BatteryLow color={COLORS.error} size={32} />;
  } else if (batteryLevel < 50) {
    color = COLORS.warning;
    icon = <BatteryCharging color={COLORS.warning} size={32} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nivel de Batería</Text>

      <View style={styles.batteryCircle}>
        <View
          style={[
            styles.batteryFill,
            {
              height: `${batteryLevel}%`,
              backgroundColor: color,
            },
          ]}
        />
        <View style={styles.iconContainer}>{icon}</View>
      </View>

      <Text style={[styles.levelText, { color }]}>{batteryLevel.toFixed(0)}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
    alignItems: 'center',
  },
  title: {
    fontSize: TYPOGRAPHY.base,
    fontFamily: TYPOGRAPHY.primarySemiBold,
    color: COLORS.gray800,
    marginBottom: SPACING.md,
  },
  batteryCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: COLORS.gray300,
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: SPACING.md,
    backgroundColor: COLORS.surfaceSecondary,
    position: 'relative',
  },
  batteryFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  iconContainer: {
    position: 'absolute',
    top: '35%',
    alignItems: 'center',
  },
  levelText: {
    fontSize: TYPOGRAPHY['2xl'],
    fontFamily: TYPOGRAPHY.primaryBold,
  },
});

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { SensorData } from '@/types';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

interface SensorChartProps {
  data: SensorData[];
  type: 'temperature' | 'humidity' | 'battery';
  title: string;
  compact?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

export function SensorChart({ data, type, title, compact = false }: SensorChartProps) {
  const getValue = (item: SensorData) => {
    switch (type) {
      case 'temperature': return item.temperature;
      case 'humidity': return item.humidity;
      case 'battery': return item.batteryLevel;
      default: return 0;
    }
  };

  const getUnit = () => {
    switch (type) {
      case 'temperature': return '°C';
      case 'humidity': return '%';
      case 'battery': return '%';
      default: return '';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'temperature': return COLORS.warning;
      case 'humidity': return COLORS.info;
      case 'battery': return COLORS.success;
      default: return COLORS.gray400;
    }
  };

  const getCurrentValue = () => {
    if (data.length === 0) return 0;
    return getValue(data[data.length - 1]);
  };

  const getMinMax = () => {
    if (data.length === 0) return { min: 0, max: 100 };
    const values = data.map(getValue);
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  };

  const { min, max } = getMinMax();
  const currentValue = getCurrentValue();
  const chartColor = getColor();

  return (
    <View style={[styles.container, compact && styles.compact]}>
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.currentValueContainer}>
        <Text style={[styles.currentValue, { color: chartColor }]}>
          {currentValue.toFixed(1)}{getUnit()}
        </Text>
      </View>

      <View style={styles.minMaxContainer}>
        <Text style={styles.minMaxText}>
          Min: {min.toFixed(1)}{getUnit()}
        </Text>
        <Text style={styles.minMaxText}>
          Max: {max.toFixed(1)}{getUnit()}
        </Text>
      </View>

      {/* TODO: Implement actual chart rendering using react-native-svg or recharts */}
      <View style={styles.chartPlaceholder}>
        <View style={[styles.chartLine, { backgroundColor: chartColor }]} />
        <Text style={styles.chartText}>
          Chart visualization ({data.length} data points)
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Last updated: {data.length > 0 ? new Date(data[data.length - 1].timestamp).toLocaleTimeString() : 'Never'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  compact: {
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: TYPOGRAPHY.base,
    fontFamily: TYPOGRAPHY.primarySemiBold,
    color: COLORS.gray800,
    marginBottom: SPACING.sm,
  },
  currentValueContainer: {
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  currentValue: {
    fontSize: TYPOGRAPHY['3xl'],
    fontFamily: TYPOGRAPHY.primaryBold,
  },
  minMaxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  minMaxText: {
    fontSize: TYPOGRAPHY.sm,
    fontFamily: TYPOGRAPHY.primary,
    color: COLORS.gray500,
  },
  chartPlaceholder: {
    height: 120,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: SPACING.sm,
  },
  chartLine: {
    position: 'absolute',
    top: '50%',
    left: SPACING.md,
    right: SPACING.md,
    height: 2,
    opacity: 0.3,
  },
  chartText: {
    fontSize: TYPOGRAPHY.sm,
    fontFamily: TYPOGRAPHY.primary,
    color: COLORS.gray500,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: TYPOGRAPHY.xs,
    fontFamily: TYPOGRAPHY.primary,
    color: COLORS.gray400,
  },
});
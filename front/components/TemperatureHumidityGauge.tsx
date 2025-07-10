import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { SensorData } from '@/types';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { ChevronLeft, ChevronRight, Flame, Droplet } from 'lucide-react-native';

interface GaugeProps {
  data: SensorData[];
}

export const TemperatureHumidityGauge = ({ data }: GaugeProps) => {
  const [current, setCurrent] = useState<'temperature' | 'humidity'>('temperature');

  const last = data[data.length - 1] || { temperature: 0, humidity: 0, timestamp: Date.now() };
  const value = current === 'temperature' ? last.temperature : last.humidity;
  const unit = current === 'temperature' ? '°C' : '%';
  const min = current === 'temperature' ? 10 : 20;
  const max = current === 'temperature' ? 40 : 100;

  const percentage = Math.min(Math.max((value - min) / (max - min), 0), 1);
  const radius = 70;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - percentage);

  const switchMetric = () => {
    setCurrent(prev => (prev === 'temperature' ? 'humidity' : 'temperature'));
  };

  // 🔷 colores dinámicos
  let color = COLORS.info;
  let gradientStart = '#6DD5FA';
  let gradientEnd = '#2980B9';
  if (current === 'temperature') {
    if (value < 15) {
      color = COLORS.info;
      gradientStart = '#6DD5FA';
      gradientEnd = '#2980B9';
    } else if (value > 30) {
      color = COLORS.error;
      gradientStart = '#FF6E7F';
      gradientEnd = '#B31217';
    } else {
      color = COLORS.warning;
      gradientStart = '#FBD786';
      gradientEnd = '#f7797d';
    }
  } else {
    if (value < 30) {
      color = COLORS.warning;
      gradientStart = '#FBD786';
      gradientEnd = '#f7797d';
    } else if (value > 70) {
      color = COLORS.error;
      gradientStart = '#FF6E7F';
      gradientEnd = '#B31217';
    } else {
      color = COLORS.success;
      gradientStart = '#56ab2f';
      gradientEnd = '#a8e063';
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {current === 'temperature' ? 'Temperatura' : 'Humedad'}
      </Text>

      <View style={styles.gaugeContainer}>
        <TouchableOpacity onPress={switchMetric} style={styles.arrow}>
          <ChevronLeft color={COLORS.gray400} size={28} />
        </TouchableOpacity>

        <Svg width={180} height={180}>
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor={gradientStart} />
              <Stop offset="100%" stopColor={gradientEnd} />
            </LinearGradient>
          </Defs>
          <G rotation="-90" origin="90,90">
            <Circle
              cx="90"
              cy="90"
              r={radius}
              stroke="#E5E7EB"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Circle
              cx="90"
              cy="90"
              r={radius}
              stroke="url(#grad)"
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              fill="none"
            />
          </G>
        </Svg>

        <TouchableOpacity onPress={switchMetric} style={styles.arrow}>
          <ChevronRight color={COLORS.gray400} size={28} />
        </TouchableOpacity>
      </View>

      <View style={styles.valueContainer}>
        {current === 'temperature' ? (
          <Flame color={color} size={24} />
        ) : (
          <Droplet color={color} size={24} />
        )}
        <Text style={[styles.value, { color }]}>
          {value.toFixed(1)}<Text style={styles.unit}>{unit}</Text>
        </Text>
      </View>

      <Text style={styles.time}>
        Última actualización: {new Date(last.timestamp).toLocaleTimeString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: TYPOGRAPHY.lg,
    fontFamily: TYPOGRAPHY.primarySemiBold,
    color: COLORS.gray700,
    marginBottom: SPACING.sm,
  },
  gaugeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  value: {
    fontSize: TYPOGRAPHY['3xl'],
    fontFamily: TYPOGRAPHY.primaryBold,
    marginLeft: SPACING.xs,
  },
  unit: {
    fontSize: TYPOGRAPHY.lg,
    fontFamily: TYPOGRAPHY.primary,
    color: COLORS.gray500,
  },
  time: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.gray400,
    marginTop: SPACING.xs,
  },
  arrow: {
    padding: SPACING.xs,
    borderRadius: 50,
  },
});

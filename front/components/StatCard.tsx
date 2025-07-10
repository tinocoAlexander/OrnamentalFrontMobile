import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

interface StatCardProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  color?: string;
}

export function StatCard({ label, value, icon, color = COLORS.primary }: StatCardProps) {
  return (
    <View style={[styles.card, { borderLeftColor: color + 'AA' }]}>
      <View style={styles.icon}>{icon}</View>
      <View style={styles.texts}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, { color }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    borderLeftWidth: 4,
    ...SHADOWS.sm,
    minWidth: 140,
  },
  icon: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  texts: {
    flex: 1,
  },
  label: {
    fontSize: TYPOGRAPHY.sm,
    color: COLORS.gray500,
    marginBottom: 2,
  },
  value: {
    fontSize: TYPOGRAPHY['2xl'],
    fontFamily: TYPOGRAPHY.primaryBold,
  },
});

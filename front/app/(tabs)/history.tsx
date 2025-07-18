import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BrandHeader } from '@/components/BrandHeader';
import { useWorkingSession } from '@/hooks/useWorkingSession';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

export default function HistoryScreen() {
  const { sessionHistory } = useWorkingSession();

  return (
    <View style={styles.container}>
      <BrandHeader />

      <View style={styles.content}>
        <Text style={styles.title}>Historial de sesiones</Text>

        {sessionHistory.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Sin sesiones aún</Text>
            <Text style={styles.emptySubtitle}>
              Aquí aparecerán las sesiones una vez que completes alguna.
            </Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {sessionHistory.map((session) => (
              <View key={session._id} style={styles.sessionCard}>
                <Text style={styles.sessionDate}>
                  {new Date(session.startTime).toLocaleString()}
                </Text>
                <Text style={[styles.sessionStatus, { color: getStatusColor(session.status) }]}>
                  {formatStatus(session.status)}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return COLORS.success;
    case 'interrupted': return COLORS.warning;
    case 'mapping': return COLORS.info;
    case 'cutting': return COLORS.primary;
    default: return COLORS.gray400;
  }
};

const formatStatus = (status: string) => {
  switch (status) {
    case 'completed': return 'Completada';
    case 'interrupted': return 'Interrumpida';
    case 'mapping': return 'Mapeando';
    case 'cutting': return 'Cortando';
    default: return 'Desconocido';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY['2xl'],
    fontFamily: TYPOGRAPHY.primaryBold,
    color: COLORS.gray800,
    marginBottom: SPACING.lg,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING['3xl'],
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.xl,
    fontFamily: TYPOGRAPHY.primarySemiBold,
    color: COLORS.gray600,
    marginBottom: SPACING.xs,
  },
  emptySubtitle: {
    fontSize: TYPOGRAPHY.base,
    fontFamily: TYPOGRAPHY.primary,
    color: COLORS.gray500,
    textAlign: 'center',
    lineHeight: 22,
  },
  sessionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  sessionDate: {
    fontSize: TYPOGRAPHY.base,
    fontFamily: TYPOGRAPHY.primarySemiBold,
    color: COLORS.gray800,
  },
  sessionStatus: {
    fontSize: TYPOGRAPHY.sm,
    fontFamily: TYPOGRAPHY.primary,
    marginTop: 4,
  },
});

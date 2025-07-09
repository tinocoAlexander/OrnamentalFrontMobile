import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { BrandHeader } from '@/components/BrandHeader';
import { StatusCard } from '@/components/StatusCard';
import { useWorkingSession } from '@/hooks/useWorkingSession';
import { WorkingSession } from '@/types';
import { Calendar, Clock, MapPin, Thermometer, Droplets, Battery, TriangleAlert as AlertTriangle, ChevronRight, FileText } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { formatDuration, formatArea, calculateSessionDuration, getWorkingHours } from '@/utils/calculations';

export default function HistoryScreen() {
  const { sessionHistory } = useWorkingSession();

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getStatusColor = (status: WorkingSession['status']) => {
    switch (status) {
      case 'completed': return COLORS.success;
      case 'interrupted': return COLORS.warning;
      case 'mapping': return COLORS.info;
      case 'cutting': return COLORS.primary;
      default: return COLORS.gray400;
    }
  };

  const getStatusLabel = (status: WorkingSession['status']) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'interrupted': return 'Interrupted';
      case 'mapping': return 'Mapping';
      case 'cutting': return 'Cutting';
      default: return 'Unknown';
    }
  };

  const calculateTotalStats = () => {
    return sessionHistory.reduce((totals, session) => {
      const duration = session.endTime ? 
        calculateSessionDuration(session.startTime, session.endTime) : 0;
      
      return {
        totalDuration: totals.totalDuration + duration,
        totalArea: totals.totalArea + session.areaCovered,
        totalObstacles: totals.totalObstacles + session.obstacles.length,
        avgTemperature: totals.avgTemperature + session.averageTemperature,
        avgHumidity: totals.avgHumidity + session.averageHumidity,
      };
    }, {
      totalDuration: 0,
      totalArea: 0,
      totalObstacles: 0,
      avgTemperature: 0,
      avgHumidity: 0,
    });
  };

  const totalStats = calculateTotalStats();
  const avgTemperature = sessionHistory.length > 0 ? totalStats.avgTemperature / sessionHistory.length : 0;
  const avgHumidity = sessionHistory.length > 0 ? totalStats.avgHumidity / sessionHistory.length : 0;

  const handleSessionPress = (session: WorkingSession) => {
    // TODO: Navigate to session details screen
    console.log('Navigate to session details:', session.id);
  };

  const renderSessionItem = ({ item }: { item: WorkingSession }) => {
    const duration = item.endTime ? 
      calculateSessionDuration(item.startTime, item.endTime) : 0;

    return (
      <TouchableOpacity
        style={styles.sessionCard}
        onPress={() => handleSessionPress(item)}
      >
        <View style={styles.sessionHeader}>
          <View style={styles.sessionInfo}>
            <Text style={styles.sessionDate}>{formatDate(item.startTime)}</Text>
            <View style={[styles.statusLabel, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusLabelText}>{getStatusLabel(item.status)}</Text>
            </View>
          </View>
          <ChevronRight size={20} color={COLORS.gray400} />
        </View>

        <View style={styles.sessionStats}>
          <View style={styles.statItem}>
            <Clock size={16} color={COLORS.gray500} />
            <Text style={styles.statText}>{formatDuration(duration)}</Text>
          </View>
          <View style={styles.statItem}>
            <MapPin size={16} color={COLORS.gray500} />
            <Text style={styles.statText}>{formatArea(item.areaCovered)}</Text>
          </View>
          <View style={styles.statItem}>
            <Thermometer size={16} color={COLORS.gray500} />
            <Text style={styles.statText}>{item.averageTemperature.toFixed(1)}°C</Text>
          </View>
          <View style={styles.statItem}>
            <Droplets size={16} color={COLORS.gray500} />
            <Text style={styles.statText}>{item.averageHumidity.toFixed(1)}%</Text>
          </View>
        </View>

        <View style={styles.sessionFooter}>
          <View style={styles.statItem}>
            <AlertTriangle size={16} color={COLORS.warning} />
            <Text style={styles.statText}>{item.obstacles.length} obstacles</Text>
          </View>
          <View style={styles.statItem}>
            <Battery size={16} color={COLORS.gray500} />
            <Text style={styles.statText}>{item.batteryUsed.toFixed(0)}% used</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <BrandHeader />
      
      <View style={styles.content}>
        <Text style={styles.title}>Session History</Text>
        
        {sessionHistory.length === 0 ? (
          <View style={styles.emptyState}>
            <FileText size={48} color={COLORS.gray400} />
            <Text style={styles.emptyTitle}>No Sessions Yet</Text>
            <Text style={styles.emptySubtitle}>
              Complete your first mowing session to see history here
            </Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Summary Statistics */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Summary Statistics</Text>
              <View style={styles.summaryCard}>
                <View style={styles.summaryGrid}>
                  <View style={styles.summaryItem}>
                    <Clock size={20} color={COLORS.success} />
                    <Text style={styles.summaryValue}>{formatDuration(totalStats.totalDuration)}</Text>
                    <Text style={styles.summaryLabel}>Total Time</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <MapPin size={20} color={COLORS.info} />
                    <Text style={styles.summaryValue}>{formatArea(totalStats.totalArea)}</Text>
                    <Text style={styles.summaryLabel}>Total Area</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Thermometer size={20} color={COLORS.warning} />
                    <Text style={styles.summaryValue}>{avgTemperature.toFixed(1)}°C</Text>
                    <Text style={styles.summaryLabel}>Avg Temp</Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Droplets size={20} color={COLORS.primary} />
                    <Text style={styles.summaryValue}>{avgHumidity.toFixed(1)}%</Text>
                    <Text style={styles.summaryLabel}>Avg Humidity</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Session List */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Sessions</Text>
              <FlatList
                data={sessionHistory}
                renderItem={renderSessionItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                contentContainerStyle={styles.sessionList}
              />
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
}

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
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  emptySubtitle: {
    fontSize: TYPOGRAPHY.base,
    fontFamily: TYPOGRAPHY.primary,
    color: COLORS.gray500,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontFamily: TYPOGRAPHY.primarySemiBold,
    color: COLORS.gray800,
    marginBottom: SPACING.md,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.sm,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  summaryItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: TYPOGRAPHY.xl,
    fontFamily: TYPOGRAPHY.primaryBold,
    color: COLORS.gray800,
    marginTop: SPACING.xs,
  },
  summaryLabel: {
    fontSize: TYPOGRAPHY.xs,
    fontFamily: TYPOGRAPHY.primary,
    color: COLORS.gray500,
    marginTop: 2,
  },
  sessionList: {
    gap: SPACING.sm,
  },
  sessionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    ...SHADOWS.sm,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sessionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionDate: {
    fontSize: TYPOGRAPHY.base,
    fontFamily: TYPOGRAPHY.primarySemiBold,
    color: COLORS.gray800,
    marginRight: SPACING.sm,
  },
  statusLabel: {
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
  },
  statusLabelText: {
    fontSize: TYPOGRAPHY.xs,
    fontFamily: TYPOGRAPHY.primaryMedium,
    color: COLORS.white,
  },
  sessionStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  sessionFooter: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
  },
  statText: {
    fontSize: TYPOGRAPHY.sm,
    fontFamily: TYPOGRAPHY.primary,
    color: COLORS.gray600,
  },
});
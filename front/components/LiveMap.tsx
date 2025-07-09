import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { CartPosition, ObstacleData } from '@/types';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

interface LiveMapProps {
  mappingPath: CartPosition[];
  cuttingPath: CartPosition[];
  currentPosition: CartPosition | null;
  obstacles: ObstacleData[];
  phase: 'mapping' | 'cutting' | 'completed';
}

const { width: screenWidth } = Dimensions.get('window');
const MAP_SIZE = screenWidth - (SPACING.md * 2);

export function LiveMap({ 
  mappingPath, 
  cuttingPath, 
  currentPosition, 
  obstacles, 
  phase 
}: LiveMapProps) {
  const calculateArea = (path: CartPosition[]): number => {
    if (path.length < 3) return 0;
    
    let area = 0;
    for (let i = 0; i < path.length; i++) {
      const j = (i + 1) % path.length;
      area += path[i].x * path[j].y;
      area -= path[j].x * path[i].y;
    }
    return Math.abs(area) / 2;
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'mapping': return COLORS.info;
      case 'cutting': return COLORS.success;
      case 'completed': return COLORS.primary;
      default: return COLORS.gray400;
    }
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'mapping': return 'Mapping Area';
      case 'cutting': return 'Cutting Grass';
      case 'completed': return 'Session Complete';
      default: return 'Idle';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Live Map</Text>
        <View style={[styles.phaseIndicator, { backgroundColor: getPhaseColor() }]}>
          <Text style={styles.phaseText}>{getPhaseText()}</Text>
        </View>
      </View>

      <View style={styles.mapContainer}>
        <View style={styles.mapArea}>
          {/* TODO: Implement actual map rendering using react-native-svg */}
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapText}>Real-time Map Visualization</Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Mapping Path:</Text>
                <Text style={styles.statValue}>{mappingPath.length} points</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Cutting Progress:</Text>
                <Text style={styles.statValue}>{cuttingPath.length} points</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Area Mapped:</Text>
                <Text style={styles.statValue}>{calculateArea(mappingPath).toFixed(1)} m²</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Obstacles:</Text>
                <Text style={styles.statValue}>{obstacles.length}</Text>
              </View>
            </View>
          </View>

          {/* Current Position Indicator */}
          {currentPosition && (
            <View style={styles.currentPosition}>
              <View style={styles.positionDot} />
              <Text style={styles.positionText}>
                Current: ({currentPosition.x.toFixed(1)}, {currentPosition.y.toFixed(1)})
              </Text>
            </View>
          )}

          {/* Obstacles Indicator */}
          {obstacles.length > 0 && (
            <View style={styles.obstaclesIndicator}>
              <Text style={styles.obstaclesText}>⚠️ {obstacles.length} obstacles</Text>
            </View>
          )}
        </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.lg,
    fontFamily: TYPOGRAPHY.primarySemiBold,
    color: COLORS.gray800,
  },
  phaseIndicator: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.full,
  },
  phaseText: {
    fontSize: TYPOGRAPHY.xs,
    fontFamily: TYPOGRAPHY.primaryMedium,
    color: COLORS.white,
  },
  mapContainer: {
    alignItems: 'center',
  },
  mapArea: {
    width: MAP_SIZE - (SPACING.md * 2),
    height: MAP_SIZE - (SPACING.md * 2),
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: BORDER_RADIUS.md,
    position: 'relative',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  mapText: {
    fontSize: TYPOGRAPHY.base,
    fontFamily: TYPOGRAPHY.primaryMedium,
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  statsContainer: {
    width: '100%',
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.sm,
    fontFamily: TYPOGRAPHY.primary,
    color: COLORS.gray600,
  },
  statValue: {
    fontSize: TYPOGRAPHY.sm,
    fontFamily: TYPOGRAPHY.primaryMedium,
    color: COLORS.primary,
  },
  currentPosition: {
    position: 'absolute',
    bottom: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: COLORS.info,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  positionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    marginRight: SPACING.xs,
  },
  positionText: {
    fontSize: TYPOGRAPHY.xs,
    fontFamily: TYPOGRAPHY.primary,
    color: COLORS.white,
  },
  obstaclesIndicator: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.warning,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.xs,
  },
  obstaclesText: {
    fontSize: TYPOGRAPHY.xs,
    fontFamily: TYPOGRAPHY.primaryMedium,
    color: COLORS.white,
  },
});
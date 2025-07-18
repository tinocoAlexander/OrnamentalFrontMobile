import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { CartPosition, Obstacle } from '@/types';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

interface LiveMapProps {
  mappingPath: CartPosition[];
  cuttingPath: CartPosition[];
  currentPosition: CartPosition | null;
  obstacles: Obstacle[];
  phase: 'mapping' | 'cutting' | 'completed';
}

const { width: screenWidth } = Dimensions.get('window');
const MAP_SIZE = screenWidth - SPACING.md * 2;

/**
 * Componente para mostrar un resumen visual del mapa en vivo.
 * No renderiza un mapa real, solo estadísticas y placeholders.
 */
export function LiveMap({
  mappingPath,
  cuttingPath,
  currentPosition,
  obstacles,
  phase,
}: LiveMapProps) {
  const colorFase = () => {
    switch (phase) {
      case 'mapping': return COLORS.info;
      case 'cutting': return COLORS.success;
      case 'completed': return COLORS.primary;
      default: return COLORS.gray400;
    }
  };

  const textoFase = () => {
    switch (phase) {
      case 'mapping': return 'Mapeando área';
      case 'cutting': return 'Cortando césped';
      case 'completed': return 'Sesión completada';
      default: return 'Inactivo';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mapa en vivo</Text>
        <View style={[styles.phaseIndicator, { backgroundColor: colorFase() }]}>
          <Text style={styles.phaseText}>{textoFase()}</Text>
        </View>
      </View>

      <View style={styles.mapContainer}>
        <View style={styles.mapArea}>
          {/* Placeholder para mapa */}
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapText}>Visualización del mapa</Text>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Puntos mapeo:</Text>
                <Text style={styles.statValue}>{mappingPath.length}</Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Puntos corte:</Text>
                <Text style={styles.statValue}>{cuttingPath.length}</Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Obstáculos:</Text>
                <Text style={styles.statValue}>{obstacles.length}</Text>
              </View>
            </View>
          </View>

          {/* Posición actual */}
          {currentPosition && (
            <View style={styles.currentPosition}>
              <View style={styles.positionDot} />
              <Text style={styles.positionText}>
                ({currentPosition.x.toFixed(1)}, {currentPosition.y.toFixed(1)})
              </Text>
            </View>
          )}

          {/* Obstáculos */}
          {obstacles.length > 0 && (
            <View style={styles.obstaclesIndicator}>
              <Text style={styles.obstaclesText}>⚠️ {obstacles.length} obstáculos</Text>
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
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    ...SHADOWS.md,
    marginBottom: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.xl,
    fontFamily: TYPOGRAPHY.primaryBold,
    color: COLORS.gray900,
  },
  phaseIndicator: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  phaseText: {
    fontSize: TYPOGRAPHY.sm,
    fontFamily: TYPOGRAPHY.primaryMedium,
    color: COLORS.white,
  },
  mapContainer: {
    alignItems: 'center',
  },
  mapArea: {
    width: MAP_SIZE - SPACING.md,
    height: MAP_SIZE - SPACING.md,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: BORDER_RADIUS.lg,
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
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
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
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  obstaclesText: {
    fontSize: TYPOGRAPHY.xs,
    fontFamily: TYPOGRAPHY.primaryMedium,
    color: COLORS.white,
  },
});

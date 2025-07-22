import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Polygon, Circle } from 'react-native-svg';
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

  const allPoints = mappingPath.length > 0 ? mappingPath : [{ x: 0, y: 0 }];
  const xs = allPoints.map(p => p.x);
  const ys = allPoints.map(p => p.y);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const scaleX = (x: number) =>
    ((x - minX) / Math.max(maxX - minX, 1)) * (MAP_SIZE - 10);

  const scaleY = (y: number) =>
    ((y - minY) / Math.max(maxY - minY, 1)) * (MAP_SIZE - 10);

  // convertir path a string para <Polygon />
  const polygonPoints = mappingPath
    .map(p => `${scaleX(p.x)},${scaleY(p.y)}`)
    .join(' ');

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
          <Svg width="100%" height="100%">
            {/* Área rellenada */}
            {mappingPath.length > 2 && (
              <Polygon
                points={polygonPoints}
                fill={`${COLORS.primary}55`} // color con transparencia
                stroke={COLORS.primary}
                strokeWidth={1}
              />
            )}

            {/* Puntos de mapeo */}
            {mappingPath.map((p, idx) => (
              <Circle
                key={`map-${idx}`}
                cx={scaleX(p.x)}
                cy={scaleY(p.y)}
                r={2}
                fill="blue"
              />
            ))}

            {/* Puntos de corte */}
            {cuttingPath.map((p, idx) => (
              <Circle
                key={`cut-${idx}`}
                cx={scaleX(p.x)}
                cy={scaleY(p.y)}
                r={2}
                fill="green"
              />
            ))}

            {/* Obstáculos */}
            {obstacles.map((o, idx) => (
              <Circle
                key={`obs-${idx}`}
                cx={scaleX(o.position.x)}
                cy={scaleY(o.position.y)}
                r={3}
                fill="red"
              />
            ))}

            {/* Posición actual */}
            {currentPosition && (
              <Circle
                cx={scaleX(currentPosition.x)}
                cy={scaleY(currentPosition.y)}
                r={4}
                fill="yellow"
              />
            )}
          </Svg>
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
});

import { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

// Componentes
import { BrandHeader } from '@/components/BrandHeader';
import { LiveMap } from '@/components/LiveMap';
import { ControlPanel } from '@/components/ControlPanel';
import { StatCard } from '@/components/StatCard';

// Hooks personalizados
import {
  useWiFiConnection,
  useSensorData,
  useWorkingSession,
  useNotifications,
} from '@/hooks';

// Iconos
import { MapPin, Clock, CheckCircle } from 'lucide-react-native';

// Estilos
import {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
} from '@/constants/theme';

// Utilidades
import {
  formatDuration,
  calculateSessionDuration,
  formatArea,
} from '@/utils/calculations';

export default function OperationScreen() {
  const { connection } = useWiFiConnection();
  const { currentData } = useSensorData();
  const {
    currentSession,
    startSession,
    transitionToCutting,
    pauseSession,
    completeSession,
    stopSession,
    updateSensorData,
  } = useWorkingSession();
  const { addNotification } = useNotifications();

  // Actualiza los datos de sensores en la sesión activa
  useEffect(() => {
    if (currentData && currentSession) {
      updateSensorData(currentData);
    }
  }, [currentData, currentSession, updateSensorData]);

  const currentDuration = currentSession
    ? calculateSessionDuration(currentSession.startTime)
    : 0;

  const canStartCutting = currentSession?.status === 'mapping_completed';

  return (
    <View style={styles.container}>
      <BrandHeader />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Panel de control (mientras no haya finalizado mapeo) */}
        {!canStartCutting && (
          <View style={styles.section}>
            <ControlPanel
              status={currentSession?.status || 'idle'}
              onStart={startSession}
              onPause={pauseSession}
              onStop={stopSession}
              onReset={completeSession}
              disabled={false}
            />
          </View>
        )}

        {/* Botón para iniciar corte una vez finalizado el mapeo */}
        {canStartCutting && (
          <View style={styles.section}>
            <View style={styles.corteContainer}>
              <Text style={styles.corteText}>
                ✅ El mapeo ha finalizado. Revisa el área y presiona para comenzar el corte.
              </Text>
              <TouchableOpacity
                style={styles.botonCorte}
                onPress={transitionToCutting}
              >
                <Text style={styles.botonCorteTexto}>Iniciar corte</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Mapa en vivo */}
        <View style={styles.section}>
          <LiveMap
            mappingPath={currentSession?.mappingPath || []}
            cuttingPath={currentSession?.cuttingPath || []}
            currentPosition={null}
            obstacles={currentSession?.obstacles || []}
            phase={currentSession?.status || 'idle'}
          />
        </View>

        {/* Estadísticas de la sesión */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas de la sesión</Text>
          <View style={styles.statsRow}>
            <StatCard
              label="Área mapeada"
              value={formatArea(currentSession?.areaCovered || 0)}
              icon={<MapPin size={24} color={COLORS.success} />}
              color={COLORS.success}
            />
            <StatCard
              label="Duración"
              value={formatDuration(currentDuration)}
              icon={<Clock size={24} color={COLORS.info} />}
              color={COLORS.info}
            />
          </View>
        </View>

        {/* Checklist si no hay sesión activa */}
        {!currentSession && (
          <View style={styles.section}>
            <View style={styles.checklistCard}>
              <Text style={styles.checklistTitle}>Requisitos previos</Text>

              <View style={styles.checklistItem}>
                <CheckCircle
                  size={20}
                  color={
                    connection.connected ? COLORS.success : COLORS.gray400
                  }
                />
                <Text
                  style={[
                    styles.checklistText,
                    {
                      color: connection.connected
                        ? COLORS.success
                        : COLORS.gray400,
                    },
                  ]}
                >
                  Conexión Wi-Fi establecida
                </Text>
              </View>

              <View style={styles.checklistItem}>
                <CheckCircle
                  size={20}
                  color={currentData ? COLORS.success : COLORS.gray400}
                />
                <Text
                  style={[
                    styles.checklistText,
                    {
                      color: currentData
                        ? COLORS.success
                        : COLORS.gray400,
                    },
                  ]}
                >
                  Datos de sensores disponibles
                </Text>
              </View>

              <View style={styles.checklistItem}>
                <CheckCircle
                  size={20}
                  color={
                    currentData && currentData.batteryLevel >= 15
                      ? COLORS.success
                      : COLORS.gray400
                  }
                />
                <Text
                  style={[
                    styles.checklistText,
                    {
                      color:
                        currentData && currentData.batteryLevel >= 15
                          ? COLORS.success
                          : COLORS.gray400,
                    },
                  ]}
                >
                  Batería suficiente (≥15%)
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
    padding: SPACING.md,
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
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  checklistCard: {
    backgroundColor: COLORS.info + '10',
    borderRadius: 12,
    padding: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.info,
  },
  checklistTitle: {
    fontSize: TYPOGRAPHY.base,
    fontFamily: TYPOGRAPHY.primarySemiBold,
    color: COLORS.info,
    marginBottom: SPACING.sm,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  checklistText: {
    fontSize: TYPOGRAPHY.sm,
    fontFamily: TYPOGRAPHY.primary,
    marginLeft: SPACING.sm,
  },
  corteContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.md,
  },
  corteText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.gray800,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  botonCorte: {
    backgroundColor: COLORS.success,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
  },
  botonCorteTexto: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.base,
    fontFamily: TYPOGRAPHY.primarySemiBold,
  },
});

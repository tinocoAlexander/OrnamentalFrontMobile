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

// Hooks
import {
  useWiFiConnection,
  useSensorData,
  useWorkingSession,
} from '@/hooks';

import { MapPin, Clock, CheckCircle } from 'lucide-react-native';

import { COLORS, TYPOGRAPHY, SPACING } from '@/constants/theme';

/**
 * Pantalla para gestionar la operación del carrito.
 * - Controla la sesión (iniciar, pausar, detener).
 * - Muestra el mapa y estadísticas.
 * - Toda la lógica de cálculo y procesamiento pesado está en el backend.
 */
export default function OperationScreen() {
  const { connection } = useWiFiConnection();

  const { sensorData } = useSensorData(); // lecturas periódicas del backend
  const latestSensorData = sensorData[sensorData.length - 1] || null;

  const {
    currentSession,
    startSession,
    updateSessionStatus,
    stopSession,
  } = useWorkingSession();

  /**
   * Mapeamos `interrupted` a `idle` para que no rompa el ControlPanel.
   */
  const mappedStatus =
    currentSession?.status === 'interrupted'
      ? 'idle'
      : (currentSession?.status || 'idle');

  /**
   * Determina si ya puede iniciar el corte (después del mapeo).
   */
  const canStartCutting = currentSession?.status === 'completed';

  useEffect(() => {
    // Aquí podrías enviar `latestSensorData` al backend si fuera necesario.
    // Actualmente se gestiona en el backend.
  }, [latestSensorData, currentSession]);

  return (
    <View style={styles.container}>
      <BrandHeader />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >

        {/* Panel de control para la sesión */}
        <View style={styles.section}>
          <ControlPanel
            status={mappedStatus}
            onStart={startSession}
            onPause={() => {
              if (currentSession?._id) {
                updateSessionStatus(currentSession._id, 'completed');
              }
            }}
            onStop={() => {
              if (currentSession?._id) {
                stopSession(currentSession._id);
              }
            }}
            disabled={false}
          />
        </View>

        {/* Botón para iniciar corte (solo después del mapeo) */}
        {canStartCutting && (
          <View style={styles.section}>
            <View style={styles.corteContainer}>
              <Text style={styles.corteText}>
                ✅ El mapeo ha finalizado. Presiona para comenzar el corte.
              </Text>
              <TouchableOpacity
                style={styles.botonCorte}
                onPress={() => {
                  if (currentSession?._id) {
                    updateSessionStatus(currentSession._id, 'cutting');
                  }
                }}
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
            currentPosition={null} // puedes poner aquí si tienes una coordenada actual
            obstacles={currentSession?.obstacles || []}
            phase={
              currentSession?.status === 'mapping' ||
              currentSession?.status === 'cutting' ||
              currentSession?.status === 'completed'
                ? currentSession.status
                : 'mapping'
            }
          />
        </View>

        {/* Estadísticas básicas de la sesión */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas</Text>
          <View style={styles.statsRow}>
            <StatCard
              label="Área"
              value={`${currentSession?.areaCovered ?? 0} m²`}
              icon={<MapPin size={24} color={COLORS.success} />}
              color={COLORS.success}
            />
            <StatCard
              label="Temp. Prom."
              value={`${currentSession?.averageTemperature ?? 0} °C`}
              icon={<Clock size={24} color={COLORS.info} />}
              color={COLORS.info}
            />
            <StatCard
              label="Humedad Prom."
              value={`${currentSession?.averageHumidity ?? 0} %`}
              icon={<Clock size={24} color={COLORS.info} />}
              color={COLORS.info}
            />
          </View>
        </View>

        {/* Checklist inicial si no hay sesión activa */}
        {!currentSession && (
          <View style={styles.section}>
            <View style={styles.checklistCard}>
              <Text style={styles.checklistTitle}>Requisitos</Text>

              <View style={styles.checklistItem}>
                <CheckCircle
                  size={20}
                  color={connection.connected ? COLORS.success : COLORS.gray400}
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
                  Wi-Fi conectado
                </Text>
              </View>

              <View style={styles.checklistItem}>
                <CheckCircle
                  size={20}
                  color={latestSensorData ? COLORS.success : COLORS.gray400}
                />
                <Text
                  style={[
                    styles.checklistText,
                    {
                      color: latestSensorData
                        ? COLORS.success
                        : COLORS.gray400,
                    },
                  ]}
                >
                  Datos de sensores recibidos
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
    gap: SPACING.md,
    justifyContent: 'space-between',
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
    borderRadius: 12,
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
    borderRadius: 12,
  },
  botonCorteTexto: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.base,
    fontFamily: TYPOGRAPHY.primarySemiBold,
  },
});

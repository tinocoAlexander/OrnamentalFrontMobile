import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { BrandHeader } from '@/components/BrandHeader';
import { LiveMap } from '@/components/LiveMap';
import { ControlPanel } from '@/components/ControlPanel';
import { StatCard } from '@/components/StatCard';

import {
  useWiFiConnection,
  useSensorData,
  useWorkingSession,
} from '@/hooks';

import { MapPin, Clock, CheckCircle } from 'lucide-react-native';

import { COLORS, TYPOGRAPHY, SPACING } from '@/constants/theme';

export default function OperationScreen() {
  const { connection } = useWiFiConnection();
  const { sensorData } = useSensorData();
  const latestSensorData = sensorData[sensorData.length - 1] || null;

  const {
    currentSession,
    startSession,
    updateSessionStatus,
  } = useWorkingSession();

  // Local state para limpiar sin tocar el backend
  const [localSession, setLocalSession] = useState(currentSession);

  useEffect(() => {
    setLocalSession(currentSession);
  }, [currentSession]);

  const mappedStatus =
    localSession?.status === 'interrupted'
      ? 'idle'
      : (localSession?.status || 'idle');

  const canStartCutting = localSession?.status === 'completed';

  const handleStopFrontend = () => {
    setLocalSession(null);
  };

  return (
    <View style={styles.container}>
      <BrandHeader />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <ControlPanel
            status={mappedStatus}
            onStart={startSession}
            onStop={handleStopFrontend}
          />
        </View>

        {canStartCutting && (
          <View style={styles.section}>
            <View style={styles.corteContainer}>
              <Text style={styles.corteText}>
                ✅ El mapeo ha finalizado. Presiona para comenzar el corte.
              </Text>
              <TouchableOpacity
                style={styles.botonCorte}
                onPress={() => {
                  if (localSession?._id) {
                    updateSessionStatus(localSession._id, 'cutting');
                  }
                }}
              >
                <Text style={styles.botonCorteTexto}>Iniciar corte</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <LiveMap
            mappingPath={localSession?.mappingPath || []}
            cuttingPath={localSession?.cuttingPath || []}
            currentPosition={null}
            obstacles={localSession?.obstacles || []}
            phase={
              localSession?.status === 'mapping' ||
              localSession?.status === 'cutting' ||
              localSession?.status === 'completed'
                ? localSession.status
                : 'mapping'
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas</Text>
          <View style={styles.statsRow}>
            <StatCard
              label="Área"
              value={`${localSession?.areaCovered ?? 0} m²`}
              icon={<MapPin size={24} color={COLORS.success} />}
              color={COLORS.success}
            />
            <StatCard
              label="Temp. Prom."
              value={`${localSession?.averageTemperature ?? 0} °C`}
              icon={<Clock size={24} color={COLORS.info} />}
              color={COLORS.info}
            />
            <StatCard
              label="Humedad Prom."
              value={`${localSession?.averageHumidity ?? 0} %`}
              icon={<Clock size={24} color={COLORS.info} />}
              color={COLORS.info}
            />
          </View>
        </View>

        {!localSession && (
          <View style={styles.section}>
            <View style={styles.checklistCard}>
              <Text style={styles.checklistTitle}>Requisitos</Text>

              <View style={styles.checklistItem}>
                <CheckCircle color={COLORS.success} />
                <Text style={{ color: COLORS.success }}>
                  Wi-Fi no es obligatorio
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

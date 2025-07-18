import { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BrandHeader, StatusCard, TemperatureHumidityGauge } from '@/components';

// Hooks
import { useWiFiConnection, useSensorData, useWorkingSession } from '@/hooks';

// Iconos
import { Wifi, WifiOff } from 'lucide-react-native';

// Estilos y utilidades
import { COLORS, TYPOGRAPHY, SPACING } from '@/constants/theme';

/**
 * Pantalla principal del Dashboard.
 * Muestra el estado de conexión, tendencias de sensores y estado de la sesión actual.
 */
export default function DashboardScreen() {
  const { connection, isConnecting, connectToCart } = useWiFiConnection(); // Conexión simulada al carrito
  const { sensorData } = useSensorData(); // Datos reales de sensores (desde backend)
  const { currentSession } = useWorkingSession(); // Sesión actual (desde backend)

  /**
   * Maneja la acción de conectar al carrito.
   */
  const handleConnectToCart = () => {
    if (!connection.connected && !isConnecting) {
      connectToCart();
    }
  };

  return (
    <View style={styles.container}>
      <BrandHeader />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* Estado de la conexión al carrito */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estado de Conexión</Text>
          <TouchableOpacity onPress={handleConnectToCart} disabled={isConnecting}>
            <StatusCard
              title="Conexión Wi-Fi"
              value={connection.connected ? 'Conectado' : isConnecting ? 'Conectando...' : 'Desconectado'}
              status={connection.connected ? 'healthy' : 'error'}
              subtitle={
                connection.connected
                  ? `${connection.ssid}`
                  : 'Toca para conectar al Carrito Inteligente'
              }
              icon={
                connection.connected
                  ? <Wifi size={20} color={COLORS.success} />
                  : <WifiOff size={20} color={COLORS.error} />
              }
            />
          </TouchableOpacity>
        </View>

        {/* Gráficas de sensores */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tendencias de Datos de Sensores</Text>

          {sensorData.length > 0 ? (
            <TemperatureHumidityGauge data={sensorData} />
          ) : (
            <Text style={styles.noDataText}>
              Sin datos de sensores aún. Esperando lecturas…
            </Text>
          )}
        </View>

        {/* Aquí podrías agregar más secciones, como estado de sesión, si lo deseas */}

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
  noDataText: {
    textAlign: 'center',
    color: COLORS.gray400,
    fontSize: TYPOGRAPHY.base,
  },
});

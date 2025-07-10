// Se importa useEffect desde React para manejar efectos secundarios en el componente.
import { useEffect } from 'react';

// Se importan componentes y utilidades necesarias para el Dashboard.
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BrandHeader, StatusCard } from '@/components';
import { TemperatureHumidityGauge } from '@/components/TemperatureHumidityGauge';
import { BatteryIndicator } from '@/components/BatteryIndicator';

// Se importan los hooks
import { useWiFiConnection, useSensorData, useWorkingSession } from '@/hooks';

// Se importan iconos
import { Wifi, WifiOff } from 'lucide-react-native';

// Constantes de css
import { COLORS, TYPOGRAPHY, SPACING } from '@/constants/theme';

// Se importan las funciones para los cálculos de estadísticas y todo eso
import { formatDuration, getWorkingHours } from '@/utils/calculations';

// Funcion principal
export default function DashboardScreen() {
  const { connection, isConnecting, connectToCart } = useWiFiConnection(); // Hook para manejar la conexión Wi-Fi
  const { currentData, sensorData, sensorHealth } = useSensorData(); // Hook para manejar los datos de los sensores
  const { currentSession } = useWorkingSession(); // Hook para manejar la sesión de trabajo actual

  const handleConnectToCart = () => {
    if (!connection.connected && !isConnecting) {
      connectToCart();
    }
  };

  return (
    <View style={styles.container}>
      <BrandHeader />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Primer componente de conexion al carrito */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estado de Conexión</Text>
          <TouchableOpacity onPress={handleConnectToCart} disabled={isConnecting}>
            <StatusCard
              title="Conexión Wi-Fi"
              value={connection.connected ? 'Conectado' : isConnecting ? 'Conectando...' : 'Desconectado'}
              status={connection.connected ? 'healthy' : 'error'}
              subtitle={connection.connected 
                ? `${connection.ssid} • Signal: ${connection.signalStrength}%` 
                : 'Toca para conectar a Carrito Inteligente'}
              icon={connection.connected ? 
                <Wifi size={20} color={COLORS.success} /> : 
                <WifiOff size={20} color={COLORS.error} />
              }
            />
          </TouchableOpacity>
        </View>


        {/* Graficas de sensores */}
        {sensorData.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tendencias de Datos de Sensores</Text>

            {/* Componente para temperatura y humedad */}
            <TemperatureHumidityGauge data={sensorData} />

            {/* Batería */}
            <BatteryIndicator data={sensorData} />
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
  statusGrid: {
    gap: SPACING.sm,
  },
});

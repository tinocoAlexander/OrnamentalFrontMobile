// Se importa useEffect desde React para manejar efectos secundarios en el componente.
import { useEffect } from 'react';

// Se importan componentes y utilidades necesarias para el Dashboard.
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BrandHeader, StatusCard, SensorChart } from '@/components';

// Se importan los hooks
import { useWiFiConnection, useSensorData, useWorkingSession, useNotifications } from '@/hooks';

// Se importan iconos
import { Battery, Thermometer, Droplets, Wifi, WifiOff, Activity, Clock, MapPin, TriangleAlert as AlertTriangle } from 'lucide-react-native';

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


        {/* Sensor Charts */}
        {sensorData.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sensor Data Trends</Text>
            <SensorChart
              data={sensorData}
              type="temperature"
              title="Temperature Over Time"
              compact
            />
            <SensorChart
              data={sensorData}
              type="humidity"
              title="Humidity Over Time"
              compact
            />
            <SensorChart
              data={sensorData}
              type="battery"
              title="Battery Level"
              compact
            />
          </View>
        )}

        {/* Sensor Health */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sensor Health</Text>
          <View style={styles.statusGrid}>
            <StatusCard
              title="Ultrasonido"
              value={sensorHealth.ultrasonic.charAt(0).toUpperCase() + sensorHealth.ultrasonic.slice(1)}
              status={sensorHealth.ultrasonic === 'conectado' ? 'healthy' : 'warning'}
              compact
            />
            <StatusCard
              title="Giroscopio"
              value={sensorHealth.gyroscope.charAt(0).toUpperCase() + sensorHealth.gyroscope.slice(1)}
              status={sensorHealth.gyroscope === 'conectado' ? 'healthy' : 'warning'}
              compact
            />
            <StatusCard
              title="Acelerómetro"
              value={sensorHealth.accelerometer.charAt(0).toUpperCase() + sensorHealth.accelerometer.slice(1)}
              status={sensorHealth.accelerometer === 'conectado' ? 'healthy' : 'warning'}
              compact
            />
            <StatusCard
              title="DHT11"
              value={sensorHealth.dht11.charAt(0).toUpperCase() + sensorHealth.dht11.slice(1)}
              status={sensorHealth.dht11 === 'conectado' ? 'healthy' : 'warning'}
              compact
            />
          </View>
        </View>

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
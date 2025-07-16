import { useState } from 'react';
import { WiFiConnection } from '@/types';

/**
 * Hook para simular la conexión Wi-Fi al carrito.
 * - No utiliza backend.
 * - Solo sirve para UI.
 */
export function useWiFiConnection() {
  const [connection, setConnection] = useState<WiFiConnection>({
    connected: false,
    ssid: 'Carrito Inteligente',
  });

  const [isConnecting, setIsConnecting] = useState(false);

  /**
   * Simula la conexión al carrito.
   */
  const connectToCart = async () => {
    setIsConnecting(true);

    try {
      console.log('Simulando conexión al ESP32...');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simula espera
      setConnection({ connected: true, ssid: 'Carrito Inteligente' });
      console.log('Conexión simulada exitosa');
    } catch (error) {
      console.error('Error simulando la conexión:', error);
      setConnection({ connected: false, ssid: 'Carrito Inteligente' });
    } finally {
      setIsConnecting(false);
    }
  };

  /**
   * Simula la desconexión del carrito.
   */
  const disconnectFromCart = () => {
    setConnection({ connected: false, ssid: 'Carrito Inteligente' });
    console.log('Conexión simulada finalizada');
  };

  return {
    connection,
    isConnecting,
    connectToCart,
    disconnectFromCart,
  };
}

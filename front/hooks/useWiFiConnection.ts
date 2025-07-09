// Este es un hook personalizado para poder hacer la conexion a la red AP del ESP32
import { useState, useEffect } from 'react'; 
import { WiFiConnection } from '@/types';

export function useWiFiConnection() {
  const [connection, setConnection] = useState<WiFiConnection>({
    connected: false,
    signalStrength: 0,
    ssid: 'Carrito Inteligente',
  });

  const [isConnecting, setIsConnecting] = useState(false);

  const connectToCart = async () => {
    setIsConnecting(true);
    
    try {
      // TODO: Falta implementar la logica de conexion de internet a la red Wi-Fi del ESP32
      console.log('Conectandose al ESP32');
      
      // De momento, solo simulamos una conexion exitosa
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setConnection(prev => ({
        ...prev,
        connected: true,
        signalStrength: 85,
        ipAddress: '192.168.4.2', 
        lastConnected: Date.now(),
      }));

      console.log('Conectado al ESP32 exitosamente');
    } catch (error) {
      console.error('Error al conectar al carrito:', error);
      setConnection(prev => ({
        ...prev,
        connected: false,
        signalStrength: 0,
      }));
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectFromCart = () => {
    setConnection(prev => ({
      ...prev,
      connected: false,
      signalStrength: 0,
      ipAddress: undefined,
    }));
    console.log('Desconectado del carrito');
  };

  // Simula que si esta monitoreando la señal Wi-Fi cada 5 segundos
  useEffect(() => {
    if (!connection.connected) return;

    const interval = setInterval(() => {
      setConnection(prev => ({
        ...prev,
        signalStrength: Math.max(0, Math.min(100, prev.signalStrength + (Math.random() - 0.5) * 10)),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [connection.connected]);

  return {
    connection,
    isConnecting,
    connectToCart,
    disconnectFromCart,
  };
}
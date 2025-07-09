import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { BrandHeader } from '@/components/BrandHeader';
import { LiveMap } from '@/components/LiveMap';
import { ControlPanel } from '@/components/ControlPanel';
import { StatusCard } from '@/components/StatusCard';
import { useWiFiConnection } from '@/hooks/useWiFiConnection';
import { useSensorData } from '@/hooks/useSensorData';
import { useWorkingSession } from '@/hooks/useWorkingSession';
import { useNotifications } from '@/hooks/useNotifications';
import { MapPin, Clock, Battery, Thermometer, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '@/constants/theme';
import { formatDuration, calculateSessionDuration, formatArea } from '@/utils/calculations';

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
    updateSensorData 
  } = useWorkingSession();
  const { addNotification } = useNotifications();

  // Update sensor data in session
  useEffect(() => {
    if (currentData && currentSession) {
      updateSensorData(currentData);
    }
  }, [currentData, currentSession, updateSensorData]);

  // Auto-transition from mapping to cutting (simulated)
  useEffect(() => {
    if (currentSession && currentSession.status === 'mapping' && currentSession.mappingPath.length > 50) {
      // Simulate mapping completion after 50 path points
      setTimeout(() => {
        transitionToCutting();
        addNotification('session_complete', 'Mapping Complete', 'Starting cutting phase automatically', 'info');
      }, 2000);
    }
  }, [currentSession, transitionToCutting, addNotification]);

  const handleStart = () => {
    if (!connection.connected) {
      Alert.alert('Connection Error', 'Please connect to the cart first');
      return;
    }

    if (!currentData) {
      Alert.alert('Sensor Error', 'No sensor data available');
      return;
    }

    if (currentData.batteryLevel < 15) {
      Alert.alert('Low Battery', 'Battery level too low for operation');
      return;
    }

    startSession();
    addNotification('session_complete', 'Session Started', 'Beginning mapping phase', 'info');
    
    // TODO: Send start command to ESP32
    console.log('Sending start command to ESP32...');
  };

  const handlePause = () => {
    pauseSession();
    addNotification('session_complete', 'Session Paused', 'Operation paused by user', 'info');
    
    // TODO: Send pause command to ESP32
    console.log('Sending pause command to ESP32...');
  };

  const handleStop = () => {
    Alert.alert(
      'Stop Operation',
      'Are you sure you want to stop the current operation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Stop',
          style: 'destructive',
          onPress: () => {
            stopSession();
            addNotification('session_complete', 'Session Stopped', 'Operation stopped by user', 'warning');
            
            // TODO: Send stop command to ESP32
            console.log('Sending stop command to ESP32...');
          }
        }
      ]
    );
  };

  const handleComplete = () => {
    completeSession();
    addNotification('session_complete', 'Session Complete', 'Lawn mowing completed successfully', 'info');
    
    // TODO: Send completion acknowledgment to ESP32
    console.log('Session completed');
  };

  const getSessionStatus = (): 'idle' | 'mapping' | 'cutting' | 'paused' | 'completed' => {
    if (!currentSession) return 'idle';
    if (currentSession.status === 'interrupted') return 'paused';
    return currentSession.status as 'mapping' | 'cutting' | 'completed';
  };

  const currentDuration = currentSession ? 
    calculateSessionDuration(currentSession.startTime) : 0;

  const completionPercentage = currentSession ? 
    (currentSession.cuttingPath.length / Math.max(currentSession.mappingPath.length, 1)) * 100 : 0;

  return (
    <View style={styles.container}>
      <BrandHeader />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Control Panel */}
        <View style={styles.section}>
          <ControlPanel
            status={getSessionStatus()}
            onStart={handleStart}
            onPause={handlePause}
            onStop={handleStop}
            onReset={getSessionStatus() === 'completed' ? handleComplete : undefined}
            disabled={!connection.connected || !currentData}
          />
        </View>

        {/* Live Map */}
        <View style={styles.section}>
          <LiveMap
            mappingPath={currentSession?.mappingPath || []}
            cuttingPath={currentSession?.cuttingPath || []}
            currentPosition={null} // TODO: Get from real-time ESP32 data
            obstacles={currentSession?.obstacles || []}
            phase={currentSession?.status === 'mapping' ? 'mapping' : 
                   currentSession?.status === 'cutting' ? 'cutting' : 'completed'}
          />
        </View>

        {/* Session Progress */}
        {currentSession && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Session Progress</Text>
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressPercentage}>
                  {currentSession.status === 'cutting' ? completionPercentage.toFixed(1) : '0.0'}%
                </Text>
                <Text style={styles.progressText}>
                  {currentSession.status === 'mapping' ? 'Mapping' : 'Complete'}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${currentSession.status === 'cutting' ? completionPercentage : 0}%`,
                      backgroundColor: currentSession.status === 'mapping' ? COLORS.info : COLORS.success
                    }
                  ]} 
                />
              </View>
              <Text style={styles.progressSubtext}>
                Duration: {formatDuration(currentDuration)}
              </Text>
            </View>
          </View>
        )}

        {/* Session Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Statistics</Text>
          <View style={styles.statusGrid}>
            <StatusCard
              title="Area Mapped"
              value={formatArea(currentSession?.areaCovered || 0)}
              status="healthy"
              icon={<MapPin size={20} color={COLORS.success} />}
              compact
            />
            <StatusCard
              title="Duration"
              value={formatDuration(currentDuration)}
              status="healthy"
              icon={<Clock size={20} color={COLORS.info} />}
              compact
            />
            <StatusCard
              title="Battery"
              value={currentData ? `${currentData.batteryLevel.toFixed(0)}%` : '--'}
              status={currentData && currentData.batteryLevel < 20 ? 'error' : 
                     currentData && currentData.batteryLevel < 50 ? 'warning' : 'healthy'}
              icon={<Battery size={20} color={COLORS.success} />}
              compact
            />
            <StatusCard
              title="Temperature"
              value={currentData ? `${currentData.temperature.toFixed(1)}°C` : '--'}
              status={currentData && currentData.temperature > 35 ? 'warning' : 'healthy'}
              icon={<Thermometer size={20} color={COLORS.warning} />}
              compact
            />
          </View>
        </View>

        {/* Pre-operation Checklist */}
        {!currentSession && (
          <View style={styles.section}>
            <View style={styles.checklistCard}>
              <Text style={styles.checklistTitle}>Pre-operation Checklist</Text>
              <View style={styles.checklistItem}>
                <CheckCircle 
                  size={20} 
                  color={connection.connected ? COLORS.success : COLORS.gray400} 
                />
                <Text style={[
                  styles.checklistText,
                  { color: connection.connected ? COLORS.success : COLORS.gray400 }
                ]}>
                  Wi-Fi connection established
                </Text>
              </View>
              <View style={styles.checklistItem}>
                <CheckCircle 
                  size={20} 
                  color={currentData ? COLORS.success : COLORS.gray400} 
                />
                <Text style={[
                  styles.checklistText,
                  { color: currentData ? COLORS.success : COLORS.gray400 }
                ]}>
                  Sensor data available
                </Text>
              </View>
              <View style={styles.checklistItem}>
                <CheckCircle 
                  size={20} 
                  color={currentData && currentData.batteryLevel >= 15 ? COLORS.success : COLORS.gray400} 
                />
                <Text style={[
                  styles.checklistText,
                  { color: currentData && currentData.batteryLevel >= 15 ? COLORS.success : COLORS.gray400 }
                ]}>
                  Sufficient battery level (≥15%)
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Warnings */}
        {(!connection.connected || !currentData) && (
          <View style={styles.section}>
            <View style={styles.warningCard}>
              <AlertTriangle size={24} color={COLORS.warning} />
              <Text style={styles.warningText}>
                {!connection.connected ? 'Cart not connected. Please establish Wi-Fi connection first.' :
                 !currentData ? 'No sensor data available. Check cart connection.' :
                 'Unknown error occurred.'}
              </Text>
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
    marginBottom: SPACING.md,
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
  progressCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  progressHeader: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  progressPercentage: {
    fontSize: 36,
    fontFamily: TYPOGRAPHY.primaryBold,
    color: COLORS.success,
  },
  progressText: {
    fontSize: TYPOGRAPHY.base,
    fontFamily: TYPOGRAPHY.primary,
    color: COLORS.gray600,
    marginTop: 4,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.gray200,
    borderRadius: 4,
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressSubtext: {
    fontSize: TYPOGRAPHY.sm,
    fontFamily: TYPOGRAPHY.primary,
    color: COLORS.gray500,
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
  warningCard: {
    backgroundColor: COLORS.warning + '10',
    borderRadius: 12,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  warningText: {
    fontSize: TYPOGRAPHY.sm,
    fontFamily: TYPOGRAPHY.primary,
    color: COLORS.warning,
    marginLeft: SPACING.sm,
    flex: 1,
  },
});
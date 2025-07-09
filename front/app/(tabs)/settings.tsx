import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { BrandHeader } from '@/components/BrandHeader';
import { Bell, Wrench, Monitor, ChevronRight } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

export default function SettingsScreen() {
  const router = useRouter();

  const handleNotificationsPress = () => {
    // TODO: Navigate to notifications settings screen
    console.log('Navigate to notifications settings');
    // router.push('/settings/notifications');
  };

  const handleMaintenancePress = () => {
    // TODO: Navigate to maintenance settings screen
    console.log('Navigate to maintenance settings');
    // router.push('/settings/maintenance');
  };

  const handleSystemPress = () => {
    // TODO: Navigate to system settings screen
    console.log('Navigate to system settings');
    // router.push('/settings/system');
  };

  const settingsItems = [
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Manage notification preferences and alerts',
      icon: <Bell size={24} color={COLORS.warning} />,
      onPress: handleNotificationsPress,
    },
    {
      id: 'maintenance',
      title: 'Maintenance',
      subtitle: 'View and reset maintenance counters',
      icon: <Wrench size={24} color={COLORS.primary} />,
      onPress: handleMaintenancePress,
    },
    {
      id: 'system',
      title: 'System',
      subtitle: 'Diagnostic and connection information',
      icon: <Monitor size={24} color={COLORS.info} />,
      onPress: handleSystemPress,
    },
  ];

  return (
    <View style={styles.container}>
      <BrandHeader />
      
      <View style={styles.content}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>
          Configure your smart lawn mower system
        </Text>

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.settingsSection}>
            {settingsItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.settingItem}
                onPress={item.onPress}
              >
                <View style={styles.settingIcon}>
                  {item.icon}
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                  <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                </View>
                <ChevronRight size={20} color={COLORS.gray400} />
              </TouchableOpacity>
            ))}
          </View>

          {/* App Information */}
          <View style={styles.appInfoSection}>
            <View style={styles.appInfoCard}>
              <Text style={styles.appInfoTitle}>Jardinería Ornamental</Text>
              <Text style={styles.appInfoSubtitle}>Smart Lawn Mower Control</Text>
              <Text style={styles.appInfoVersion}>Version 1.0.0</Text>
              <Text style={styles.appInfoCopyright}>© 2024 Jardinería Ornamental</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY['2xl'],
    fontFamily: TYPOGRAPHY.primaryBold,
    color: COLORS.gray800,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.base,
    fontFamily: TYPOGRAPHY.primary,
    color: COLORS.gray600,
    marginBottom: SPACING.lg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.lg,
  },
  settingsSection: {
    marginBottom: SPACING.xl,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: TYPOGRAPHY.base,
    fontFamily: TYPOGRAPHY.primarySemiBold,
    color: COLORS.gray800,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: TYPOGRAPHY.sm,
    fontFamily: TYPOGRAPHY.primary,
    color: COLORS.gray500,
  },
  appInfoSection: {
    marginTop: SPACING.lg,
  },
  appInfoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  appInfoTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontFamily: TYPOGRAPHY.primaryBold,
    color: COLORS.primary,
    marginBottom: SPACING.xs / 2,
  },
  appInfoSubtitle: {
    fontSize: TYPOGRAPHY.base,
    fontFamily: TYPOGRAPHY.primaryMedium,
    color: COLORS.gray700,
    marginBottom: SPACING.sm,
  },
  appInfoVersion: {
    fontSize: TYPOGRAPHY.sm,
    fontFamily: TYPOGRAPHY.primary,
    color: COLORS.gray500,
    marginBottom: SPACING.xs,
  },
  appInfoCopyright: {
    fontSize: TYPOGRAPHY.xs,
    fontFamily: TYPOGRAPHY.primary,
    color: COLORS.gray400,
  },
});
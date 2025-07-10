import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BrandHeader } from '@/components/BrandHeader';
import { NotificationCard } from '@/components/NotificationCard';
import { useNotifications } from '@/hooks/useNotifications';
import { Trash2, Bell, BellOff } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

export default function NotificationsScreen() {
  const {
    notifications,
    dismissNotification,
    clearAllNotifications,
    getUnreadCount,
    generateSampleNotifications
  } = useNotifications();

  // Generar notificaciones de ejemplo al cargar por primera vez
  useEffect(() => {
    if (notifications.length === 0) {
      generateSampleNotifications();
    }
  }, [notifications.length, generateSampleNotifications]);

  const unreadCount = getUnreadCount();

  return (
    <View style={styles.container}>
      <BrandHeader />

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Notificaciones</Text>
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>

          {notifications.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearAllNotifications}
            >
              <Trash2 size={20} color={COLORS.error} />
              <Text style={styles.clearButtonText}>Borrar todas</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {notifications.length === 0 ? (
            <View style={styles.emptyState}>
              <BellOff size={48} color={COLORS.gray400} />
              <Text style={styles.emptyTitle}>Sin notificaciones</Text>
              <Text style={styles.emptySubtitle}>
                Aquí verás alertas sobre obstáculos, batería y mantenimiento
              </Text>
            </View>
          ) : (
            <View style={styles.notificationsList}>
              {notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onDismiss={dismissNotification}
                />
              ))}
            </View>
          )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: TYPOGRAPHY['2xl'],
    fontFamily: TYPOGRAPHY.primaryBold,
    color: COLORS.gray800,
  },
  badge: {
    backgroundColor: COLORS.error,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    marginLeft: SPACING.sm,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: TYPOGRAPHY.xs,
    fontFamily: TYPOGRAPHY.primaryBold,
    color: COLORS.white,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.error + '10',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  clearButtonText: {
    fontSize: TYPOGRAPHY.sm,
    fontFamily: TYPOGRAPHY.primaryMedium,
    color: COLORS.error,
    marginLeft: SPACING.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.lg,
  },
  notificationsList: {
    gap: SPACING.sm,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING['3xl'],
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.xl,
    fontFamily: TYPOGRAPHY.primarySemiBold,
    color: COLORS.gray600,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  emptySubtitle: {
    fontSize: TYPOGRAPHY.base,
    fontFamily: TYPOGRAPHY.primary,
    color: COLORS.gray500,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: SPACING.lg,
  },
});

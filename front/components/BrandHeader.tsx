// Componente para header
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { Image } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';

interface BrandHeaderProps {
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export function BrandHeader({ showBackButton = false, onBackPress }: BrandHeaderProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Botón opcional para volver */}
        {showBackButton && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <ChevronLeft color={COLORS.white} size={28} />
          </TouchableOpacity>
        )}

        <View style={styles.brandContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/icon.png')}
              style={{ width: 50, height: 50, resizeMode: 'contain' }}
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.brandName}>Jardinería Ornamental</Text>
            <Text style={styles.tagline}>Administración de carrito podador</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: BORDER_RADIUS.xl,
    borderBottomRightRadius: BORDER_RADIUS.xl,
  },
  container: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  backButton: {
    marginRight: SPACING.md,
    padding: SPACING.xs,
    borderRadius: 50,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
    ...SHADOWS.sm,
  },
  textContainer: {
    flex: 1,
  },
  brandName: {
    fontSize: TYPOGRAPHY.xl,
    fontFamily: TYPOGRAPHY.primaryBold,
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: TYPOGRAPHY.sm,
    fontFamily: TYPOGRAPHY.primary,
    color: COLORS.gray200,
    marginTop: 2,
    letterSpacing: 0.2,
  },
});

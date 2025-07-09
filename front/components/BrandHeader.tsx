import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { Image } from 'react-native';

interface BrandHeaderProps {
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export function BrandHeader({ showBackButton = false, onBackPress }: BrandHeaderProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.brandContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/icon.png')}
              style={{ width: 45, height: 45, resizeMode: 'contain' }}
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
  },
  container: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    ...SHADOWS.md,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  textContainer: {
    flex: 1,
  },
  brandName: {
    fontSize: TYPOGRAPHY['2xl'],
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
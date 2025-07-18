import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View, Image } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';

export default function NotFoundScreen() {
  return (
    <>
      {/* Sección de encabezado para la pantalla */}
      <Stack.Screen options={{ title: 'Oops!' }} />

      <View style={styles.container}>
        {/* Ilustración o icono */}
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.image}
        />

        <Text style={styles.title}>ERROR 404</Text>
        <Text style={styles.subtitle}>No deberías estar aquí…</Text>

        <Link href="/" style={styles.link}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Volver a la pantalla de inicio</Text>
          </View>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: SPACING.lg,
    resizeMode: 'contain',
  },
  title: {
    fontSize: TYPOGRAPHY['4xl'],
    fontFamily: TYPOGRAPHY.primaryBold,
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.lg,
    fontFamily: TYPOGRAPHY.primary,
    color: COLORS.gray600,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  link: {
    marginTop: SPACING.lg,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.sm,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.base,
    fontFamily: TYPOGRAPHY.primarySemiBold,
  },
});

// Jardinería Ornamental Brand Colors and Theme
export const COLORS = {
  // Primary brand colors - professional green palette
  primary: '#2D5016', // Deep forest green
  primaryLight: '#4A7C2A', // Medium green
  primaryDark: '#1A3009', // Very dark green
  
  // Secondary colors
  secondary: '#8B4513', // Earth brown
  secondaryLight: '#A0522D', // Light brown
  
  // Accent colors
  accent: '#228B22', // Forest green accent
  accentLight: '#32CD32', // Lime green for success states
  
  // Status colors
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Neutral colors
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  // Background colors
  background: '#F8FAF6', // Very light green tint
  surface: '#FFFFFF',
  surfaceSecondary: '#F3F6F0', // Light green tint
};

export const TYPOGRAPHY = {
  // Font families
  primary: 'Inter-Regular',
  primaryBold: 'Inter-Bold',
  primarySemiBold: 'Inter-SemiBold',
  primaryMedium: 'Inter-Medium',
  
  // Font sizes
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
};
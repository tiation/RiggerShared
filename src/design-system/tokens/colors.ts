/**
 * RiggerConnect Design System - Color Tokens
 * Unified color palette for mobile and web platforms
 * 
 * 🏗️ ChaseWhiteRabbit NGO Initiative
 */

export interface ColorTokens {
  primary: {
    cyan: string;
    magenta: string;
    gradient: string;
    hover: {
      cyan: string;
      magenta: string;
    };
  };
  background: {
    primary: string;
    surface: string;
    elevated: string;
    overlay: string;
  };
  text: {
    primary: string;
    secondary: string;
    accent: string;
    disabled: string;
    inverse: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  border: {
    primary: string;
    secondary: string;
    focus: string;
    error: string;
  };
  semantic: {
    rigger: string;
    employer: string;
    job: string;
    skill: string;
  };
}

export const colors: ColorTokens = {
  primary: {
    cyan: '#00FFFF',
    magenta: '#FF00FF',
    gradient: 'linear-gradient(135deg, #00FFFF 0%, #FF00FF 100%)',
    hover: {
      cyan: '#00E6E6',
      magenta: '#E600E6',
    },
  },
  background: {
    primary: '#0D0D0D',
    surface: '#1A1A1A',
    elevated: '#2A2A2A',
    overlay: 'rgba(13, 13, 13, 0.8)',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#B3B3B3',
    accent: '#00FFFF',
    disabled: '#666666',
    inverse: '#0D0D0D',
  },
  status: {
    success: '#00FF88',
    warning: '#FFB800',
    error: '#FF3366',
    info: '#0099FF',
  },
  border: {
    primary: '#333333',
    secondary: '#4D4D4D',
    focus: '#00FFFF',
    error: '#FF3366',
  },
  semantic: {
    rigger: '#00FFFF',
    employer: '#FF00FF',
    job: '#00FF88',
    skill: '#FFB800',
  },
};

export const colorVariants = {
  light: {
    ...colors,
    background: {
      primary: '#FFFFFF',
      surface: '#F5F5F5',
      elevated: '#E0E0E0',
      overlay: 'rgba(255, 255, 255, 0.9)',
    },
    text: {
      primary: '#0D0D0D',
      secondary: '#666666',
      accent: '#0066CC',
      disabled: '#B3B3B3',
      inverse: '#FFFFFF',
    },
  },
  highContrast: {
    ...colors,
    primary: {
      cyan: '#FFFFFF',
      magenta: '#FFFFFF',
      gradient: 'linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 100%)',
      hover: {
        cyan: '#E6E6E6',
        magenta: '#E6E6E6',
      },
    },
    border: {
      primary: '#FFFFFF',
      secondary: '#FFFFFF',
      focus: '#FFFFFF',
      error: '#FFFFFF',
    },
  },
};

// Platform-specific color utilities
export const platformColors = {
  ios: {
    systemBlue: '#007AFF',
    systemGreen: '#34C759',
    systemRed: '#FF3B30',
    systemYellow: '#FFCC00',
    systemBackground: colors.background.primary,
    secondarySystemBackground: colors.background.surface,
  },
  android: {
    colorPrimary: colors.primary.cyan,
    colorPrimaryVariant: colors.primary.hover.cyan,
    colorSecondary: colors.primary.magenta,
    colorSecondaryVariant: colors.primary.hover.magenta,
    colorBackground: colors.background.primary,
    colorSurface: colors.background.surface,
    colorError: colors.status.error,
  },
  web: {
    cssCustomProperties: {
      '--color-primary-cyan': colors.primary.cyan,
      '--color-primary-magenta': colors.primary.magenta,
      '--color-background-primary': colors.background.primary,
      '--color-background-surface': colors.background.surface,
      '--color-text-primary': colors.text.primary,
      '--color-text-secondary': colors.text.secondary,
    },
  },
};

export default colors;

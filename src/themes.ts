export type ThemeName = 'duolingo' | 'glassmorphism' | 'minimal' | 'neon' | 'pastel';

export interface Theme {
  id: ThemeName;
  name: string;
  description: string;
  
  // Border and radius
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    button: string;
    card: string;
  };
  
  // Shadows
  shadows: {
    sm: string;
    md: string;
    lg: string;
    button: string;
    card: string;
    elevated: string;
  };
  
  // Surface styles
  surfaces: {
    backdrop: string;
    card: string;
    button: string;
    input: string;
  };
  
  // Typography
  typography: {
    fontFamily: string;
    headingWeight: string;
    bodyWeight: string;
    buttonTransform: string;
  };
  
  // Effects
  effects: {
    blur: string;
    transition: string;
    buttonStyle: 'flat' | '3d' | 'outline' | 'glow' | 'soft';
  };
}

export const themes: Record<ThemeName, Theme> = {
  duolingo: {
    id: 'duolingo',
    name: 'Duolingo',
    description: 'Redondeado y amigable con botones 3D chunky',
    borderRadius: {
      sm: '6px',
      md: '12px',
      lg: '16px',
      xl: '24px',
      button: '14px',
      card: '16px',
    },
    shadows: {
      sm: '0 2px 4px rgba(0,0,0,0.1)',
      md: '0 4px 8px rgba(0,0,0,0.12)',
      lg: '0 8px 16px rgba(0,0,0,0.15)',
      button: '0 4px 0 rgba(0,0,0,0.15)',
      card: '0 4px 0 var(--border)',
      elevated: '0 8px 24px rgba(0,0,0,0.15)',
    },
    surfaces: {
      backdrop: 'solid',
      card: 'solid',
      button: 'solid-3d',
      input: 'solid',
    },
    typography: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      headingWeight: '700',
      bodyWeight: '500',
      buttonTransform: 'none',
    },
    effects: {
      blur: 'none',
      transition: 'all 0.15s ease',
      buttonStyle: '3d',
    },
  },
  
  glassmorphism: {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    description: 'Cristal esmerilado con blur y transparencias',
    borderRadius: {
      sm: '8px',
      md: '16px',
      lg: '20px',
      xl: '28px',
      button: '12px',
      card: '20px',
    },
    shadows: {
      sm: '0 4px 6px rgba(0,0,0,0.05), 0 2px 12px rgba(0,0,0,0.08)',
      md: '0 8px 16px rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.1)',
      lg: '0 12px 24px rgba(0,0,0,0.08), 0 6px 32px rgba(0,0,0,0.12)',
      button: '0 4px 12px rgba(0,0,0,0.08)',
      card: '0 8px 32px rgba(0,0,0,0.12)',
      elevated: '0 16px 48px rgba(0,0,0,0.15)',
    },
    surfaces: {
      backdrop: 'gradient',
      card: 'glass',
      button: 'glass',
      input: 'glass',
    },
    typography: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      headingWeight: '600',
      bodyWeight: '400',
      buttonTransform: 'none',
    },
    effects: {
      blur: 'blur(12px)',
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      buttonStyle: 'soft',
    },
  },
  
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Limpio y espacioso con líneas sutiles',
    borderRadius: {
      sm: '4px',
      md: '6px',
      lg: '8px',
      xl: '12px',
      button: '6px',
      card: '8px',
    },
    shadows: {
      sm: '0 1px 2px rgba(0,0,0,0.05)',
      md: '0 2px 4px rgba(0,0,0,0.06)',
      lg: '0 4px 8px rgba(0,0,0,0.08)',
      button: '0 1px 2px rgba(0,0,0,0.08)',
      card: '0 2px 6px rgba(0,0,0,0.06)',
      elevated: '0 8px 16px rgba(0,0,0,0.1)',
    },
    surfaces: {
      backdrop: 'solid',
      card: 'minimal',
      button: 'minimal',
      input: 'minimal',
    },
    typography: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      headingWeight: '600',
      bodyWeight: '400',
      buttonTransform: 'none',
    },
    effects: {
      blur: 'none',
      transition: 'all 0.15s ease-out',
      buttonStyle: 'flat',
    },
  },
  
  neon: {
    id: 'neon',
    name: 'Neon Cyber',
    description: 'Oscuro con acentos neón brillantes',
    borderRadius: {
      sm: '2px',
      md: '4px',
      lg: '6px',
      xl: '8px',
      button: '4px',
      card: '6px',
    },
    shadows: {
      sm: '0 0 8px rgba(139, 92, 246, 0.3)',
      md: '0 0 16px rgba(139, 92, 246, 0.4)',
      lg: '0 0 24px rgba(139, 92, 246, 0.5)',
      button: '0 0 12px currentColor, 0 2px 4px rgba(0,0,0,0.5)',
      card: '0 0 16px rgba(139, 92, 246, 0.2), 0 4px 8px rgba(0,0,0,0.6)',
      elevated: '0 0 32px rgba(139, 92, 246, 0.4)',
    },
    surfaces: {
      backdrop: 'dark-gradient',
      card: 'dark',
      button: 'neon',
      input: 'dark',
    },
    typography: {
      fontFamily: 'system-ui, -apple-system, monospace',
      headingWeight: '700',
      bodyWeight: '500',
      buttonTransform: 'uppercase',
    },
    effects: {
      blur: 'none',
      transition: 'all 0.2s ease',
      buttonStyle: 'glow',
    },
  },
  
  pastel: {
    id: 'pastel',
    name: 'Pastel Notebook',
    description: 'Suave y acogedor como un cuaderno',
    borderRadius: {
      sm: '3px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      button: '8px',
      card: '12px',
    },
    shadows: {
      sm: '2px 2px 4px rgba(0,0,0,0.08)',
      md: '3px 3px 8px rgba(0,0,0,0.1)',
      lg: '4px 4px 12px rgba(0,0,0,0.12)',
      button: '2px 2px 6px rgba(0,0,0,0.1)',
      card: '3px 3px 10px rgba(0,0,0,0.1)',
      elevated: '4px 4px 16px rgba(0,0,0,0.15)',
    },
    surfaces: {
      backdrop: 'paper',
      card: 'paper',
      button: 'paper',
      input: 'paper',
    },
    typography: {
      fontFamily: 'system-ui, -apple-system, "Comic Sans MS", cursive, sans-serif',
      headingWeight: '600',
      bodyWeight: '400',
      buttonTransform: 'none',
    },
    effects: {
      blur: 'none',
      transition: 'all 0.2s ease',
      buttonStyle: 'soft',
    },
  },
};

export function getTheme(name: ThemeName): Theme {
  return themes[name];
}

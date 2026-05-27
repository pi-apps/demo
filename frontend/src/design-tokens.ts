/**
 * Design tokens extracted from legacy CSS (main.css, homepage.css).
 * Organized as CSS custom properties for easy use in Tailwind, CSS modules, or inline styles.
 * Usage: import and apply via style={{ '--primary': colors.primary } as React.CSSProperties}
 */

export const colors = {
  primary: '#7d3cff',      // Main purple (buttons, accents, icons)
  primaryDark: '#5f2bd6',
  gold: '#f5c400',          // CTA gradient start
  goldLight: '#ffdd55',     // CTA gradient end
  darkBg: '#0b0f1a',        // Hero/dark sections
  darkCard: '#111',         // Cards in dark mode
  lightBg: '#ffffff',       // Main backgrounds
  lightCard: '#fff',        // Light cards
  grayDark: '#131b31',      // Headings
  grayMed: '#4b5368',       // Body text
  grayLight: '#d4d8e4',     // Secondary text
  borderLight: '#e6eaf5',   // Borders
  pillBg: '#f0e9ff',        // Purple pills
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '30px',
  '4xl': '32px',
  '5xl': '40px',
  hero: '72px',
} as const;

export const radius = {
  sm: '6px',
  md: '12px',
  lg: '14px',
  xl: '16px',
  pill: '30px',
  full: '50px',
  circle: '999px',
} as const;

export const shadows = {
  card: '0 12px 28px rgba(17, 22, 39, 0.07)',
  hover: '0 12px 30px rgba(17, 22, 39, 0.09)',
  dark: '0 20px 45px rgba(0, 0, 0, 0.35)',
  glow: '0 0 15px #7d3cff',
} as const;

export const typography = {
  hero: 'clamp(34px, 5vw, 56px)',
  section: 'clamp(28px, 4vw, 40px)',
  cardTitle: '20px',
  body: '15px-17px',
} as const;

// CSS variables string for global :root injection
export const cssVariables = `
  :root {
    /* Colors */
    --color-primary: ${colors.primary};
    --color-gold: ${colors.gold};
    --color-dark-bg: ${colors.darkBg};
    --color-light-bg: ${colors.lightBg};
    --color-gray-dark: ${colors.grayDark};
    --color-gray-med: ${colors.grayMed};
    --color-text-light: ${colors.grayLight};
    
    /* Spacing */
    --space-xs: ${spacing.xs};
    --space-md: ${spacing.md};
    --space-xl: ${spacing.xl};
    --space-3xl: ${spacing['3xl']};
    
    /* Radius */
    --radius-md: ${radius.md};
    --radius-xl: ${radius.xl};
    --radius-circle: ${radius.circle};
    
    /* Shadows */
    --shadow-card: ${shadows.card};
    --shadow-hover: ${shadows.hover};
  }
` as const;


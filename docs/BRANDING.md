# CBK Racing - Brand Guidelines

## Overview

Il brand CBK Racing rappresenta l'eccellenza nel mondo del karting professionale. Il design system è ispirato alla velocità, precisione e tecnologia avanzata del motorsport moderno.

## 🎨 Color Palette

### Primary Colors

```css
/* Racing Red - Passione e velocità */
--racing-red: #e10600
--racing-red-light: #ff1f0f
--racing-red-dark: #b50500

/* Carbon Black - Tecnologia e precisione */
--racing-black: #000000
--racing-carbon: #1a1a1a
--racing-charcoal: #2d2d2d

/* Pure White - Purezza e contrasto */
--racing-white: #ffffff
--racing-pearl: #fafafa
```

### Neutral Grays

```css
/* Aluminum - Materiali racing */
--racing-gray-50: #f8fafc   /* Lightest - backgrounds */
--racing-gray-100: #f1f5f9  /* Very light - cards */
--racing-gray-200: #e2e8f0  /* Light - borders */
--racing-gray-300: #cbd5e1  /* Medium light - disabled */
--racing-gray-400: #94a3b8  /* Medium - placeholders */
--racing-gray-500: #64748b  /* Base - text secondary */
--racing-gray-600: #475569  /* Dark - text primary */
--racing-gray-700: #334155  /* Darker - headings */
--racing-gray-800: #1e293b  /* Very dark - headers */
--racing-gray-900: #0f172a  /* Darkest - high contrast */
```

### Accent Colors

```css
/* Victory Gold - Successi e premi */
--racing-gold: #ffd700
--racing-gold-light: #ffed4e
--racing-gold-dark: #ccac00

/* Speed Blue - Tecnologia e innovazione */
--racing-blue: #0066cc
--racing-blue-light: #3399ff
--racing-blue-dark: #004499

/* Warning Orange - Attenzione e sicurezza */
--racing-orange: #ff6600
--racing-orange-light: #ff8533
--racing-orange-dark: #cc5200
```

## 📝 Typography

### Font Stack

```css
/* Primary - Geist Sans (Modern, Technical) */
font-family: var(--font-geist-sans), system-ui, -apple-system, sans-serif;

/* Monospace - Geist Mono (Timings, Technical Data) */
font-family: var(--font-geist-mono), 'Fira Code', 'JetBrains Mono', monospace;
```

### Type Scale

```css
/* Display - Hero sections */
--text-display: 4rem;     /* 64px - Major headlines */
--text-display-sm: 3rem;  /* 48px - Section titles */

/* Headlines */
--text-4xl: 2.5rem;       /* 40px - Page titles */
--text-3xl: 2rem;         /* 32px - Component titles */
--text-2xl: 1.5rem;       /* 24px - Card titles */
--text-xl: 1.25rem;       /* 20px - Subheadings */

/* Body Text */
--text-lg: 1.125rem;      /* 18px - Large body */
--text-base: 1rem;        /* 16px - Default body */
--text-sm: 0.875rem;      /* 14px - Small text */
--text-xs: 0.75rem;       /* 12px - Captions */
```

### Font Weights

```css
--font-light: 300;        /* Light - Subtle text */
--font-normal: 400;       /* Normal - Body text */
--font-medium: 500;       /* Medium - Emphasis */
--font-semibold: 600;     /* Semibold - Subheadings */
--font-bold: 700;         /* Bold - Headlines */
--font-extrabold: 800;    /* Extra bold - Display */
--font-black: 900;        /* Black - Maximum impact */
```

### Racing Typography Rules

1. **Headlines**: Always bold (700+), high contrast
2. **Racing Numbers**: Monospace font, extra bold
3. **Technical Data**: Monospace, consistent alignment
4. **Body Text**: Medium weight (500) for readability
5. **Captions**: Light weight (300-400) for subtlety

## 📏 Spacing System

### Base Unit: 4px

```css
/* Micro Spacing */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */

/* Standard Spacing */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */

/* Large Spacing */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
--space-32: 8rem;     /* 128px */
```

### Grid System

```css
/* Container Widths */
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;

/* Grid Gaps */
--gap-grid-tight: 1rem;   /* 16px - Cards */
--gap-grid-normal: 1.5rem; /* 24px - Standard */
--gap-grid-relaxed: 2rem;  /* 32px - Sections */
--gap-grid-loose: 3rem;    /* 48px - Major sections */
```

## 🎬 Motion Design

### Timing Functions (Easing)

```css
/* Racing-inspired easing curves */
--ease-out-racing: cubic-bezier(0.16, 1, 0.3, 1);        /* Fast start, smooth end */
--ease-in-racing: cubic-bezier(0.4, 0, 0.6, 1);          /* Smooth start, fast end */
--ease-inout-racing: cubic-bezier(0.4, 0, 0.2, 1);       /* Balanced acceleration */
--ease-bounce-racing: cubic-bezier(0.68, -0.55, 0.265, 1.55); /* Energetic bounce */
```

### Duration Scale

```css
/* Micro Interactions */
--duration-instant: 50ms;    /* Button states */
--duration-fast: 150ms;      /* Hover effects */
--duration-normal: 200ms;    /* Standard transitions */
--duration-smooth: 300ms;    /* Modal opens */

/* Macro Interactions */
--duration-slow: 500ms;      /* Page transitions */
--duration-slower: 750ms;    /* Complex animations */
--duration-crawl: 1000ms;    /* Hero animations */
```

### Animation Principles

1. **Speed**: Animazioni veloci come le auto da corsa
2. **Precision**: Movimenti precisi e controllati
3. **Anticipation**: Feedback immediato per interactions
4. **Stagger**: Effetti sequenziali per gruppi di elementi
5. **Physics**: Simulare accelerazione e decelerazione realistiche

### Common Patterns

```css
/* Hover Lift Effect */
.racing-lift {
  transition: transform var(--duration-fast) var(--ease-out-racing);
}
.racing-lift:hover {
  transform: translateY(-2px);
}

/* Racing Scale Effect */
.racing-scale {
  transition: transform var(--duration-fast) var(--ease-inout-racing);
}
.racing-scale:hover {
  transform: scale(1.02);
}

/* Slide In Effect */
.racing-slide-in {
  transform: translateX(-20px);
  opacity: 0;
  transition: all var(--duration-smooth) var(--ease-out-racing);
}
.racing-slide-in.visible {
  transform: translateX(0);
  opacity: 1;
}
```

## 📱 Responsive Breakpoints

### Mobile-First Approach

```css
/* Base: Mobile (0px+) */
/* xs: Extra small phones */

/* sm: Small phones */
@media (min-width: 640px) { /* 40em */ }

/* md: Tablets */
@media (min-width: 768px) { /* 48em */ }

/* lg: Small laptops */
@media (min-width: 1024px) { /* 64em */ }

/* xl: Desktops */
@media (min-width: 1280px) { /* 80em */ }

/* 2xl: Large desktops */
@media (min-width: 1536px) { /* 96em */ }
```

### Racing-Specific Breakpoints

```css
/* Racing Data Tables */
@media (min-width: 480px) { /* Show more columns */ }
@media (min-width: 900px) { /* Full race data view */ }

/* Hero Sections */
@media (min-width: 1200px) { /* Cinematic hero */ }
@media (min-width: 1600px) { /* Ultra-wide support */ }
```

## 🎯 Component Guidelines

### Cards

```css
/* Card Elevation */
--shadow-card: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
--shadow-card-hover: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);

/* Card Border Radius */
--radius-card: 8px;
--radius-card-lg: 12px;
```

### Buttons

```css
/* Button Heights */
--btn-sm: 32px;
--btn-md: 40px;
--btn-lg: 48px;
--btn-xl: 56px;

/* Button Padding */
--btn-px-sm: 12px;
--btn-px-md: 16px;
--btn-px-lg: 24px;
--btn-px-xl: 32px;
```

### Racing-Specific Elements

```css
/* Position Numbers */
.position-number {
  font-family: var(--font-geist-mono);
  font-weight: var(--font-black);
  font-size: var(--text-2xl);
  line-height: 1;
}

/* Racing Times */
.racing-time {
  font-family: var(--font-geist-mono);
  font-weight: var(--font-semibold);
  letter-spacing: 0.025em;
}

/* Speed Indicators */
.speed-indicator {
  background: linear-gradient(90deg, var(--racing-red), var(--racing-orange));
  animation: pulse 2s infinite;
}
```

## 🏁 Racing Visual Language

### Iconography

- **Lines**: Sottili e precise come telemetrie F1
- **Corners**: Arrotondati ma decisi (4-8px radius)
- **Stroke Width**: 1.5-2px per chiarezza
- **Style**: Outline per leggerezza, filled per enfasi

### Patterns

- **Speed Lines**: Linee diagonali per movimento
- **Gradients**: Effetti metallici e riflessi
- **Textures**: Carbon fiber sottile per accenti premium
- **Shadows**: Drop shadows per profondità e velocità

### Visual Hierarchy

1. **Primary**: Racing red per azioni principali
2. **Secondary**: Gray scale per supporto
3. **Accent**: Gold per achievements e premi
4. **Danger**: Orange per warnings e attenzione

## 📐 Layout Principles

### Grid Philosophy

- **Precision**: Allineamenti perfetti come in pista
- **Rhythm**: Spaziature consistenti e prevedibili
- **Balance**: Asimmetria controllata per dinamismo
- **Focus**: Gerarchia chiara per guidare l'attenzione

### Content Strategy

- **Headlines**: Impatto immediato, messaggi chiari
- **Body**: Informazioni tecniche precise e leggibili
- **Calls-to-Action**: Azioni chiare e dirette
- **Data**: Visualizzazione racing-style per numeri e statistiche

---

**Ultima revisione**: Dicembre 2024
**Prossimo aggiornamento**: Trimestrale o su richiesta team

*"Velocità, precisione, eccellenza - ogni dettaglio conta in pista e nel design."*
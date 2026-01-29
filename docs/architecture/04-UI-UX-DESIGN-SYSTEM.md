# KDCA Platform - UI/UX Design System

## Document Version: 1.0 | Date: 2026-01-27

---

## 1. DESIGN PHILOSOPHY

### Vision Statement
Create a world-class digital experience that embodies the elegance, strategy, and prestige of chess while being accessible, modern, and youth-friendly. The platform should feel like it represents the future of chess in India.

### Core Principles

1. **Player-First Experience**
   - Every design decision prioritizes the player journey
   - Quick access to registration, tournaments, and results
   - Mobile-optimized for on-the-go access

2. **Chess-Inspired Elegance**
   - Subtle chess motifs (not overwhelming)
   - Strategic use of black & white with accent colors
   - Clean grid layouts inspired by chessboard patterns

3. **Modern & International**
   - Contemporary design language
   - No cluttered government-website aesthetics
   - Premium feel that rivals international federations

4. **Accessible & Inclusive**
   - WCAG 2.1 AA compliance
   - Support for multiple age groups
   - Tamil language support (future)

5. **Performance-Focused**
   - Fast load times (<3 seconds)
   - Smooth animations (60fps)
   - Offline-capable core features

---

## 2. COLOR SYSTEM

### Primary Palette

```css
/* Brand Colors - Derived from KDCA Logo */
:root {
  /* Primary - Teal/Cyan (from logo outer ring) */
  --color-primary-50: #ecfeff;
  --color-primary-100: #cffafe;
  --color-primary-200: #a5f3fc;
  --color-primary-300: #67e8f9;
  --color-primary-400: #22d3ee;
  --color-primary-500: #06b6d4;  /* Main brand teal */
  --color-primary-600: #0891b2;
  --color-primary-700: #0e7490;
  --color-primary-800: #155e75;
  --color-primary-900: #164e63;

  /* Secondary - Amber/Gold (from logo accent) */
  --color-secondary-50: #fffbeb;
  --color-secondary-100: #fef3c7;
  --color-secondary-200: #fde68a;
  --color-secondary-300: #fcd34d;
  --color-secondary-400: #fbbf24;
  --color-secondary-500: #f59e0b;  /* Gold accent */
  --color-secondary-600: #d97706;
  --color-secondary-700: #b45309;
  --color-secondary-800: #92400e;
  --color-secondary-900: #78350f;

  /* Neutral - Chess-inspired grays */
  --color-neutral-50: #fafafa;
  --color-neutral-100: #f4f4f5;
  --color-neutral-200: #e4e4e7;
  --color-neutral-300: #d4d4d8;
  --color-neutral-400: #a1a1aa;
  --color-neutral-500: #71717a;
  --color-neutral-600: #52525b;
  --color-neutral-700: #3f3f46;
  --color-neutral-800: #27272a;
  --color-neutral-900: #18181b;
  --color-neutral-950: #09090b;  /* Near black */
}
```

### Semantic Colors

```css
:root {
  /* Success - Greens */
  --color-success-light: #dcfce7;
  --color-success: #22c55e;
  --color-success-dark: #15803d;

  /* Warning - Oranges */
  --color-warning-light: #fef3c7;
  --color-warning: #f59e0b;
  --color-warning-dark: #b45309;

  /* Error - Reds */
  --color-error-light: #fee2e2;
  --color-error: #ef4444;
  --color-error-dark: #b91c1c;

  /* Info - Blues */
  --color-info-light: #dbeafe;
  --color-info: #3b82f6;
  --color-info-dark: #1d4ed8;
}
```

### Dark Mode (Future)

```css
.dark {
  --bg-primary: #09090b;
  --bg-secondary: #18181b;
  --bg-tertiary: #27272a;
  --text-primary: #fafafa;
  --text-secondary: #a1a1aa;
}
```

### Color Usage Guidelines

| Use Case | Color | Token |
|----------|-------|-------|
| Primary buttons, links | Teal 500 | `primary-500` |
| Hover states | Teal 600 | `primary-600` |
| Highlights, badges | Gold 500 | `secondary-500` |
| Body text | Neutral 900 | `neutral-900` |
| Secondary text | Neutral 600 | `neutral-600` |
| Borders | Neutral 200 | `neutral-200` |
| Backgrounds | White / Neutral 50 | `white` / `neutral-50` |
| Card backgrounds | White | `white` |
| Chess black squares | Neutral 800 | `neutral-800` |
| Chess white squares | Neutral 100 | `neutral-100` |

---

## 3. TYPOGRAPHY

### Font Stack

```css
:root {
  /* Primary - Headings */
  --font-heading: 'Inter', 'SF Pro Display', -apple-system, sans-serif;

  /* Secondary - Body */
  --font-body: 'Inter', 'SF Pro Text', -apple-system, sans-serif;

  /* Monospace - Data, IDs */
  --font-mono: 'JetBrains Mono', 'SF Mono', Consolas, monospace;
}
```

### Type Scale

```css
:root {
  /* Font Sizes */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
  --text-5xl: 3rem;        /* 48px */
  --text-6xl: 3.75rem;     /* 60px */
  --text-7xl: 4.5rem;      /* 72px */

  /* Line Heights */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;

  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
}
```

### Typography Styles

| Element | Size | Weight | Line Height | Use Case |
|---------|------|--------|-------------|----------|
| Display | 7xl (72px) | Extrabold | Tight | Hero headlines |
| H1 | 5xl (48px) | Bold | Tight | Page titles |
| H2 | 4xl (36px) | Bold | Tight | Section headers |
| H3 | 2xl (24px) | Semibold | Snug | Card titles |
| H4 | xl (20px) | Semibold | Snug | Subsections |
| Body Large | lg (18px) | Normal | Relaxed | Lead paragraphs |
| Body | base (16px) | Normal | Normal | Main content |
| Body Small | sm (14px) | Normal | Normal | Secondary text |
| Caption | xs (12px) | Medium | Normal | Labels, hints |
| KDCA ID | base | Medium (mono) | None | Player IDs |

---

## 4. SPACING SYSTEM

### Base Unit: 4px

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
  --space-32: 8rem;     /* 128px */
}
```

### Layout Spacing

| Context | Spacing | Token |
|---------|---------|-------|
| Page padding (mobile) | 16px | `space-4` |
| Page padding (desktop) | 32px | `space-8` |
| Section gap | 80px | `space-20` |
| Card padding | 24px | `space-6` |
| Card gap | 24px | `space-6` |
| Form field gap | 16px | `space-4` |
| Button padding | 12px 24px | `space-3 space-6` |

---

## 5. LAYOUT GRID

### Container Widths

```css
:root {
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1536px;
  --container-max: 1440px;  /* Max content width */
}
```

### Grid System

- **12-column grid** for complex layouts
- **Gutter**: 24px (desktop), 16px (mobile)
- **Breakpoints**:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
  - `2xl`: 1536px

### Chess-Inspired Grid Patterns

```css
/* 8x8 subtle background pattern for sections */
.chess-pattern {
  background-image:
    linear-gradient(45deg, var(--neutral-100) 25%, transparent 25%),
    linear-gradient(-45deg, var(--neutral-100) 25%, transparent 25%);
  background-size: 60px 60px;
  opacity: 0.3;
}
```

---

## 6. COMPONENT LIBRARY

### 6.1 Buttons

#### Primary Button
```
┌─────────────────────────┐
│     Register Now        │  ← Teal background, white text
└─────────────────────────┘
   Padding: 12px 24px
   Border-radius: 8px
   Font: 16px Semibold
   Hover: Darker teal (600)
   Active: Even darker (700)
```

#### Secondary Button
```
┌─────────────────────────┐
│     Learn More          │  ← White bg, teal border, teal text
└─────────────────────────┘
   Border: 2px solid teal
```

#### Ghost Button
```
     View All →             ← No background, teal text
   Hover: Light teal bg
```

#### Button Sizes
- **Small**: 32px height, 14px font
- **Medium**: 40px height, 16px font (default)
- **Large**: 48px height, 18px font

### 6.2 Cards

#### Standard Card
```
┌──────────────────────────────────┐
│  ┌────────────────────────────┐  │
│  │        [IMAGE]             │  │
│  └────────────────────────────┘  │
│                                  │
│  CATEGORY                        │  ← Teal, uppercase, 12px
│  Card Title Here                 │  ← 20px, Semibold
│  Short description text that    │  ← 14px, Neutral 600
│  gives context about the card.  │
│                                  │
│  ┌──────┐                        │
│  │ CTA  │                        │
│  └──────┘                        │
└──────────────────────────────────┘
   Shadow: subtle (0 4px 6px rgba)
   Border-radius: 12px
   Hover: Lift effect + shadow
```

#### Player Card
```
┌──────────────────────────────────┐
│     ┌──────────┐                 │
│     │  PHOTO   │   Rahul Kumar   │  ← 18px, Semibold
│     │  (80px)  │   001KKI2026    │  ← Mono, Teal
│     └──────────┘                 │
│                                  │
│     Rating: 1250                 │
│     Taluk: Kallakurichi          │
│                                  │
│  ┌─────────────────────────────┐ │
│  │      View Profile           │ │
│  └─────────────────────────────┘ │
└──────────────────────────────────┘
```

#### Tournament Card
```
┌──────────────────────────────────┐
│  🏆  DISTRICT                    │  ← Badge: Gold bg
│                                  │
│  KDCA Rapid Championship 2026    │  ← 20px, Bold
│                                  │
│  📅  March 1-2, 2026             │
│  📍  Town Hall, Kallakurichi     │
│  👥  85/200 registered           │  ← Progress bar
│                                  │
│  ┌─────────────────────────────┐ │
│  │     Register Now  →         │ │  ← Primary button
│  └─────────────────────────────┘ │
└──────────────────────────────────┘
```

### 6.3 Office Bearer Card
```
┌──────────────────────────────────┐
│        ┌──────────────┐          │
│        │              │          │
│        │    PHOTO     │          │
│        │   (120px)    │          │
│        │              │          │
│        └──────────────┘          │
│                                  │
│          Dr. John Doe            │  ← 18px, Semibold
│           PRESIDENT              │  ← 12px, Teal, uppercase
│                                  │
│        📞 +91 98765 43210        │
│        ✉️  john@email.com        │
└──────────────────────────────────┘
   Hover: Scale 1.02
```

### 6.4 Stat Cards
```
┌─────────────────┐
│                 │
│      1,250      │  ← 48px, Bold, Teal
│     Players     │  ← 14px, Neutral 600
│                 │
└─────────────────┘
   Background: Light teal gradient
```

### 6.5 Navigation

#### Desktop Header
```
┌────────────────────────────────────────────────────────────────────────┐
│  [LOGO]  Home  About  Tournaments  Associations  Academies  Contact    │
│                                                    [Login] [Register]  │
└────────────────────────────────────────────────────────────────────────┘
   Height: 72px
   Shadow on scroll
   Sticky
```

#### Mobile Header
```
┌────────────────────────────────────────────┐
│  [LOGO]                              [≡]   │
└────────────────────────────────────────────┘
   [≡] Opens full-screen slide menu
```

### 6.6 Forms

#### Input Field
```
┌──────────────────────────────────┐
│  Email Address *                 │  ← Label: 14px, Semibold
├──────────────────────────────────┤
│  placeholder@example.com         │  ← Input: 16px
└──────────────────────────────────┘
   Helper text or error below       ← 12px, Error red if invalid

   Border: 1px Neutral 300
   Focus: 2px Teal ring
   Error: Red border + message
   Border-radius: 8px
   Height: 44px
```

#### Select Field
```
┌──────────────────────────────────┐
│  Select Taluk           ▼       │
└──────────────────────────────────┘
   Custom dropdown with search
```

### 6.7 Tables

#### Data Table
```
┌────────────────────────────────────────────────────────────────────┐
│  KDCA ID    │  Name           │  Taluk        │  Status  │ Action │
├────────────────────────────────────────────────────────────────────┤
│  001KKI2026 │  Rahul Kumar    │  Kallakurichi │  Active  │ [View] │
│  002CHI2026 │  Priya Singh    │  Chinnasalem  │  Active  │ [View] │
└────────────────────────────────────────────────────────────────────┘
   Striped rows (alternate Neutral 50)
   Hover: Light teal background
   Sortable headers
   Pagination below
```

### 6.8 Badges & Tags

```
┌─────────┐  ┌─────────────┐  ┌─────────────┐
│ ACTIVE  │  │  DISTRICT   │  │  ₹ 200      │
└─────────┘  └─────────────┘  └─────────────┘
  Green bg     Gold bg         Neutral bg
```

### 6.9 Alerts & Notifications

```
┌──────────────────────────────────────────────────────────────────┐
│  ✓  Registration successful! Your KDCA ID is 001KKI2026         │
└──────────────────────────────────────────────────────────────────┘
   Success: Green left border, light green bg
   Warning: Amber left border, light amber bg
   Error: Red left border, light red bg
   Info: Blue left border, light blue bg
```

---

## 7. HOMEPAGE LAYOUT

### Section Order (Top to Bottom)

```
┌─────────────────────────────────────────────────────────────────────┐
│  1. HEADER (Sticky navigation)                                      │
├─────────────────────────────────────────────────────────────────────┤
│  2. HERO SECTION                                                    │
│     - Emotional headline                                            │
│     - Subtext: "Nurturing Chess Champions"                          │
│     - Primary CTA: "Register Now"                                   │
│     - Secondary CTA: "Upcoming Tournaments"                         │
│     - Background: Chess imagery with overlay                        │
├─────────────────────────────────────────────────────────────────────┤
│  3. ANNOUNCEMENT BAR (if any active announcements)                  │
│     - Scrolling or static important updates                         │
├─────────────────────────────────────────────────────────────────────┤
│  4. QUICK STATS                                                     │
│     │ 1,250 Players │ 45 Tournaments │ 8 Academies │ 6 Taluks │    │
│     - Animated counters on scroll                                   │
├─────────────────────────────────────────────────────────────────────┤
│  5. UPCOMING TOURNAMENTS                                            │
│     - Horizontal scroll cards (mobile)                              │
│     - Grid 3-up (desktop)                                           │
│     - "View All Tournaments" link                                   │
├─────────────────────────────────────────────────────────────────────┤
│  6. FEATURED CONTENT / NEWS                                         │
│     - Latest news cards                                             │
│     - Photo gallery highlights                                      │
├─────────────────────────────────────────────────────────────────────┤
│  7. ABOUT KDCA (Brief)                                              │
│     - Mission statement                                             │
│     - KDCA Logo prominently                                         │
│     - "Learn More About Us" CTA                                     │
├─────────────────────────────────────────────────────────────────────┤
│  8. TALUK ASSOCIATIONS                                              │
│     - Interactive map or grid of 6 taluks                           │
│     - Each taluk card links to detail page                          │
├─────────────────────────────────────────────────────────────────────┤
│  9. ACADEMIES SHOWCASE                                              │
│     - Academy logos/cards                                           │
│     - "Find an Academy Near You"                                    │
├─────────────────────────────────────────────────────────────────────┤
│  10. PLAYER SPOTLIGHT / ACHIEVEMENTS                                │
│     - Featured players                                              │
│     - Recent achievements                                           │
│     - Rating milestones                                             │
├─────────────────────────────────────────────────────────────────────┤
│  11. TESTIMONIALS (Optional)                                        │
│     - Quotes from players, parents, coaches                         │
├─────────────────────────────────────────────────────────────────────┤
│  12. CTA BANNER                                                     │
│     - "Join KDCA Today" with registration link                      │
├─────────────────────────────────────────────────────────────────────┤
│  13. FOOTER                                                         │
│     - Quick links                                                   │
│     - Contact info                                                  │
│     - Social media                                                  │
│     - Legal links                                                   │
└─────────────────────────────────────────────────────────────────────┘
```

### Hero Section Detail

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│        [Background: Dynamic chess imagery with gradient]            │
│                                                                     │
│              Where Champions                                        │  ← 72px
│                 Begin                                               │
│                                                                     │
│     Nurturing the next generation of chess masters                  │  ← 24px
│              in Kallakurichi District                               │
│                                                                     │
│     ┌────────────────┐    ┌────────────────┐                       │
│     │  Register Now  │    │  Tournaments   │                       │
│     └────────────────┘    └────────────────┘                       │
│                                                                     │
│                                                                     │
│                     ▼ Scroll to explore                             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 8. PAGE TEMPLATES

### 8.1 List Page Template (Tournaments, Associations, Academies)

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Header]                                                           │
├─────────────────────────────────────────────────────────────────────┤
│  PAGE HEADER                                                        │
│  ─────────────────────────────────────────────────────────────────  │
│  Tournaments              [Search] [Filters ▼]                      │
│  Explore chess events across Kallakurichi                           │
├─────────────────────────────────────────────────────────────────────┤
│  FILTER BAR                                                         │
│  [All] [District] [Taluk] [Open] [Rapid] [Blitz]                   │
├─────────────────────────────────────────────────────────────────────┤
│  CONTENT GRID                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                          │
│  │  Card 1  │  │  Card 2  │  │  Card 3  │                          │
│  └──────────┘  └──────────┘  └──────────┘                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                          │
│  │  Card 4  │  │  Card 5  │  │  Card 6  │                          │
│  └──────────┘  └──────────┘  └──────────┘                          │
├─────────────────────────────────────────────────────────────────────┤
│  PAGINATION                                                         │
│  ← Previous   1  2  3  ...  10   Next →                            │
├─────────────────────────────────────────────────────────────────────┤
│  [Footer]                                                           │
└─────────────────────────────────────────────────────────────────────┘
```

### 8.2 Detail Page Template (Organization Profile)

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Header]                                                           │
├─────────────────────────────────────────────────────────────────────┤
│  HERO BANNER (Organization banner image)                            │
│  ─────────────────────────────────────────────────────────────────  │
│         [LOGO]                                                      │
│  Chinnasalem Taluk Chess Association                               │
│  Established 2020 • 45 Members • 12 Tournaments                    │
├─────────────────────────────────────────────────────────────────────┤
│  TAB NAVIGATION                                                     │
│  [About] [Office Bearers] [Members] [Tournaments] [Gallery]        │
├─────────────────────────────────────────────────────────────────────┤
│  CONTENT AREA                                                       │
│  (Changes based on active tab)                                      │
│                                                                     │
│  ABOUT TAB:                                                         │
│  - Description                                                      │
│  - Contact information                                              │
│  - Location map                                                     │
│                                                                     │
│  OFFICE BEARERS TAB:                                                │
│  - Grid of bearer cards                                             │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  SIDEBAR (Desktop)                                                  │
│  - Quick contact                                                    │
│  - Upcoming events                                                  │
│  - Social links                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  [Footer]                                                           │
└─────────────────────────────────────────────────────────────────────┘
```

### 8.3 Dashboard Template (Admin/Organization)

```
┌─────────────────────────────────────────────────────────────────────┐
│  [SIDEBAR]          │  [HEADER - User info, notifications]         │
│  ─────────────────  ├───────────────────────────────────────────────┤
│  [Logo]             │  DASHBOARD                                    │
│                     │  Welcome back, Admin!                         │
│  Dashboard          │  ───────────────────────────────────────────  │
│  Players            │                                               │
│  Tournaments        │  STAT CARDS                                   │
│  Organizations      │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐             │
│  Payments           │  │ 150 │ │  8  │ │  3  │ │ ₹5K │             │
│  Content            │  └─────┘ └─────┘ └─────┘ └─────┘             │
│  Reports            │                                               │
│  ─────────────────  │  CHARTS / GRAPHS                              │
│  Settings           │  ┌─────────────────────────────────────┐     │
│  Logout             │  │     Membership Trend Graph          │     │
│                     │  └─────────────────────────────────────┘     │
│                     │                                               │
│                     │  RECENT ACTIVITY TABLE                        │
│                     │  ┌─────────────────────────────────────┐     │
│                     │  │ Activity list...                    │     │
│                     │  └─────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────┘
   Sidebar: 260px width, collapsible
   Content: Fluid width
```

---

## 9. ANIMATIONS & INTERACTIONS

### Micro-Interactions

```css
/* Button hover */
.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
}

/* Card hover */
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

/* Link underline animation */
.link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -2px;
  left: 0;
  background: var(--primary-500);
  transition: width 0.3s ease;
}
.link:hover::after {
  width: 100%;
}
```

### Page Transitions
- Fade in/out: 200ms
- Slide transitions for modals: 300ms
- Skeleton loading for content

### Loading States
- Skeleton screens (not spinners)
- Progressive image loading (blur-up)
- Optimistic UI updates

### Scroll Animations
- Fade-up on scroll for sections
- Counter animations for stats
- Parallax for hero (subtle)

---

## 10. RESPONSIVE DESIGN

### Breakpoint Behavior

| Breakpoint | Navigation | Grid | Cards |
|------------|------------|------|-------|
| Mobile (<640px) | Hamburger | 1 col | Full width |
| Tablet (640-1024px) | Hamburger | 2 col | 2-up |
| Desktop (>1024px) | Full nav | 3-4 col | 3-up |

### Mobile-First Approach
1. Design for mobile first
2. Enhance for larger screens
3. Touch targets: minimum 44px
4. Thumb-friendly navigation

---

## 11. ICONOGRAPHY

### Icon Library: Lucide React

| Icon | Use Case |
|------|----------|
| `User` | Profile, players |
| `Trophy` | Tournaments, achievements |
| `MapPin` | Location |
| `Calendar` | Dates, events |
| `Clock` | Time controls |
| `Users` | Organizations, groups |
| `Award` | Certificates, rankings |
| `CreditCard` | Payments |
| `Settings` | Configuration |
| `Bell` | Notifications |
| `Search` | Search functionality |
| `ChevronRight` | Navigation, links |
| `Menu` | Mobile hamburger |

### Icon Sizing
- Small: 16px
- Medium: 20px (default)
- Large: 24px
- XL: 32px (feature icons)

---

## 12. ACCESSIBILITY

### WCAG 2.1 AA Compliance

1. **Color Contrast**
   - Text: minimum 4.5:1 ratio
   - Large text: minimum 3:1 ratio
   - UI components: minimum 3:1 ratio

2. **Keyboard Navigation**
   - All interactive elements focusable
   - Visible focus indicators
   - Logical tab order

3. **Screen Readers**
   - Semantic HTML
   - ARIA labels where needed
   - Alt text for all images

4. **Motion**
   - Respect `prefers-reduced-motion`
   - No auto-playing videos with sound

5. **Forms**
   - Labels associated with inputs
   - Error messages linked to fields
   - Required fields indicated

---

## 13. UX MISTAKES TO AVOID

### For Sports/Federation Websites

1. **Don't** use cluttered layouts with too much information
2. **Don't** hide registration behind multiple clicks
3. **Don't** use outdated design patterns (circa 2010)
4. **Don't** forget mobile users (often majority)
5. **Don't** use low-quality or stretched images
6. **Don't** make tournament information hard to find
7. **Don't** ignore loading performance
8. **Don't** use generic stock photos exclusively
9. **Don't** create dead-end pages without CTAs
10. **Don't** forget empty states (no tournaments, no results)
11. **Don't** hardcode content that should be dynamic
12. **Don't** use small touch targets on mobile
13. **Don't** ignore error states and recovery paths
14. **Don't** make forms too long without progress indication
15. **Don't** forget offline/poor connectivity scenarios

### Do Instead

1. **Do** prioritize player journey clarity
2. **Do** make registration fast and simple
3. **Do** use modern, clean layouts
4. **Do** optimize for mobile first
5. **Do** use authentic photos when possible
6. **Do** have clear navigation to tournaments
7. **Do** implement proper loading states
8. **Do** show real player achievements
9. **Do** guide users to next actions
10. **Do** design thoughtful empty states
11. **Do** make everything dynamic/API-driven
12. **Do** use proper touch target sizes
13. **Do** handle errors gracefully
14. **Do** use multi-step forms with progress
15. **Do** implement offline-first features

---

*Next Document: 05-ROLE-WORKFLOWS.md*

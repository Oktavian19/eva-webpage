Listed directory screens
Viewed splash_onboarding_screen.dart:1-140
Viewed splash_onboarding_screen.dart:141-260
Viewed splash_onboarding_screen.dart:261-335
Searched for "Widget _build"
Viewed home_screen.dart:585-660
Viewed home_screen.dart:660-770
Viewed home_screen.dart:1200-1260
Searched for "_buildMessageBubble"
Searched for "Bubble"
Searched for "Widget _build"
Viewed ai_conversation_screen.dart:1-100
Viewed voice_call_screen.dart:1-100
Searched for "Widget _build"
Viewed voice_call_screen.dart:1025-1100
Viewed login_screen.dart:1-140
Viewed login_screen.dart:141-240
Viewed mood_checkin_bottom_sheet.dart:1-120
Searched for "showModalBottomSheet"
Viewed home_screen.dart:1610-1635
Viewed home_screen.dart:1680-1740
Viewed home_screen.dart:1780-1840
Searched for "severity"
Viewed monitoring_screen.dart:930-950
Viewed web_phone_frame_wrapper.dart:1-100

Hasil audit mendalam terhadap basis kode frontend mobile ([apps/luna_mobile](file:///home/oktavian/Project/Flutter/luna_ai/apps/luna_mobile)) telah mengekstrak seluruh *design tokens*, sistem estetika *soft-glassmorphism*, tipografi, dan komponen visual Luna AI.

---

### 1. Color Palette

Berdasarkan [app_colors.dart](file:///home/oktavian/Project/Flutter/luna_ai/apps/luna_mobile/lib/theme/app_colors.dart), [home_screen.dart](file:///home/oktavian/Project/Flutter/luna_ai/apps/luna_mobile/lib/screens/home_screen.dart), dan [monitoring_screen.dart](file:///home/oktavian/Project/Flutter/luna_ai/apps/luna_mobile/lib/screens/monitoring_screen.dart):

| Peran Token | Nama Dart | Hex / RGBA | Deskripsi & Penggunaan |
| :--- | :--- | :--- | :--- |
| **Primary** | `AppColors.primary` | `#5358CB` | Periwinkle Primary (CTA tombol, active state, ikon utama) |
| **Primary Light** | `AppColors.primaryLight` | `#8B93FF` | Periwinkle Highlight (hover / gradient accent) |
| **Primary Container** | `AppColors.primaryContainer` | `#E8E9FF` | Soft Periwinkle Surface (active pill indicator, badge background) |
| **Secondary** | `AppColors.secondary` | `#E2DAFF` | Soft Lavender (aksen latar badge & kartu jurnal) |
| **Secondary Dark** | `AppColors.secondaryDark` | `#605A79` | Lavender Slate (teks sekunder pada permukaan pastel) |
| **Tertiary** | `AppColors.tertiary` | `#A7E6FF` | Sky Blue Cyan (aksen relaksasi / breath visualizer) |
| **Tertiary Dark** | `AppColors.tertiaryDark` | `#20667B` | Deep Teal (teks kontras untuk kategori meditasi / asesmen) |
| **Background (Light)**| `AppColors.background` | `#F8F9FE` | Cool Tint Off-White (warna canvas dasar aplikasi) |
| **Surface** | `AppColors.surface` | `#FFFFFF` | Solid White untuk kontainer kartu dan input form |
| **Glass Background** | `AppColors.glassBackground`| `rgba(255, 255, 255, 0.80)` | 80% white opacity untuk efek glassmorphism |
| **Glass Border** | `AppColors.glassBorder` | `rgba(255, 255, 255, 0.40)` | 40% white border stroke halus pada permukaan kaca |
| **Glass Shadow** | `AppColors.glassShadow` | `rgba(83, 88, 203, 0.08)` | 8% tint periwinkle shadow untuk kesan melayang natural |
| **Divider / Border** | `AppColors.divider` | `rgba(83, 88, 203, 0.055)` | Garis pemisah ultra-halus (opsi solid: `#E2E8F0` / `#D6DCF5`) |
| **Text Primary** | `AppColors.textPrimary` | `#191C1F` | Deep Charcoal (heading, judul kartu, input text) |
| **Text Secondary** | `AppColors.textSecondary` | `#767684` | Neutral Slate (body copy, deskripsi, sub-heading) |
| **Text Muted / Light**| `AppColors.textLight` | `#9EA0AB` | Cool Grey (placeholder input, caption kecil, inactive icon) |
| **Success** | `AppColors.success` | `#4CAF50` / `#10B981` | Status tugas selesai, indikator online |
| **Warning** | `AppColors.warning` | `#FF9800` / `#F59E0B` | Notifikasi perhatian / status pending |
| **Error / Danger** | `AppColors.error` | `#BA1A1A` / `#DC2626` | Pesan validasi gagal / krisis |
| **Dark Canvas (Web)** | `WebPhoneFrameWrapper` | `#0C0A14` | Obsidian Dark (latar belakang mode gelap / landing frame) |

#### Brand Gradients (Signature Luna AI)
- **Screen Canvas Gradient**: `linear-gradient(180deg, #F3F5FF 0%, #E9ECFF 50%, #F8F9FE 100%)`
- **Floating Action Button (FAB)**: `linear-gradient(135deg, #6C63FF 0%, #5358CB 50%, #3B3E99 100%)`
- **Luna Insight Card**: `linear-gradient(135deg, #EDE9FE 0%, #F3E8FF 50%, #E0E7FF 100%)`
- **Iridescent Orb Spectrum**: `conic-gradient(from 0deg, #FFB6C1, #E2DAFF, #A7E6FF, #8B93FF, #FFB6C1)`
- **Crisis Banner**: background `#FEF2F2`, border `#FECACA`, teks `#991B1B`

#### Clinical DASS-21 Severity Scale (Monitoring)
- **Normal**: `#2E7D32`
- **Ringan (Mild)**: `#FBC02D`
- **Sedang (Moderate)**: `#F57C00`
- **Berat (Severe)**: `#E65100`
- **Sangat Berat (Extremely Severe)**: `#D32F2F`

---

### 2. Typography System

Berdasarkan [app_typography.dart](file:///home/oktavian/Project/Flutter/luna_ai/apps/luna_mobile/lib/theme/app_typography.dart) dan [pubspec.yaml](file:///home/oktavian/Project/Flutter/luna_ai/apps/luna_mobile/pubspec.yaml):
- **Font Family**: **`Inter`** via Google Fonts (fallback: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`).

| Skala Tipografi | Font Size | Weight | Line Height | Letter Spacing | Warna Default |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Large (H1)** | `28px` (1.75rem) | 700 (Bold) | `1.3` (36.4px) | Normal | `#191C1F` |
| **Headline Medium (H2)**| `22px` (1.375rem) | 700 (Bold) | `1.3` (28.6px) | Normal | `#191C1F` |
| **Title Medium (H3)** | `16px` (1.0rem) | 600 (SemiBold) | `1.4` (22.4px) | Normal | `#191C1F` |
| **Body Large** | `15px` (0.9375rem)| 400 (Regular) | `1.5` (22.5px) | Normal | `#767684` |
| **Body Medium** | `14px` (0.875rem) | 400 (Regular) | `1.5` (21.0px) | Normal | `#767684` |
| **Label Small (Caption)**| `12px` (0.75rem) | 600 (SemiBold) | `1.4` (16.8px) | `+0.5px` | `#9EA0AB` |
| **Overline / Tag** | `10px - 11px` | 800 (ExtraBold)| `1.2` | `+0.8px - 1.8px` (Uppercase) | `#5358CB` |
| **Button Text** | `14px - 16px` | 600 (SemiBold) | `1.2` | Normal | `#FFFFFF` |

---

### 3. Spacing & Elevation

Berdasarkan implementasi [GlassCard](file:///home/oktavian/Project/Flutter/luna_ai/apps/luna_mobile/lib/widgets/glass_card.dart), [FloatingNavBar](file:///home/oktavian/Project/Flutter/luna_ai/apps/luna_mobile/lib/widgets/floating_nav_bar.dart), dan [CustomPillButton](file:///home/oktavian/Project/Flutter/luna_ai/apps/luna_mobile/lib/widgets/custom_button.dart):

#### Spacing Grid System (Basis 4px / 8px)
- **Micro Spacing**: `4px` (`0.25rem`), `8px` (`0.5rem`), `12px` (`0.75rem`), `14px` (`0.875rem`)
- **Default Padding**: `16px` (`1rem`), `20px` (`1.25rem`), `24px` (`1.5rem`), `28px` (`1.75rem`), `32px` (`2rem`)
- **Macro Layout Spacing**: `40px` (`2.5rem`), `48px` (`3rem`), `64px` (`4rem`)

#### Border Radius Hierarchy
- **Pill / Circular (`9999px`)**: Tombol utama (`CustomPillButton`), input field (`CustomPillTextField`), floating navigation bar wrapper, filter chips.
- **Modal Bottom Sheet (`28px`)**: Sudut atas modal dialog (`border-radius: 28px 28px 0 0`).
- **Cards & Containers (`24px`)**: `GlassCard` default radius.
- **Shortcuts & Insight Card (`16px - 20px`)**: Kartu aksi cepat & catatan Luna.
- **Badge / Mini Tag (`8px - 14px`)**: Badge kategori aktivitas & kontainer ikon mini.

#### Shadow & Elevation Levels
- **Level 1 (Subtle / Card Border Glow)**: `0 2px 10px rgba(0, 0, 0, 0.05)`
- **Level 2 (Glass Floating Shadow)**: `0 10px 30px rgba(83, 88, 203, 0.08)`
- **Level 3 (Primary Button Glow)**: `0 4px 14px rgba(83, 88, 203, 0.30)`
- **Level 4 (Floating Navigation Bar)**: `0 8px 25px rgba(83, 88, 203, 0.12), 0 2px 10px rgba(0, 0, 0, 0.05)`
- **Level 5 (Central FAB Shadow)**: `0 6px 20px rgba(83, 88, 203, 0.45)`
- **Atmospheric Halo (Orb / Hero Visualizer)**: `0 0 36px rgba(199, 210, 254, 0.40), 0 0 28px rgba(255, 209, 220, 0.30)`

---

### 4. Core UI Components

1. **Tombol (Pill Buttons)**:
   - **Primary**: Latar `#5358CB`, teks putih, tinggi `54px`, `border-radius: 9999px`, padding horizontal `16px - 24px`, shadow `0 4px 14px rgba(83,88,203,0.30)`. Hover: `brightness(1.08)`, active: `transform: scale(0.98)`.
   - **Outline**: Latar `transparent`, border `1.5px solid #5358CB`, teks `#5358CB`. Hover: latar `rgba(232, 233, 255, 0.35)`.
   - **Social Auth Button**: Latar `#FFFFFF`, border `1.5px solid #E2E8F0`, teks `#191C1F`, tinggi `50px`.
   - **Central FAB**: Lingkaran `58px x 58px`, gradient 3 warna (`#6C63FF` $\to$ `#5358CB` $\to$ `#3B3E99`), border putih `3px`, shadow periwinkle `0 6px 20px rgba(83,88,203,0.45)`.

2. **Form Inputs (Custom Pill TextField)**:
   - Kontainer kapsul: `border-radius: 9999px`, background solid `#FFFFFF`, border `1.2px solid #E2E8F0` (atau `Colors.grey.300`).
   - Padding internal: horizontal `20px`, vertikal `16px`.
   - Ikon prefix / suffix: `20px`, warna `#767684`.
   - Focus State: border berubah ke `#5358CB` dengan ring halus `0 0 0 3px rgba(83, 88, 203, 0.15)`.

3. **Cards & Glass Containers (GlassCard)**:
   - Glassmorphism: `background: rgba(255, 255, 255, 0.80)`, `backdrop-filter: blur(20px)`, border `1.2px solid rgba(255, 255, 255, 0.40)`.
   - Padding: default `20px - 28px`.
   - Shadow: `0 10px 30px rgba(83, 88, 203, 0.08)`.

4. **Navigation & Header Patterns**:
   - **Top Header**: Transparan (`elevation: 0`), teks judul `#191C1F`, ikon navigasi periwinkle/charcoal.
   - **Floating Bottom Nav Bar**: Bar mengambang dengan tinggi `68px`, margin `16px`, background putih 95% dengan border putih 80%, dilengkapi **sliding active indicator pill** (`#E8E9FF`, radius 16px) yang bertransisi halus mengikuti index aktif.

---

### 5. Visual Assets & Micro-interactions

- **Iconography Style**: Rounded Outline (stroke `1.5px - 2px`, ukuran standar `20px - 24px`), beralih ke varian *Filled* saat tab/item berada dalam status aktif (misal `home_outlined` $\to$ `home`).
- **Easing Curve**: `cubic-bezier(0.215, 0.61, 0.355, 1)` (*easeOutCubic*) untuk slide & pergerakan navigation pill; `ease-out` untuk fade-in.
- **Timing & Durations**:
  - Hover / Tab Indicator: `250ms - 300ms`
  - Staggered Entrance Reveal: `320ms` (base delay `60ms`, interval `40ms` per item)
  - Shimmer Skeleton Pulse: `1100ms` ping-pong reverse
  - Luna Ambient Breathing Orb: `3200ms` continuous cycle

---

### Kode Siap Pakai untuk Web

#### 1. CSS Custom Properties (`tokens.css` / `:root`)

```css
:root {
  /* --- Color Palette --- */
  --color-primary: #5358cb;
  --color-primary-light: #8b93ff;
  --color-primary-container: #e8e9ff;
  --color-secondary: #e2daff;
  --color-secondary-dark: #605a79;
  --color-tertiary: #a7e6ff;
  --color-tertiary-dark: #20667b;

  --color-bg: #f8f9fe;
  --color-surface: #ffffff;
  --color-canvas-dark: #0c0a14;

  /* --- Text Colors --- */
  --color-text-primary: #191c1f;
  --color-text-secondary: #767684;
  --color-text-light: #9ea0ab;

  /* --- Glassmorphism --- */
  --glass-bg: rgba(255, 255, 255, 0.8);
  --glass-border: rgba(255, 255, 255, 0.4);
  --glass-shadow: 0 10px 30px rgba(83, 88, 203, 0.08);
  --glass-blur: blur(20px);
  --divider-color: rgba(83, 88, 203, 0.055);
  --border-subtle: #e2e8f0;

  /* --- Status & Alerts --- */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ba1a1a;
  --color-crisis-bg: #fef2f2;
  --color-crisis-border: #fecaca;
  --color-crisis-text: #991b1b;

  /* --- DASS-21 Severity Scales --- */
  --dass-normal: #2e7d32;
  --dass-mild: #fbc02d;
  --dass-moderate: #f57c00;
  --dass-severe: #e65100;
  --dass-extreme: #d32f2f;

  /* --- Brand Gradients --- */
  --gradient-bg-screen: linear-gradient(180deg, #f3f5ff 0%, #e9ecff 50%, #f8f9fe 100%);
  --gradient-fab: linear-gradient(135deg, #6c63ff 0%, #5358cb 50%, #3b3e99 100%);
  --gradient-insight: linear-gradient(135deg, #ede9fe 0%, #f3e8ff 50%, #e0e7ff 100%);
  --gradient-orb-halo: radial-gradient(circle, rgba(199, 210, 254, 0.35) 0%, rgba(255, 209, 220, 0.2) 60%, transparent 100%);

  /* --- Typography --- */
  --font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  /* --- Border Radius --- */
  --radius-pill: 9999px;
  --radius-modal: 28px;
  --radius-card: 24px;
  --radius-shortcut: 18px;
  --radius-icon: 14px;
  --radius-badge: 8px;

  /* --- Shadows --- */
  --shadow-btn: 0 4px 14px rgba(83, 88, 203, 0.3);
  --shadow-fab: 0 6px 20px rgba(83, 88, 203, 0.45);
  --shadow-nav: 0 8px 25px rgba(83, 88, 203, 0.12), 0 2px 10px rgba(0, 0, 0, 0.05);

  /* --- Transitions & Animations --- */
  --ease-luna: cubic-bezier(0.215, 0.61, 0.355, 1);
  --duration-fast: 250ms;
  --duration-normal: 320ms;
}

/* Glass Card Helper Class */
.luna-glass-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1.2px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  border-radius: var(--radius-card);
}
```

---

#### 2. Konfigurasi `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue,html}",
  ],
  theme: {
    extend: {
      colors: {
        luna: {
          primary: {
            DEFAULT: '#5358CB',
            light: '#8B93FF',
            container: '#E8E9FF',
          },
          secondary: {
            DEFAULT: '#E2DAFF',
            dark: '#605A79',
          },
          tertiary: {
            DEFAULT: '#A7E6FF',
            dark: '#20667B',
          },
          bg: '#F8F9FE',
          surface: '#FFFFFF',
          dark: '#0C0A14',
          text: {
            primary: '#191C1F',
            secondary: '#767684',
            light: '#9EA0AB',
          },
          divider: 'rgba(83, 88, 203, 0.055)',
          crisis: {
            bg: '#FEF2F2',
            border: '#FECACA',
            text: '#991B1B',
          },
          dass: {
            normal: '#2E7D32',
            mild: '#FBC02D',
            moderate: '#F57C00',
            severe: '#E65100',
            extreme: '#D32F2F',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'display': ['28px', { lineHeight: '1.3', fontWeight: '700' }],
        'headline': ['22px', { lineHeight: '1.3', fontWeight: '700' }],
        'title-md': ['16px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['15px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '1.4', letterSpacing: '0.04em', fontWeight: '600' }],
        'overline': ['10px', { lineHeight: '1.2', letterSpacing: '0.12em', fontWeight: '800' }],
      },
      borderRadius: {
        'badge': '8px',
        'icon': '14px',
        'shortcut': '18px',
        'card': '24px',
        'modal': '28px',
        'pill': '9999px',
      },
      boxShadow: {
        'glass': '0 10px 30px rgba(83, 88, 203, 0.08)',
        'btn': '0 4px 14px rgba(83, 88, 203, 0.30)',
        'fab': '0 6px 20px rgba(83, 88, 203, 0.45)',
        'floating-nav': '0 8px 25px rgba(83, 88, 203, 0.12), 0 2px 10px rgba(0, 0, 0, 0.05)',
      },
      backgroundImage: {
        'luna-screen': 'linear-gradient(180deg, #F3F5FF 0%, #E9ECFF 50%, #F8F9FE 100%)',
        'luna-fab': 'linear-gradient(135deg, #6C63FF 0%, #5358CB 50%, #3B3E99 100%)',
        'luna-insight': 'linear-gradient(135deg, #EDE9FE 0%, #F3E8FF 50%, #E0E7FF 100%)',
      },
      transitionTimingFunction: {
        'luna': 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      },
      animation: {
        'breath-orb': 'breath 3.2s ease-in-out infinite',
        'shimmer': 'shimmer 1.1s ease-in-out infinite alternate',
      },
      keyframes: {
        breath: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.85' },
          '50%': { transform: 'scale(1.06)', opacity: '1' },
        },
        shimmer: {
          '0%': { opacity: '0.28' },
          '100%': { opacity: '0.68' },
        },
      },
    },
  },
  plugins: [],
};
```
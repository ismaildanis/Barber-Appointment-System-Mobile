/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#fff' ;//'#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#151718',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#121212',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    button :'#AD8C57',
  },
};

export const myColors = {
  mainBackground: "#121212",
  mainBackgroundGradient: [
    "#121212",
    "#121212",
  ] as const,
  mainBackgroundGradient2: [
    "#C8AA7A",
    "#E4D2AC",
  ] as const,
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});


// constants/theme.ts
export const themeColors = {
  // Ana renkler
  background: "#121212",      // Ana arka plan
  surface: "#1E1E1E",         // Kart ve yüzey rengi
  surfaceLight: "#2A2A2A",    // Hafif yüzey varyasyonu
  
  // Bej/Altın tonları
  primary: "#E4D2AC",         // Ana bej renk
  primaryDark: "#E4D2AC",     // Koyu bej
  primaryLight: "#E4D2AC",    // Açık bej
  accent: "#E4D2AC",          // Altın vurgu
  
  // Border ve ayırıcılar
  border: "#2C2C2C",          // Standart border
  borderLight: "#3A3A3A",     // Açık border
  divider: "#2A2A2A",         // Ayırıcı çizgiler
  
  // Metin renkleri
  text: "#F5F5F5",            // Ana metin (beyaz)
  textSecondary: "#E8E8E8",   // İkincil metin
  textMuted: "#B8B8B8",       // Soluk metin
  textDim: "#A0A0A0",         // Çok soluk metin
  textOnPrimary: "#121212",   // Bej üzerinde koyu metin
  
  // Durum renkleri
  success: "#4CAF50",         // Başarı (yeşil)
  warning: "#FFC966",         // Uyarı (turuncu)
  error: "#E57373",           // Hata (kırmızı)
  info: "#64B5F6",            // Bilgi (mavi)
  
  // Özel renkler
  highlight: "#4A9EFF",       // Vurgu mavisi
  overlay: "rgba(0,0,0,0.7)", // Modal overlay
  
  // Opacity varyasyonları
  whiteAlpha: {
    5: "rgba(255,255,255,0.05)",
    10: "rgba(255,255,255,0.1)",
    20: "rgba(255,255,255,0.2)",
    30: "rgba(255,255,255,0.3)",
    50: "rgba(255,255,255,0.5)",
  },
  
  blackAlpha: {
    50: "rgba(0,0,0,0.5)",
    70: "rgba(0,0,0,0.7)",
  }
};

// Durum renkleri için özel mapping
export const statusColors = {
  scheduled: "#64B5F6",
  completed: "#4CAF50",
  cancelled: "#E57373",
  noshow: "#FFA726",
  expired: "#A0A0A0",
};

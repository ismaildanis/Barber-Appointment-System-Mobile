// constants/theme/customerTheme.ts

export const customerTheme = {
  // Ana renkler
  background: "#121212",           // Ana arka plan
  surface: "#1A1A1A",              // Kart arka planları
  surfaceLight: "#242424",         // Hover/aktif durumlar
  
  // Altın/Bej tonları (mevcut paletini geliştirdim)
  primary: "#E4D2AC",              // Ana altın renk (şu anki header border)
  primaryDark: "#CFB080",          // Koyu altın (avatar arka plan)
  primaryLight: "#F5E6D3",         // Açık bej
  accent: "#D4AF77",               // Vurgu altın
  
  // Metin renkleri
  text: "#FFFFFF",                 // Ana metin
  textSecondary: "#F3F3F3",        // İkincil metin
  textMuted: "#CACACA",            // Soluk metin
  textDim: "#C0C2BD",              // Çok soluk (email gibi)
  textOnPrimary: "#1A1A1A",        // Altın üzerinde koyu metin
  
  // Border ve ayırıcılar
  border: "rgba(255,255,255,0.08)",      // Hafif border
  borderLight: "rgba(255,255,255,0.10)", // Biraz daha belirgin
  borderAccent: "rgba(228,210,172,0.2)", // Altın tonlu border
  
  // Arka plan efektleri
  cardBackground: "rgba(255,255,255,0.02)",
  cardBorder: "rgba(255,255,255,0.08)",
  cardShadow: "rgba(0,0,0,0.15)",
  
  // Gradient renkleri
  gradientStart: "#1E1E1E",
  gradientEnd: "#2A2520",
  
  // Durum renkleri
  success: "#4ADE80",              // Yeşil (seçili kart)
  warning: "#FBBF24",              // Turuncu
  error: "#EF4444",                // Kırmızı
  info: "#60A5FA",                 // Mavi
  
  // Shadow renkleri
  shadowColor: "#000000",
  
  // Opacity varyasyonları
  whiteAlpha: {
    2: "rgba(255,255,255,0.02)",
    4: "rgba(255,255,255,0.04)",
    6: "rgba(255,255,255,0.06)",
    8: "rgba(255,255,255,0.08)",
    10: "rgba(255,255,255,0.10)",
    15: "rgba(255,255,255,0.15)",
    20: "rgba(255,255,255,0.20)",
  },
  
  goldAlpha: {
    10: "rgba(228,210,172,0.1)",
    15: "rgba(228,210,172,0.15)",
    20: "rgba(228,210,172,0.2)",
    30: "rgba(228,210,172,0.3)",
  }
};

// Gradient kombinasyonları
export const customerGradients = {
  // Kart gradient'i (ServiceList ve BarberList için)
  card: ["#1E1E1E", "#2A2520"],
  cardReverse: ["#2A2520", "#1E1E1E"],
  
  // Header gradient
  header: ["#1A1A1A", "#242424"],
  
  // Button gradient
  button: ["#E4D2AC", "#CFB080"],
  
  // Subtle gradient
  subtle: ["rgba(255,255,255,0.02)", "rgba(255,255,255,0.06)"],
};

// Component-specific colors
export const customerComponents = {
  // ShopHeader
  header: {
    background: "transparent",
    border: "#E4D2AC",
    borderWidth: 2,
    avatar: {
      background: "#CFB080",
      text: "#1A1A1A",
    },
    name: "#FFFFFF",
    email: "#C0C2BD",
    icon: "#E4D2AC",
  },
  
  // ServiceList & BarberList cards
  card: {
    container: {
      background: "rgba(255,255,255,0.04)",
      border: "rgba(255,255,255,0.08)",
      borderRadius: 22,
    },
    item: {
      background: "rgba(255,255,255,0.02)",
      border: "rgba(255,255,255,0.10)",
      borderRadius: 18,
      selected: {
        border: "#4ADE80",
        borderWidth: 1,
      }
    },
    image: {
      background: "#FFFFFF",
      borderRadius: 14,
    },
    title: "#F3F3F3",
    price: "#E8E8E8",
    description: "#CACACA",
    sectionTitle: "#FFFFFF",
  },
  
  // Quick Actions (önerdiğim butonlar için)
  quickAction: {
    background: "#1E1E1E",
    border: "#2A2A2A",
    icon: "#E4D2AC",
    text: "#B8B8B8",
    activeBackground: "#242424",
  },
  
  // Appointment cards
  appointment: {
    background: customerGradients.card,
    border: "rgba(228,210,172,0.15)",
    statusColors: {
      scheduled: "#60A5FA",
      completed: "#4ADE80",
      cancelled: "#EF4444",
      expired: "#A0A0A0",
    }
  }
};

// Önerilen kullanım örneği:
export const exampleUsage = {
  // Container
  containerStyle: {
    backgroundColor: customerTheme.background,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: customerTheme.border,
    padding: 16,
  },
  
  // Card
  cardStyle: {
    backgroundColor: customerTheme.cardBackground,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: customerTheme.cardBorder,
    shadowColor: customerTheme.shadowColor,
    shadowOpacity: 0.15,
  },
  
  // Text hierarchy
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: customerTheme.text,
  },
  subheading: {
    fontSize: 18,
    fontWeight: "600",
    color: customerTheme.textSecondary,
  },
  body: {
    fontSize: 14,
    fontWeight: "400",
    color: customerTheme.textMuted,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400",
    color: customerTheme.textDim,
  }
};
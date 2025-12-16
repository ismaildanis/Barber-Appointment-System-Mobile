// BarberList.tsx'deki renkler
export const barberListColors = {
  containerBackground: "rgba(255,255,255,0.04)",  // container backgroundColor
  containerBorder: "rgba(255,255,255,0.08)",      // container borderColor
  selectedBorder: "#4ade80",                       // selectedCard borderColor
  cardBackground: "rgba(255,255,255,0.02)",       // card backgroundColor
  cardBorder: "rgba(255,255,255,0.10)",           // card borderColor
  imageBackground: "#fff",                         // image backgroundColor
  emptyText: "#fff",                               // empty color
} as const;

// ServiceList.tsx'deki renkler
export const serviceListColors = {
  containerBackground: "rgba(255,255,255,0.04)",  // container backgroundColor
  containerBorder: "rgba(255,255,255,0.08)",      // container borderColor
  cardImageBackground: "#fff",                     // cardImage backgroundColor
  cardBackground: "rgba(255,255,255,0.02)",       // card backgroundColor
  cardTitle: "#F3F3F3",                            // cardTitle color
  cardPrice: "#E8E8E8",                            // cardPrice color
  cardMeta: "#CACACA",                             // cardMeta color
  emptyText: "#fff",                               // empty color
} as const;

// LastAppointmentCard.tsx'deki renkler
export const lastAppointmentCardColors = {
  title: "#FFFFFF",                                // title color
  meta: "#D0D0D0",                                 // meta color
  badgeBackground: "#F2E6CC",                      // badge backgroundColor
  badgeBorder: "#D9C9A3",                          // badge borderColor
  badgeText: "#2A2A2A",                            // badgeText color
  avatarGradient: ["#C8AA7A", "#E4D2AC"] as const, // avatar colors (gradient)
  avatarText: "#1A1A1A",                           // avatarText color
} as const;

// ScheduledAppointment.tsx'deki renkler
export const scheduledAppointmentColors = {
  outerGradient: ["#C8AA7A", "#E4D2AC"] as const,   // outer colors (gradient)
  avatarGradient: ["#F1D9A5", "#E4C88A"] as const,  // avatar colors (gradient)
  avatarText: "#1A1A1A",                            // avatarText color
  title: "#fff",                                    // title color
  subtitle: "rgba(255,255,255,0.8)",                // subtitle color
  meta: "rgba(255,255,255,0.85)",                   // meta color
  innerBackground: "rgba(0,0,0,0.55)",             // inner backgroundColor
} as const;

// home.tsx'de doğrudan renk yok, sadece myColors.mainBackgroundGradient kullanılıyor (mevcut tema).
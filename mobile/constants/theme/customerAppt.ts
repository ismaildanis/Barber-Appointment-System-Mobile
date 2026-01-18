import { statusColor } from "@/src/types/appointment";

// appointments/[id].tsx'deki renkler
export const appointmentDetailColors = {
  containerBackground: "#121212",                              // container backgroundColor
  backBtnIcon: "#fff",                                        // Ionicons color
  backBtnBackground: "rgba(255,255,255,0.08)",               // backBtn backgroundColor
  title: "#fff",                                              // title color
  cardBackground: "rgba(255,255,255,0.04)",                  // card backgroundColor
  cardBorder: "rgba(255,255,255,0.08)",                      // card borderColor
  cardTitle: "#fff",                                          // cardTitle color
  badgeBackground: statusColor,                  // badge backgroundColor (dinamik, status'a göre)
  meta: "rgba(255,255,255,0.9)",                             // meta color
  metaSmall: "rgba(255,255,255,0.75)",                       // metaSmall color
  note: "#f3d9a4",                                            // note color
  btnDangerBackground: "#ef4444",                             // btnDanger backgroundColor
  btnText: "#fff",                                            // btnText color
} as const;

// appointments/index.tsx'deki renkler
export const themeColors = {
  background: "#121212",
  primary: "#D1C4B2",     // Senin seçtiğin bej
  surface: "#1E1E1E",     // Kartlar
  border: "#2C2C2C",      // Ayırıcılar
  text: "#F5F5F5",        // Beyaz metin
  textMuted: "#7A7A7A",   // Gri metin
  blackText: "#121212",   // Bej buton üzerindeki koyu yazı
};
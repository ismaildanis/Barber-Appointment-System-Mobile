import { statusColor } from "@/src/types/appointment";

// appointments/[id].tsx'deki renkler
export const appointmentDetailColors = {
  containerBackground: "#0f0f0f",                              // container backgroundColor
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
export const customerAppointmentsColors = {
  containerBackground: "#000",                                // container backgroundColor
  title: "#fff",                                              // title color
  empty: "#ccc",                                              // empty color
  cardBackground: "rgba(255,255,255,0.06)",                  // card backgroundColor
  cardBorder: "rgba(255,255,255,0.08)",                      // card borderColor
  cardTitle: "#fff",                                          // cardTitle color
  meta: "rgba(255,255,255,0.8)",                             // meta color
  statusMeta: statusColor,                       // meta color (dinamik, status'a göre)
  note: "#f3d9a4",                                            // note color
  detailBadgeIcon: "#2b2b2b",                                 // Ionicons color
  detailBadgeBackground: "#C8AA7A",                           // detailBadge backgroundColor
} as const;
// index.tsx'deki renkler (create-appointments/index.tsx)

import { myColors } from "../theme";

export const createAppointmentsIndexColors = {
  safeAreaBackground: "transparent",                          // SafeAreaView backgroundColor
  imageBackground: "#0f0f0f",                                 // ImageBackground backgroundColor
  mainGradient: myColors.mainBackgroundGradient,             // LinearGradient colors (mevcut tema)
  shadowColor: "#2b2b2b",                                     // shadowColor, FontAwesome5 color
  borderColor: "rgba(255, 255, 255, 0.49)",                  // borderColor
  buttonBackground: "#C8AA7A",                               // View backgroundColor
  buttonBorder: "#E4D2AC",                                   // borderColor
  buttonGradient: ["#C8AA7A", "#E4D2AC"] as const,           // LinearGradient colors
  textColor: "#2b2b2b",                                       // Text color
  containerGradient: ["#121212", "#121212", "#121212"] as const, // LinearGradient colors
  titleColor: "#fff",                                         // Text color
  separatorColor: "#C8AA7A",                                  // View backgroundColor
  serviceGradient: ["#C8AA7A", "#E4D2AC"] as const,           // LinearGradient colors
  summaryBackground: "rgba(255,255,255,0.05)",               // View backgroundColor
  summaryBorder: "rgba(255,255,255,0.12)",                   // borderColor
  inputColor: "#f3f3f3",                                      // TextInput color
  placeholderColor: "rgba(255,255,255,0.6)",                 // placeholderTextColor
  submitBackground: "#AD8C57",                                // TouchableOpacity backgroundColor
  submitDisabled: "rgba(173,140,87,0.6)",                    // disabled backgroundColor
} as const;

// select-barber.tsx'deki renkler
export const selectBarberColors = {
  cancelBackground: "rgba(255,255,255,0.12)",                // TouchableOpacity backgroundColor
  cancelText: "#fff",                                         // Text color
} as const;

// select-service.tsx'deki renkler
export const selectServiceColors = {
  safeAreaBackground: "#000",                                 // SafeAreaView backgroundColor
  saveBackground: "#AD8C57",                                  // TouchableOpacity backgroundColor
  saveText: "#fff",                                           // Text color
  cancelBackground: "rgba(255,255,255,0.12)",                // TouchableOpacity backgroundColor
  cancelText: "#fff",                                         // Text color
} as const;
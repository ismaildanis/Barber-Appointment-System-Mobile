import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions } from "react-native";
import Spinner from "../ui/Spinner";
import { LinearGradient } from "expo-linear-gradient";
import { AlertModal } from "../ui/AlertModal";
import { useState } from "react";

type HourItem = { time: string; available: boolean };

type HoursProps = {
  hours: HourItem[];
  durationMinutes: number;
  loading?: boolean;
  selectedHour?: string;
  onSelect?: (hour: string) => void;
};

const canPick = (time: string, hours: HourItem[], duration: number, step = 15) => {
  const need = Math.ceil(duration / step);
  const start = hours.findIndex((h) => h.time === time);
  if (start === -1) return false;
  for (let i = 0; i < need; i++) {
    const slot = hours[start + i];
    if (!slot || !slot.available) return false;
  }
  return true;
};

const isInRange = (time: string, selected: string | undefined, hours: HourItem[], duration: number, step = 15) => {
  if (!selected) return false;
  const start = hours.findIndex((h) => h.time === selected);
  const idx = hours.findIndex((h) => h.time === time);
  if (start === -1 || idx === -1) return false;
  const need = Math.ceil(duration / step);
  return idx >= start && idx < start + need;
};

export default function Hours({ hours, durationMinutes, loading, selectedHour, onSelect }: HoursProps) {
  
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  
  if (loading) {
    return (
      <View style={styles.container}>
        <Spinner size="small" />
      </View>
    );
  }
  if (!hours?.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>Bugün için saat bulunamadı. Sayfayı yenileyin ya da farklı bir tarih seçin.</Text>
      </View>
    );
  }

  const GAP = 10;
  const COLS = 10; // 10 sütun
  const ITEM_W = 70;

  return (
    <LinearGradient
      colors={["#4A4A4A", "#3A3A3A", "#2b2b2b"]}
      start={{ x: 0, y: 1.3 }}
      end={{ x: 0.3, y: 0 }}
      style={styles.container}
    >
      <Text style={styles.sectionTitle}>Randevu Başlangıç Saati Seçin</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }}
      >
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            columnGap: GAP,
            rowGap: GAP,
            width: COLS * ITEM_W + (COLS - 1) * GAP,
          }}
        >
          {hours.map((item) => {
            const hasSpace = canPick(item.time, hours, durationMinutes);
            const disabled = !item.available;
            const inRange = isInRange(item.time, selectedHour, hours, durationMinutes);
            const gradientColors = disabled
              ? ["#4A4A4A", "#4A4A4A"] as const
              : inRange
              ? ["#d6b370", "#b88b4e"] as const
              : ["#2b2b2b", "#4A4A4A"] as const;

            return (
              <TouchableOpacity
                key={item.time}
                disabled={disabled}
                onPress={() => {
                  if (!hasSpace) {
                    setAlertTitle("Uyarı")
                    setAlertMsg("Bu saat seçilen servis süresi için yeterli boşluk içermiyor.")
                    setAlertVisible(true);                     
                    return;
                  }
                  onSelect?.(item.time);
                }}
                activeOpacity={disabled ? 1 : 0.8}
                style={{ width: ITEM_W }}
              >
                <LinearGradient
                  colors={gradientColors}
                  start={{ x: 1, y: 1 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.slot, disabled && styles.slotDisabled]}
                >
                  <Text style={[styles.slotText, disabled && styles.slotTextDisabled]}>{item.time}</Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <AlertModal
        visible={alertVisible}
        title={alertTitle}
        message={alertMsg}
        onClose={() => setAlertVisible(false)}
        onConfirm={() => setAlertVisible(false)}
        confirmText="Tamam"          
        cancelText="Kapat"
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#fff",
  },
  empty: { 
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
  slotText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  slotTextDisabled: {
    color: "rgba(255,255,255,0.5)",
  },
  slot: {
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  slotDisabled: {
    borderColor: "rgba(255,255,255,0.03)",
    opacity: 0.45,
  },
});
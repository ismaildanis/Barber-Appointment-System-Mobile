import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Spinner from "../ui/Spinner";
import { LinearGradient } from "expo-linear-gradient";

type HourItem = { time: string; available: boolean };

type HoursProps = {
  hours: HourItem[];
  durationMinutes: number;   // seçilen servisin süresi (dk)
  loading?: boolean;
  selectedHour?: string;     // başlangıç slotu
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

export default function Hours({
  hours,
  durationMinutes,
  loading,
  selectedHour,
  onSelect,
}: HoursProps) {
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Saatler</Text>
        <Spinner size="small" />
      </View>
    );
  }
  if (!hours?.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Saatler</Text>
        <Text style={styles.empty}>Bu gün için saat bulunamadı.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <FlatList
            data={hours}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, paddingHorizontal: 20 }}
            keyExtractor={(item) => item.time}
            renderItem={({ item }) => {
              const hasSpace = canPick(item.time, hours, durationMinutes);
              const disabled = !item.available;
              const inRange = isInRange(item.time, selectedHour, hours, durationMinutes);

              const gradientColors = disabled
                ? ["#2b2b2b", "#242424"] as const
                : inRange
                ? ["#d6b370", "#b88b4e"] as const
                : ["#3a3a3a", "#2f2f2f"] as const;

              return (
                <TouchableOpacity
                  disabled={disabled}
                  onPress={() => {
                    if (!hasSpace) {
                      Alert.alert("Uyarı", "Bu saat seçilen servis süresi için yeterli boşluk içermiyor.");
                      return;
                    }
                    onSelect?.(item.time);
                  }}
                  activeOpacity={disabled ? 1 : 0.8}
                  style={styles.slotWrapper}
                >
                  <LinearGradient
                    colors={gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                      styles.slot,
                      disabled && styles.slotDisabled,
                    ]}
                  >
                    <Text style={[styles.slotText, disabled && styles.slotTextDisabled]}>{item.time}</Text>
                    {disabled && (
                      <View style={styles.busyBadge}>
                        <Text style={styles.busyText}>DOLU</Text>
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              );
            }}
        />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 5,
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
  empty: { color: "#fff" },

  slotSelected: {
    backgroundColor: "#AD8C57",
    borderColor: "#AD8C57",
  },
  slotText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  slotTextDisabled: {
    color: "rgba(255,255,255,0.5)",
  },
  slotWrapper: {
    borderRadius: 18,
  },
  slot: {
    minWidth: 90,
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  slotDisabled: {
    borderColor: "rgba(255,255,255,0.04)",
    opacity: 0.7,
  },
  busyBadge: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  busyText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontWeight: "700",
  },
});

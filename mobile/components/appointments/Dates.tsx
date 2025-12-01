import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Spinner from "../ui/Spinner";

export type DatesProps = {
  dates: string[];             // "2025-12-01" gibi
  loading: boolean;
  selectedDate?: string;
  onSelect?: (date: string) => void;
};

const formatDay = (dateStr: string) => {
  const d = new Date(dateStr);
  const dayNum = d.getDate().toString().padStart(2, "0");
  const weekday = d
    .toLocaleDateString("tr-TR", { weekday: "short" })
    .toUpperCase()
    .replace(".", "");
  return { dayNum, weekday };
};

export default function Dates({ dates, loading, selectedDate, onSelect }: DatesProps) {
  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.sectionTitle}>Günler</ThemedText>
        <Spinner size="small" />
      </ThemedView>
    );
  }

  if (!dates || dates.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.sectionTitle}>Günler</ThemedText>
        <ThemedText style={styles.empty}>Günler bulunamadı.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        horizontal
        data={dates}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10 }}
        renderItem={({ item }) => {
          const { dayNum, weekday } = formatDay(item);
          const isSelected = selectedDate === item;
          return (
            <TouchableOpacity onPress={() => onSelect?.(item)} activeOpacity={0.8}>
              <ThemedView
                style={[
                  styles.pill,
                  isSelected && styles.pillSelected,
                ]}
                lightColor="transparent"
                darkColor="transparent"
              >
                <ThemedText style={[styles.dayNum, isSelected && styles.dayNumSelected]}>
                  {dayNum}
                </ThemedText>
                <ThemedText style={[styles.weekday, isSelected && styles.weekdaySelected]}>
                  {weekday}
                </ThemedText>
              </ThemedView>
            </TouchableOpacity>
          );
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    borderRadius: 25,
    backgroundColor: "transparent",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  pill: {
    width: 64,
    height: 72,
    borderRadius: 16,
    backgroundColor: "#3a3a3a",
    alignItems: "center",
    justifyContent: "center",
  },
  pillSelected: {
    backgroundColor: "#AD8C57",
  },
  dayNum: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
  },
  weekday: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255,255,255,0.8)",
  },
  dayNumSelected: {
    color: "#fff",
  },
  weekdaySelected: {
    color: "#fff",
  },
  empty: {
    fontSize: 14,
    color: "#fff",
  },
});

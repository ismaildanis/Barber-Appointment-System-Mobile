import { Barber } from "@/src/types/barber";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Spinner from "../ui/Spinner";
import { useEffect } from "react";

type BarbersProps = {
  barbers: Barber[];
  loading?: boolean;
  selectedBarber?: number;
  onSelect?: (barberId: number) => void;
};

export default function Barbers({ barbers, loading = false, selectedBarber, onSelect }: BarbersProps) {
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Berberler</Text>
        <Spinner size="small" />
      </View>
    );
  }
useEffect(() => {
  barbers?.forEach(b => {
    if (b.image) Image.prefetch(b.image);
  });
}, [barbers]);
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Berberler</Text>
      <View style={{ gap: 12 }}>
        {barbers.map((barber) => {
          const isSelected = selectedBarber === barber.id;
          return (
            <TouchableOpacity key={barber.id} activeOpacity={0.85} onPress={() => onSelect?.(barber.id)}>
              <LinearGradient
                colors={isSelected ? ["#f4e1b4", "#d9ba7a"] : ["#3f3d3b", "#302e2d"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={[styles.pill, isSelected && styles.pillSelected]}
              >
                <Image source={{ uri: barber.image, cache: "force-cache" }} style={styles.image} />
                <View style={{ flex: 1, alignItems: "flex-end", gap: 4, paddingRight: 12 }}>
                  <Text style={[styles.name, isSelected && styles.nameSelected]} numberOfLines={1}>
                    {`${barber.firstName ?? ""} ${barber.lastName ?? ""}`}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: "transparent",
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10, color: "#fff" },
  listContent: { gap: 14, paddingVertical: 6, paddingHorizontal: 6, backgroundColor: "transparent" },
  pill: {
    width: "100%",
    minHeight: 130,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
  },
  pillSelected: { borderColor: "rgba(255,255,255,0.28)" },
  image: {
    width: 100,
    height: 100,
    borderRadius: 20,
    resizeMode: "cover",
    backgroundColor: "#444",
  },
  name: { fontSize: 18, fontWeight: "700", color: "#f5f5f5" },
  nameSelected: { color: "#1b1b1b" },

});

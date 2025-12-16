import { FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Barber } from "@/src/types/barber";
import Spinner from "@/components/ui/Spinner";
import { LinearGradient } from "expo-linear-gradient";
import { myColors } from "@/constants/theme";

type BarberListProps = {
  barbers: Barber[];
  loading?: boolean;
  selectedId?: number | null;
  onSelect?: (id: number) => void;
};

export default function BarberList({ barbers, loading = false, selectedId, onSelect }: BarberListProps) {
  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.sectionTitle}>Berberlerimiz</ThemedText>
        <Spinner size="small" />
      </ThemedView>
    ); 
  } 
 
  if (!barbers || barbers.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.sectionTitle}>Berberlerimiz</ThemedText>
        <ThemedText style={styles.empty}>Henüz berber bulunamadı.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.sectionTitle}>Berberlerimiz</ThemedText>
      {barbers.map((item) => (
        <TouchableOpacity
          key={item.id}
          activeOpacity={0.9}
          onPress={() => onSelect?.(item.id)}
          style={[
            styles.touchable,
            selectedId === item.id && styles.selectedCard,
          ]}
        >
          <LinearGradient
            colors={myColors.mainBackgroundGradient}
            start={{ x: 1, y: 1 }}
            end={{ x: 0.1, y: 0.5 }}
            style={styles.card}
          >
              
            <Image source={{ uri: item.image }} style={styles.image}></Image>
            <ThemedView style={styles.nameContainer}>
              <ThemedText style={styles.name}>
                {item.firstName} {item.lastName}
              </ThemedText>
            </ThemedView>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    overflow: "hidden",
    marginBottom: 16,

   },
  image: {
    justifyContent: "center",
    width: "100%",
    height: 200,
    borderRadius: 14,
    borderCurve: "continuous",
    resizeMode: "cover", 
    marginBottom: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  touchable: { borderRadius: 18 },
  selectedCard: { borderColor: "#4ade80", borderWidth: 1 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12, paddingTop: 8 },
  card: {
    padding: 14,
    borderRadius: 16,

    backgroundColor: "rgba(255,255,255,0.02)",   
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",     

    shadowColor: "transparent",                   
  },
  nameContainer: {flexDirection: "row", justifyContent: "center", backgroundColor: "transparent"},
  name: { padding: 8, flexDirection: "column", justifyContent: "center", fontSize: 16, fontWeight: "700", color: "#fff" },
  empty: { fontSize: 14, color: "#fff" },
});

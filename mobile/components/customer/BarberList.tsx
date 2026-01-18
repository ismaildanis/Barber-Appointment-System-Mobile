import { Image, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Barber } from "@/src/types/barber";
import Spinner from "@/components/ui/Spinner";

type BarberListProps = {
  barbers: Barber[];
  loading?: boolean;
  selectedId?: number | null;
  onSelect?: (id: number) => void;
};

export default function BarberList({ barbers, loading = false, selectedId, onSelect }: BarberListProps) {
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Berberlerimiz</Text>
        <Spinner size="small" />
      </View>
    ); 
  } 
 
  if (!barbers || barbers.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Berberlerimiz</Text>
        <Text style={styles.empty}>Henüz berber bulunamadı.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Berberlerimiz</Text>
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
          <View style={styles.card}> 
            <Image source={{ uri: item.image }} style={styles.image}></Image>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>
                {item.firstName} {item.lastName}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 25,
    backgroundColor: "#121212",
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
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12, paddingTop: 8, color: "#fff" },
  card: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: "#1E1E1E",   
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",                      
  },
  nameContainer: {flexDirection: "row", justifyContent: "center", backgroundColor: "transparent"},
  name: { padding: 8, flexDirection: "column", justifyContent: "center", fontSize: 16, fontWeight: "700", color: "#fff" },
  empty: { fontSize: 14, color: "#fff" },
});

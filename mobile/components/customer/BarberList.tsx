import { FlatList, Image, StyleSheet, Text } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Barber } from "@/src/types/barber";
import Spinner from "@/components/ui/Spinner";
import { LinearGradient } from "expo-linear-gradient";
import { myColors } from "@/constants/theme";

type BarberListProps = { barbers: Barber[]; loading?: boolean };

export default function BarberList({ barbers, loading = false }: BarberListProps) {
  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.sectionTitle}>Berberlerimiz</ThemedText>
        <Spinner size="small" />
      </ThemedView>
    ); 
  } 
  console.log(barbers);
  console.log(barbers.map((barber) => barber.image));
 
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
      <FlatList
        data={barbers}
        style={{ backgroundColor: "transparent" }}
        scrollEnabled={false}
        nestedScrollEnabled={false}
        keyExtractor={(item) => String(item.id)}
        ItemSeparatorComponent={() => <ThemedView style={{ height: 10, backgroundColor: "transparent" }} />}
        renderItem={({ item }) => (
        <LinearGradient
          colors={myColors.mainBackgroundGradient}
          start={{ x: 1, y: 1 }}
          end={{ x: 0.1, y: 0.5 }}
          style={styles.card}
        >
            
          <Image source={{ uri: item.image }} style={styles.image}></Image>
          <ThemedText style={styles.name}>
            {item.firstName} {item.lastName}
          </ThemedText>
        </LinearGradient>
        
        )}
      />
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
    width: "100%",
    height: 200,
    borderRadius: 14,
    borderCurve: "continuous",
    resizeMode: "cover", 
    marginBottom: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
  },

  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12, paddingTop: 8 },
  card: {
    padding: 14,
    borderRadius: 16,

    backgroundColor: "rgba(255,255,255,0.02)",   
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",     

    shadowColor: "transparent",                   
  },
  name: { fontSize: 16, fontWeight: "700", color: "#fff" },
  empty: { fontSize: 14, color: "#fff" },
});

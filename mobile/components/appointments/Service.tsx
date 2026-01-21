import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import Spinner from "../ui/Spinner";
import { Service } from "@/src/types/service";


type ServicesProps = {
  services: Service[] | undefined;
  loading?: boolean;
  selectedService?: Array<number>;
  onSelect?: (serviceId: number) => void;
};

export default function Services({ services, loading, selectedService, onSelect }: ServicesProps) {
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Hizmetler</Text>
        <Spinner size="small" />
      </View>
    );
  }

  if (!services?.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Hizmetler</Text>
        <Text style={styles.empty}>Henüz hizmet bulunamadı.</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Hizmetler</Text>
      <View style={{ gap: 12 }}>
        {services.map((item) => {
          const isSelected = selectedService?.includes(item.id);
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.85}
              onPress={() => onSelect?.(item.id)}
              style={[styles.card, isSelected && styles.cardSelected]}
            >
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.image} />
              ) : (
                <View style={[styles.image, styles.imagePlaceholder]} />
              )}
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={[styles.name, isSelected && styles.nameSelected]}>{item.name}</Text>
                {item.description ? (
                  <Text numberOfLines={2} style={styles.desc}>
                    {item.description}
                  </Text>
                ) : null}
                <View style={styles.metaRow}>
                  <Text style={styles.meta}>{item.duration} dk</Text>
                  <Text style={styles.meta}>{item.price} ₺</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#fff",
    alignSelf: "center",
  },
  empty: { color: "#fff" },
  card: {
    flexDirection: "row",
    gap: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#1e1e1e",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
  },
  cardSelected: {
    backgroundColor: "#E4D2AC",
    borderColor: "#E4D2AC",
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#444",
  },
  imagePlaceholder: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  nameSelected: {
    color: "#1b1b1b",
  },
  desc: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
  },
  metaRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  meta: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
  },
});

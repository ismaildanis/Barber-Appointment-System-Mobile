import { Barber } from "@/src/types/barber";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Spinner from "../ui/Spinner";


type BarbersProps = {
    barbers: Barber[]
    loading?: boolean
    selectedBarber?: number
    onSelect?: (barberId: number) => void
}

export default function Barbers({ barbers, loading, selectedBarber, onSelect }: BarbersProps) {
    if (loading) {
        return (
            <View style={styles.container}>
            <Text style={styles.sectionTitle}>Berberler</Text>
            <Spinner size="small" />
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <FlatList
                bounces={false}
                horizontal
                data={barbers}
                keyExtractor={(item: Barber) => String(item.id)}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[styles.listContent]}
                renderItem={({ item: barber }) => {
                    const isSelected = selectedBarber === barber.id;
                    return (
                        <TouchableOpacity onPress={() => onSelect?.(barber.id)} activeOpacity={0.8} style={{ marginRight: 10 }}>
                            <View
                                style={[
                                    styles.pill,
                                    isSelected && styles.pillSelected,
                                ]}
                            >
                                <Image
                                    source={{ uri: barber.image }}
                                    style={[styles.image, { opacity: isSelected ? 1 : 0.5 }]}
                                />
                                <Text
                                    style={[
                                        styles.pillText,
                                        isSelected && styles.pillTextSelected,
                                    ]}
                                >
                                    {barber.firstName}
                                </Text>
                            </View>
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
    },
    listContent: { gap: 12, paddingBottom: 12 },
    image: {
        width: 100,
        height: 100,
        borderRadius: 14,
        borderCurve: "continuous",
        resizeMode: "cover",
    },
    pill: {
        borderRadius: 16,
        backgroundColor: "#3a3a3a",
        alignItems: "center",
        justifyContent: "center",
    },
    pillSelected: {
        backgroundColor: "#fff",
    },

    pillText: {
        fontSize: 18,
        fontWeight: "800",
        color: "#fff",
    },
    pillTextSelected: {
        color: "#3a3a3a",
    },
});
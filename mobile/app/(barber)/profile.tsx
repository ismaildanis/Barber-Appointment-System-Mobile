import { useUnifiedMe, useUnifiedLogout } from "@/src/hooks/useUnifiedAuth";
import Spinner from "@/components/ui/Spinner";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, StyleSheet, RefreshControl, ScrollView, Image, Alert } from "react-native";
import { useBarberUploadImage, useBarberDeleteImage } from "@/src/hooks/useBarberQuery";
import * as ImagePicker from "expo-image-picker";
import { todayAppointmentsColors } from "@/constants/theme/barber/todayAppt";

export default function BarberProfile() {
  const router = useRouter();
  const { data, isLoading, isError, refetch, isRefetching } = useUnifiedMe();
  const logout = useUnifiedLogout();

  const uploadImage = useBarberUploadImage();
  const deleteImage = useBarberDeleteImage();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Spinner size="large" />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <SafeAreaView style={styles.container}> 
        <Text style={styles.title}>Profil</Text>
        <View style={styles.center}>
          <Text style={styles.empty}>Profil yüklenemedi. Yenilemeyi deneyin.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Uyarı", "Galeri izni verilmedi");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (result.canceled) return;

    const asset = result.assets[0];
    const formData = new FormData();
    formData.append("file", {
      uri: asset.uri,
      name: `barber-${Date.now()}.jpg`,
      type: "image/jpeg",
    } as any);

    uploadImage.mutate(formData, {
      onSuccess: () => Alert.alert("Başarılı", "Resim Yüklendi"),
      onError: (err: any) => {
        console.log(err)
        Alert.alert("Hata", err?.response?.data?.message || "Yüklenemedi");
      },
    })
  }

    const onRemoveImage = () => {
    Alert.alert("Resmi Kaldır", "Servis resmini kaldırmak istediğinizden emin misiniz?", [
      { text: "Vazgeç", style: "cancel" },
      {
        text: "Kaldır",
        style: "destructive",
        onPress: () => {
          deleteImage.mutate(undefined, { onSuccess: () => refetch() });
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        contentContainerStyle={{ gap: 16, paddingBottom: 32 }}
      >
        <Image 
          source={{ uri: data.image, cache: "force-cache" }}
          style={styles.cardImage}
        /> 
        <View style={{ flexDirection: "row", justifyContent: "center", gap: 8, alignItems: "center" }}>
          <TouchableOpacity onPress={pickImage} style={{ backgroundColor: "#AD8C57", padding: 8, borderRadius: 10, width: "45%" }}>
            <Text style={{ color: "#000", fontSize: 16, alignSelf: "center", fontWeight: "700" }}>Resim Yükle</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onRemoveImage} style={{ backgroundColor: "#631919ff", padding: 8, borderRadius: 10, width: "45%", marginRight: 0 }}>
            <Text style={{ color: "#fff", fontSize: 16, alignSelf: "center", fontWeight: "700" }}>Resim Sil</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Ad Soyad</Text>
          <Text style={styles.value}>{`${data.firstName ?? ""} ${data.lastName ?? ""}`.trim()}</Text>

          <Text style={styles.label}>E-posta</Text>
          <Text style={styles.value}>{data.email ?? "—"}</Text>

          <Text style={styles.label}>Telefon</Text>
          <Text style={styles.value}>{data.phone ?? "—"}</Text>

          <Text style={styles.label}>Durum</Text>
          <Text style={styles.value}>{data.active ? "Aktif" : "Aktif Değil"}</Text>
        </View>

        <TouchableOpacity
          style={styles.workingHourBtn}
          onPress={() => router.replace("/(barber)/workingHour")}
        >
          <Text style={styles.workingHourText}>Çalışma Saatlerim</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/change-password-barber")}
          style={styles.changeBtn}
        >
          <Text style={styles.logoutText}>
            Şifre Değiştir
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            logout.mutate(undefined, {
              onSuccess: () => router.replace("/(auth)/login"),
            })
          }
          disabled={logout.isPending}
          style={[styles.logoutBtn, logout.isPending && { opacity: 0.7 }]}
        >
          <Text style={styles.logoutText}>
            {logout.isPending ? "Çıkış yapılıyor..." : "Çıkış Yap"}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: todayAppointmentsColors.containerBackground, marginBottom: 32 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 8, color: "#fff", marginTop: 16 },
  empty: { color: "#ccc", marginTop: 8 },
  card: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 8,
  },

  label: { fontSize: 13, color: "rgba(255,255,255,0.7)" },
  value: { fontSize: 16, fontWeight: "700", color: "#fff" },
  workingHourBtn: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#AD8C57",
    alignItems: "center",
  },
  workingHourText: { color: "#121212", fontWeight: "800" },
  logoutBtn: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#631919ff",
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontWeight: "800", textAlign: "center" },
  
  cardImage: {
    width: "100%",
    height: 200,
    borderRadius: 14,
    borderCurve: "continuous",
    resizeMode: "contain", 
    marginBottom: 10,
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  changeBtn: {
    marginTop: 4,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#AD8C57",
  },
});

import { useUnifiedMe, useUnifiedLogout } from "@/src/hooks/useUnifiedAuth";
import Spinner from "@/components/ui/Spinner";
import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { themeColors } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdminProfile() {
  const router = useRouter();
  const { data, isLoading, isError, refetch, isRefetching } = useUnifiedMe();
  const logout = useUnifiedLogout();
  const navigation = useNavigation();

  const onLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "(auth)/login" }],
          })
        );
      },
    });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Spinner size="large" />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.replace("/(admin)/(tabs)/dashboard")}>
          <Ionicons name="arrow-back" size={22} color={themeColors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Profil</Text>
        <View style={styles.errorCard}>
          <Ionicons name="alert-circle" size={48} color={themeColors.error} />
          <Text style={styles.errorText}>Profil yüklenemedi</Text>
          <Text style={styles.errorSubtext}>Yenilemeyi deneyin</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryText}>Yeniden Dene</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.replace("/(admin)/(tabs)/dashboard")}>
            <Ionicons name="arrow-back" size={22} color={themeColors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.title}>Profil Bilgileri</Text>
          <Text style={styles.subtitle}>Hesap ayarlarınızı görüntüleyin</Text>
        </View>

        {/* Profile Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {data.firstName?.charAt(0)}{data.lastName?.charAt(0)}
            </Text>
          </View>
          <Text style={styles.avatarName}>
            {`${data.firstName ?? ""} ${data.lastName ?? ""}`.trim()}
          </Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{data.role === "admin" ? "Yönetici" : "Kullanıcı"}</Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="person-outline" size={20} color={themeColors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.label}>Ad Soyad</Text>
              <Text style={styles.value}>
                {`${data.firstName ?? ""} ${data.lastName ?? ""}`.trim() || "—"}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="mail-outline" size={20} color={themeColors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.label}>E-posta</Text>
              <Text style={styles.value}>{data.email ?? "—"}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="call-outline" size={20} color={themeColors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.label}>Telefon</Text>
              <Text style={styles.value}>{data.phone ?? "—"}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="shield-checkmark-outline" size={20} color={themeColors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.label}>Rol</Text>
              <Text style={styles.value}>
                {data.role === "admin" ? "Yönetici" : "Kullanıcı"}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.replace("/change-password-admin")}
          style={styles.changeBtn}
          activeOpacity={0.8}
        >
          <Ionicons name="key-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.changeText}>Şifre Değiştir</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={() => onLogout()}
          disabled={logout.isPending}
          style={[styles.logoutBtn, logout.isPending && { opacity: 0.6 }]}
          activeOpacity={0.8}
        >
          <Ionicons 
            name="log-out-outline" 
            size={20} 
            color="#fff" 
            style={{ marginRight: 8 }}
          />
          <Text style={styles.logoutText}>
            {logout.isPending ? "Çıkış yapılıyor..." : "Çıkış Yap"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: themeColors.background,
    paddingHorizontal: 16,
  },
  header: {
    marginTop: 8,
    marginBottom: 8,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: themeColors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: themeColors.border,
  },
  titleSection: {
    marginBottom: 24,
  },
  title: { 
    fontSize: 28, 
    fontWeight: "800", 
    color: themeColors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: themeColors.textMuted,
  },
  
  // Avatar Section
  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 20,
    backgroundColor: themeColors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: themeColors.border,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: themeColors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "800",
    color: themeColors.textOnPrimary,
  },
  avatarName: {
    fontSize: 20,
    fontWeight: "700",
    color: themeColors.text,
    marginBottom: 8,
  },
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: themeColors.surfaceLight,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: themeColors.primary,
  },
  roleText: {
    fontSize: 13,
    fontWeight: "600",
    color: themeColors.primary,
  },

  // Info Card
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: themeColors.surface,
    borderWidth: 1,
    borderColor: themeColors.border,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: themeColors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  label: { 
    fontSize: 12, 
    color: themeColors.textDim,
    marginBottom: 4,
  },
  value: { 
    fontSize: 16, 
    fontWeight: "600", 
    color: themeColors.text,
  },
  divider: {
    height: 1,
    backgroundColor: themeColors.border,
    marginVertical: 4,
  },

  changeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 14,
    backgroundColor: themeColors.primary,
    marginBottom: 12,
  },
  changeText: {
    color: themeColors.textOnPrimary,
    fontWeight: "700",
    fontSize: 16,
  },

  // Logout Button
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 14,
    backgroundColor: themeColors.error,
    marginBottom: 16,
  },
  logoutText: { 
    color: "#fff", 
    fontWeight: "700", 
    fontSize: 16,
  },

  // Error State
  errorCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "700",
    color: themeColors.text,
  },
  errorSubtext: {
    fontSize: 14,
    color: themeColors.textMuted,
  },
  retryBtn: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: themeColors.primary,
    borderRadius: 12,
  },
  retryText: {
    color: themeColors.textOnPrimary,
    fontWeight: "700",
    fontSize: 15,
  },
});
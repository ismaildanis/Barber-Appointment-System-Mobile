import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { LastAppointment } from "@/src/types/appointment";
import Spinner from "../ui/Spinner";
import { myColors } from "@/constants/theme";

type Props = { 
    scheduledAppt?: LastAppointment | null; 
    loading: boolean;
};

const getInitials = (firstName?: string, lastName?: string) =>
  `${firstName?.[0] ?? "B"}${lastName?.[0] ?? ""}`.toUpperCase();

const formatDate = (dateStr?: string) =>
  dateStr
    ? new Date(dateStr).toLocaleString("tr-TR", {
        timeZone: "Europe/Istanbul",
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

export default function ScheduledAppointment({ scheduledAppt, loading }: Props) {
  if (loading) return <Spinner />;
  if (!scheduledAppt) return null;

  const barberName = `${scheduledAppt.barber?.firstName ?? ""} ${scheduledAppt.barber?.lastName ?? ""}`.trim();
  const firstService = scheduledAppt.appointmentServices?.[0];
  const serviceName = firstService?.service?.name ?? "Hizmet";
  const dateLabel = formatDate(scheduledAppt.appointmentStartAt);
  const initials = getInitials(scheduledAppt.barber?.firstName, scheduledAppt.barber?.lastName);

  return (
    <View style={styles.wrapper}>
      <BlurView intensity={30} tint="dark" style={styles.blur}>
        <LinearGradient
          colors={["#C8AA7A", "#E4D2AC"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.outer}
        >
          <LinearGradient
            colors={myColors.mainBackgroundGradient}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.inner}
          >
            <Text style={styles.subtitle}>Yaklaşan Randevunuz</Text>
            <View style={styles.headerRow}>
              <LinearGradient
                colors={["#F1D9A5", "#E4C88A"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>{initials}</Text>
              </LinearGradient>

              <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>
                  {barberName || "Berber"}
                </Text>
                <Text style={styles.meta} numberOfLines={1}>
                  {serviceName}
                </Text>
                <Text style={styles.meta}>{dateLabel}</Text>
              </View>
            </View>
          </LinearGradient>
        </LinearGradient>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 10,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  blur: {
    width: "100%",
    borderRadius: 24,
    overflow: "hidden",
  },
  outer: {
    borderRadius: 24,
    padding: 16,
  },
  inner: {
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.55)",
    padding: 18,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "rgba(255,255,255,0.8)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontWeight: "800",
    fontSize: 22,
    color: "#1A1A1A",
  },
  info: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
  },
  meta: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
  },
});

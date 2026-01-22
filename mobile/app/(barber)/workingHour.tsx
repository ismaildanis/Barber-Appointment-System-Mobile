import { useState } from "react";
import {
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useCreateWorkingHour,
  useDeleteWorkingHour,
  useGetWorkingHours,
  useUpdateWorkingHour,
} from "@/src/hooks/useWorkingHourQuery";
import { dayOfWeekLabel, DayOfWeek, WorkingHour } from "@/src/types/workingHour";

type FormValues = {
  dayOfWeek: DayOfWeek;
  startMin: number;
  endMin: number;
};

const formatTime = (m: number) => {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${h.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
};

const generateTimeSlots = () => {
  const slots = [];
  for (let min = 480; min <= 1440; min += 15) {
    slots.push(min);
  }
  return slots;
};

const timeSlots = generateTimeSlots();

export default function WorkingHourPage() {
  const { data: workingHours, isRefetching, refetch } = useGetWorkingHours();
  const createWorkingHour = useCreateWorkingHour();
  const deleteWorkingHour = useDeleteWorkingHour();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [values, setValues] = useState<FormValues>({ dayOfWeek: 1, startMin: 540, endMin: 1020 });

  const updateWorkingHour = useUpdateWorkingHour(editingId || 0);

  const openAdd = () => {
    setEditingId(null);
    setValues({ dayOfWeek: 1, startMin: 540, endMin: 1020 });
    setModalVisible(true);
  };

  const openEdit = (w: WorkingHour) => {
    setEditingId(w.id);
    setValues({ dayOfWeek: w.dayOfWeek, startMin: w.startMin, endMin: w.endMin });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingId(null);
  };
  const onDelete = (w: WorkingHour) => {
    Alert.alert("Uyarı", "Silmek istediginizden emin misiniz?", [
      { text: "Vazgeç", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: () => {
          deleteWorkingHour.mutate(w.id, {
            onSuccess: () => {
              refetch();
            },
            onError: (err: any) => {
              Alert.alert("Hata", err?.response?.data?.message || "Silme basarısız.");
            },
          });
        },
      },
    ])
  }
  const onSubmit = () => {
    if (values.endMin <= values.startMin) {
      Alert.alert("Uyarı", "Bitiş saati başlangıçtan sonra olmalı.");
      return;
    }

    const payload = {
      dayOfWeek: values.dayOfWeek,
      startMin: values.startMin,
      endMin: values.endMin,
    };

    if (editingId) {
      updateWorkingHour.mutate(payload, {
        onSuccess: () => {
          closeModal();
          refetch();
        },
        onError: (err: any) => {
          Alert.alert("Hata", err?.response?.data?.message || "Güncelleme başarısız.");
        },
      });
    } else {
      createWorkingHour.mutate(payload, {
        onSuccess: () => {
          closeModal();
          refetch();
        },
        onError: (err: any) => {
          Alert.alert("Hata", err?.response?.data?.message || "Ekleme başarısız.");
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Çalışma Saatleri</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Text style={styles.addBtnText}>+ Ekle</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        contentContainerStyle={styles.list}
      >
        {workingHours?.map((w) => (
          <TouchableOpacity key={w.id} style={styles.card} onPress={() => openEdit(w)} activeOpacity={0.8}>
            <View style={styles.cardRow}>
              <Text style={styles.day}>{dayOfWeekLabel[w.dayOfWeek]}</Text>
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  onDelete(w);
                }}
                style={{ padding: 8, backgroundColor:"#631919ff", borderRadius: 14, alignItems: "center" }}
              >
                <Text style={styles.deleteText}>Sil</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.time}>
              {formatTime(w.startMin)} - {formatTime(w.endMin)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={closeModal}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{editingId ? "Düzenle" : "Yeni Ekle"}</Text>

            {!editingId && (
              <DaySelector
                selectedDay={values.dayOfWeek}
                onSelect={(day) => setValues((p) => ({ ...p, dayOfWeek: day }))}
              />
            )}

            {editingId && (
              <View style={styles.field}>
                <Text style={styles.label}>Gün</Text>
                <Text style={styles.staticText}>{dayOfWeekLabel[values.dayOfWeek]}</Text>
              </View>
            )}

            <TimeSelector
              label="Başlangıç"
              selectedMin={values.startMin}
              onSelect={(min) => setValues((p) => ({ ...p, startMin: min }))}
            />

            <TimeSelector
              label="Bitiş"
              selectedMin={values.endMin}
              onSelect={(min) => setValues((p) => ({ ...p, endMin: min }))}
            />

            <View style={styles.actions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={closeModal}>
                <Text style={styles.cancelText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={onSubmit}>
                <Text style={styles.saveText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function DaySelector({ selectedDay, onSelect }: {
  selectedDay: DayOfWeek;
  onSelect: (day: DayOfWeek) => void;
}) {
  const [open, setOpen] = useState(false);

  const days: DayOfWeek[] = [1, 2, 3, 4, 5, 6];

  return (
    <View style={styles.field}>
      <Text style={styles.label}>Gün</Text>
      <TouchableOpacity style={styles.selectBox} onPress={() => setOpen(!open)}>
        <Text style={styles.selectText}>{dayOfWeekLabel[selectedDay]}</Text>
        <Text style={styles.arrow}>{open ? "▲" : "▼"}</Text>
      </TouchableOpacity>
      {open && (
        <ScrollView style={styles.dropdown} nestedScrollEnabled>
          {days.map((day) => (
            <TouchableOpacity
              key={day}
              style={[styles.option, selectedDay === day && styles.optionActive]}
              onPress={() => {
                onSelect(day);
                setOpen(false);
              }}
            >
              <Text style={[styles.optionText, selectedDay === day && styles.optionTextActive]}>
                {dayOfWeekLabel[day]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

function TimeSelector({ label, selectedMin, onSelect }: {
  label: string;
  selectedMin: number;
  onSelect: (min: number) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.selectBox} onPress={() => setOpen(!open)}>
        <Text style={styles.selectText}>{formatTime(selectedMin)}</Text>
        <Text style={styles.arrow}>{open ? "▲" : "▼"}</Text>
      </TouchableOpacity>
      {open && (
        <ScrollView style={styles.dropdown} nestedScrollEnabled>
          {timeSlots.map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.option, selectedMin === m && styles.optionActive]}
              onPress={() => {
                onSelect(m);
                setOpen(false);
              }}
            >
              <Text style={[styles.optionText, selectedMin === m && styles.optionTextActive]}>
                {formatTime(m)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1e1e1e", marginBottom: 32 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  title: { fontSize: 20, fontWeight: "700", color: "#fff" },
  addBtn: { backgroundColor: "#E4D2AC", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  addBtnText: { color: "#000", fontWeight: "700" },
  list: { padding: 16, gap: 12 },
  card: {
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  cardRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  day: { color: "#E4D2AC", fontWeight: "700" },
  deleteText: { color: "#F44336", fontWeight: "600"},
  time: { color: "#fff", fontSize: 16 },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.8)", justifyContent: "flex-end" },
  modal: { backgroundColor: "#2a2a2a", borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#fff", marginBottom: 16 },
  field: { marginBottom: 16 },
  label: { color: "#E4D2AC", fontSize: 14, marginBottom: 8, fontWeight: "600" },
  staticText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  selectBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  selectText: { color: "#fff", fontSize: 16 },
  arrow: { color: "rgba(255,255,255,0.6)", fontSize: 12 },
  dropdown: {
    maxHeight: 150,
    marginTop: 8,
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  option: { padding: 12 },
  optionActive: { backgroundColor: "#E4D2AC" },
  optionText: { color: "#fff", textAlign: "center" },
  optionTextActive: { color: "#000", fontWeight: "600" },
  actions: { flexDirection: "row", gap: 10, marginTop: 8 },
  cancelBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  cancelText: { color: "#fff", fontWeight: "600" },
  saveBtn: { flex: 1, padding: 12, borderRadius: 8, backgroundColor: "#E4D2AC", alignItems: "center" },
  saveText: { color: "#000", fontWeight: "700" },
});
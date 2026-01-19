import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, KeyboardAvoidingView, Platform, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type FormValues = {
  name: string;
  description: string;
  price: string;
  duration: string;
  imageUri?: string;
};

type Props = {
  visible: boolean;
  values: FormValues;
  setValues: (patch: Partial<FormValues>) => void;
  onClose: () => void;
  onSubmit: () => void;
  onPickImage: () => void;
  onRemoveImage: () => void;
  isSubmitting?: boolean;
  title?: string;
  subtitle?: string;
};

export function ServiceFormModal({
  visible, values, setValues, onClose, onSubmit,
  onPickImage, onRemoveImage, isSubmitting, title, subtitle
}: Props) {
  return (
    <Modal   
      visible={visible}
      animationType={Platform.OS === "android" ? "none" : "slide"}
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
      hardwareAccelerated
    >
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <View style={styles.overlay}>
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{title || "Yeni Servis Ekle"}</Text>
                <Text style={styles.subtitle}>{subtitle || "Servis detaylarını girin"}</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="rgba(255,255,255,0.8)" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled">
              <Text style={styles.label}>Servis Adı *</Text>
              <TextInput
                value={values.name}
                onChangeText={(name) => setValues({ name })}
                placeholder="Örn. Saç Kesimi"
                placeholderTextColor="rgba(255,255,255,0.3)"
                style={styles.input}
              />

              <Text style={styles.label}>Açıklama</Text>
              <TextInput
                value={values.description}
                onChangeText={(description) => setValues({ description })}
                placeholder="Servis hakkında kısa açıklama yazın"
                placeholderTextColor="rgba(255,255,255,0.3)"
                style={[styles.input, { minHeight: 90, textAlignVertical: "top" }]}
                multiline
              />

              <View style={{ flexDirection: "row", gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Fiyat (₺) *</Text>
                  <TextInput
                    value={values.price}
                    onChangeText={(price) => setValues({ price })}
                    placeholder="250"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    style={styles.input}
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Süre (dk) *</Text>
                  <TextInput
                    value={values.duration}
                    onChangeText={(duration) => setValues({ duration })}
                    placeholder="15, 30, 45..."
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    style={styles.input}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <Text style={styles.label}>Servis Görseli</Text>
              {values.imageUri ? (
                <View style={{ gap: 12 }}>
                  <Image source={{ uri: values.imageUri }} style={styles.preview} />
                  <View style={{ flexDirection: "row", gap: 12 }}>
                    <TouchableOpacity style={styles.changeBtn} onPress={onPickImage}>
                      <Ionicons name="image-outline" size={18} color="#AD8C57" />
                      <Text style={styles.changeText}>Değiştir</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.removeBtn} onPress={onRemoveImage}>
                      <Ionicons name="trash-outline" size={18} color="#F44336" />
                      <Text style={styles.removeText}>Kaldır</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity style={styles.upload} onPress={onPickImage}>
                  <Ionicons name="cloud-upload-outline" size={32} color="rgba(255,255,255,0.4)" />
                  <Text style={styles.uploadText}>Görsel Yükle</Text>
                  <Text style={styles.uploadSubtext}>PNG, JPG veya WEBP (Maks. 5MB)</Text>
                </TouchableOpacity>
              )}
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={isSubmitting}>
                <Text style={styles.cancelText}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={onSubmit} disabled={isSubmitting}>
                <Ionicons name="checkmark" size={20} color="#121212" />
                <Text style={styles.submitText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.8)", justifyContent: "flex-end" },
  content: { backgroundColor: "#1a1a1a", borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: "90%", borderWidth: 1, borderColor: "rgba(173,140,87,0.2)" },
  header: { flexDirection: "row", alignItems: "center", padding: 20, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.08)" },
  title: { fontSize: 22, fontWeight: "700", color: "#fff" },
  subtitle: { fontSize: 14, color: "rgba(255,255,255,0.6)", marginTop: 4 },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.05)", alignItems: "center", justifyContent: "center" },
  scroll: { maxHeight: 450, paddingHorizontal: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "rgba(255,255,255,0.9)", marginTop: 20, marginBottom: 8 },
  input: { backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", borderRadius: 12, padding: 14, color: "#fff", fontSize: 15 },
  upload: { backgroundColor: "rgba(255,255,255,0.03)", borderWidth: 2, borderStyle: "dashed", borderColor: "rgba(255,255,255,0.2)", borderRadius: 12, padding: 32, alignItems: "center", justifyContent: "center" },
  uploadText: { fontSize: 16, fontWeight: "600", color: "rgba(255,255,255,0.7)", marginTop: 12 },
  uploadSubtext: { fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 },
  preview: { width: "100%", height: 200, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.05)" },
  changeBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "rgba(173,140,87,0.15)", paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: "rgba(173,140,87,0.3)" },
  changeText: { fontSize: 14, fontWeight: "600", color: "#AD8C57" },
  removeBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "rgba(244,67,54,0.15)", paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: "rgba(244,67,54,0.3)" },
  removeText: { fontSize: 14, fontWeight: "600", color: "#F44336" },
  footer: { flexDirection: "row", gap: 12, padding: 20, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.08)" },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.05)", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  cancelText: { fontSize: 16, fontWeight: "600", color: "rgba(255,255,255,0.8)" },
  submitBtn: { flex: 1, flexDirection: "row", gap: 8, paddingVertical: 14, borderRadius: 12, backgroundColor: "#AD8C57", alignItems: "center", justifyContent: "center" },
  submitText: { fontSize: 16, fontWeight: "700", color: "#121212" },
});

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  useGetServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
  useUploadImage,
  useDeleteImage,
} from "@/src/hooks/useServiceQuery";
import { Service } from "@/src/types/service";
import Spinner from "@/components/ui/Spinner";

export default function ServicesScreen() {
  const { data: services, isLoading, isRefetching, refetch } = useGetServices();
  
  const deleteService = useDeleteService();
  const createService = useCreateService();
  const [editingId, setEditingId] = useState<number | null>(null);

  const updateService = useUpdateService(editingId || 0);
  const uploadImage = useUploadImage(editingId || 0);
  const deleteImage = useDeleteImage(editingId || 0);

  const [showFormModal, setShowFormModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");

  const isWorking =
    createService.isPending ||
    updateService.isPending ||
    deleteService.isPending ||
    uploadImage.isPending ||
    deleteImage.isPending ||
    isRefetching;

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setDuration("");
    setImageUri(undefined);
    setEditingId(null);
    setShowFormModal(false);
  };

  const onSubmit = () => {
    if (!name.trim() || !price.trim() || !duration) {
      Alert.alert("Eksik Bilgi", "Servis adı, fiyat ve süre zorunludur.");
      return;
    }

    const dur = Number(duration);
    if (Number.isNaN(dur) || dur <= 0 || dur % 15 !== 0) {
      Alert.alert("Geçersiz süre", "Süre 15’in katı ve pozitif olmalı (ör. 15, 30, 45).");
      return;
    }

    const serviceData = {
      name: name.trim(),
      description: description.trim() || undefined,
      price: price.trim(),
      duration: Number(duration),
    };

    if (editingId) {
      updateService.mutate(serviceData, {
        onSuccess: () => {
          Alert.alert("Başarılı", "Servis güncellendi!");
          resetForm();
          refetch();
        },
      });
    } else {
      createService.mutate(serviceData, {
        onSuccess: () => {
          Alert.alert("Başarılı", "Yeni servis eklendi!");
          resetForm();
          refetch();
        },
      });
    }
  };

  const onDelete = (id: number, itemName: string) => {
    Alert.alert(
      "Hizmeti Sil",
      `"${itemName}" hizmeti silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`,
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: () => {
            deleteService.mutate(id, {
              onSuccess: () => {
                Alert.alert("Başarılı", "Hizmet silindi.");
                refetch();
              },
            });
          },
        },
      ]
    );
  };
  const startEdit = (item: Service) => {
    setEditingId(item.id);
    setName(item.name);
    setDescription(item.description || "");
    setPrice(item.price || "");
    setDuration(String(item.duration ?? ""));
    setImageUri(item.image);
    setShowFormModal(true);
  };

  const startCreate = () => {
    resetForm();
    setShowFormModal(true);
  };

  const pickAndUpload = async () => {
    Alert.alert("Bilgi", "Image picker entegrasyonunu burada ekleyin.");
  };

  const onRemoveImage = () => {
    if (!editingId) return;
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

  const filteredServices = (services || []).filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: { item: Service }) => {
    return (
      <View style={styles.serviceCard}>
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.serviceImage} resizeMode="cover" />
        )}

        <View style={styles.serviceContent}>
          <View style={styles.serviceHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.serviceName}>{item.name}</Text>
              {item.description && (
                <Text style={styles.serviceDescription} numberOfLines={2}>
                  {item.description}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.serviceFooter}>
            <View style={styles.serviceInfo}>
              <View style={styles.infoBadge}>
                <Ionicons name="cash-outline" size={16} color="#AD8C57" />
                <Text style={styles.infoText}>{item.price} ₺</Text>
              </View>
              <View style={styles.infoBadge}>
                <Ionicons name="time-outline" size={16} color="#AD8C57" />
                <Text style={styles.infoText}>{item.duration} dk</Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => startEdit(item)}
                activeOpacity={0.7}
              >
                <Ionicons name="create-outline" size={18} color="#AD8C57" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => onDelete(item.id, item.name)}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={18} color="#F44336" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (isLoading) return <Spinner />;

  return (
    <SafeAreaView style={styles.container}>
      {isWorking && <Spinner />}

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Servisler</Text>
          <Text style={styles.subtitle}>
            {filteredServices.length} servis bulundu
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={startCreate}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={24} color="#121212" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="rgba(255,255,255,0.5)" />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Servis ara..."
          placeholderTextColor="rgba(255,255,255,0.4)"
          style={styles.searchInput}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.5)" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredServices}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cut-outline" size={64} color="rgba(255,255,255,0.2)" />
            <Text style={styles.emptyTitle}>
              {searchQuery ? "Servis bulunamadı" : "Henüz servis eklenmemiş"}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery
                ? "Farklı bir arama terimi deneyin"
                : "Yeni servis eklemek için + butonuna tıklayın"}
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={showFormModal}
        animationType="slide"
        transparent={true}
        onRequestClose={resetForm}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>
                  {editingId ? "Servisi Düzenle" : "Yeni Servis Ekle"}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {editingId ? "Servis bilgilerini güncelleyin" : "Servis detaylarını girin"}
                </Text>
              </View>
              <TouchableOpacity onPress={resetForm} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="rgba(255,255,255,0.8)" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Servis Adı <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Örn. Saç Kesimi"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  style={styles.input}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Açıklama</Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Servis hakkında kısa açıklama yazın"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  style={[styles.input, styles.textArea]}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>
                    Fiyat (₺) <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    value={price}
                    onChangeText={setPrice}
                    placeholder="250"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    style={styles.input}
                    keyboardType="numeric"
                  />
                </View>

                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>
                    Süre (dk) <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    value={duration}
                    onChangeText={setDuration}
                    placeholder="30"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    style={styles.input}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Servis Görseli</Text>
                {imageUri ? (
                  <View style={styles.imagePreview}>
                    <Image source={{ uri: imageUri }} style={styles.previewImage} />
                    <View style={styles.imageActions}>
                      <TouchableOpacity style={styles.changeImageBtn} onPress={pickAndUpload}>
                        <Ionicons name="image-outline" size={18} color="#AD8C57" />
                        <Text style={styles.changeImageText}>Değiştir</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.removeImageBtn} onPress={onRemoveImage}>
                        <Ionicons name="trash-outline" size={18} color="#F44336" />
                        <Text style={styles.removeImageText}>Kaldır</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.uploadButton} onPress={pickAndUpload}>
                    <Ionicons name="cloud-upload-outline" size={32} color="rgba(255,255,255,0.4)" />
                    <Text style={styles.uploadText}>Görsel Yükle</Text>
                    <Text style={styles.uploadSubtext}>PNG, JPG veya WEBP (Maks. 5MB)</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={resetForm}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={onSubmit}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark" size={20} color="#121212" />
                <Text style={styles.submitButtonText}>
                  {editingId ? "Güncelle" : "Kaydet"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    marginTop: 4,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#AD8C57",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#AD8C57",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#121212",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  listContent: {
    paddingBottom: 60,
  },
  serviceCard: {
    backgroundColor: "#121212",
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  serviceImage: {
    width: "100%",
    height: 120,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  serviceContent: {
    padding: 14,
  },
  serviceHeader: {
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 20,
  },
  serviceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serviceInfo: {
    flexDirection: "row",
    gap: 12,
  },
  infoBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(173, 140, 87, 0.15)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#AD8C57",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(173, 140, 87, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(173, 140, 87, 0.3)",
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(244, 67, 54, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(244, 67, 54, 0.3)",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "rgba(255,255,255,0.5)",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.3)",
    marginTop: 8,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    borderWidth: 1,
    borderColor: "rgba(173, 140, 87, 0.2)",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    marginTop: 4,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalScroll: {
    maxHeight: 450,
    paddingHorizontal: 20,
  },
  formGroup: {
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
    marginBottom: 8,
  },
  required: {
    color: "#F44336",
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 14,
    color: "#fff",
    fontSize: 15,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  rowInputs: {
    flexDirection: "row",
    gap: 12,
  },
  uploadButton: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadText: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
    marginTop: 12,
  },
  uploadSubtext: {
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
    marginTop: 4,
  },
  imagePreview: {
    gap: 12,
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  imageActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  changeImageBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(173, 140, 87, 0.15)",
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(173, 140, 87, 0.3)",
  },
  changeImageText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#AD8C57",
  },
  removeImageBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(244, 67, 54, 0.15)",
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(244, 67, 54, 0.3)",
  },
  removeImageText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F44336",
  },
  modalFooter: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(255,255,255,0.8)",
  },
  submitButton: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#AD8C57",
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#121212",
  },
});
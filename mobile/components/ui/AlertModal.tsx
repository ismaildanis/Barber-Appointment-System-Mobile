import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

type AlertModalProps = {
  visible: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
};

export function AlertModal({
  visible,
  title = "Uyarı",
  message,
  onClose,
  onConfirm,
  confirmText = "Tamam",
  cancelText = "Kapat",
}: AlertModalProps) {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          {!!message && <Text style={styles.message}>{message}</Text>}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.btnGhost} onPress={onClose}>
              <Text style={styles.btnGhostText}>{cancelText}</Text>
            </TouchableOpacity>
            {onConfirm && (
              <TouchableOpacity style={styles.btnPrimary} onPress={onConfirm}>
                <Text style={styles.btnPrimaryText}>{confirmText}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "85%",
    backgroundColor: "#1c1c1e",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  title: { fontSize: 18, fontWeight: "700", color: "#fff", marginBottom: 8 },
  message: { fontSize: 14, color: "rgba(255,255,255,0.86)", marginBottom: 14 },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 10 },
  btnGhost: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  btnGhostText: { color: "#fff", fontWeight: "700" },
  btnPrimary: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#AD8C57",
  },
  btnPrimaryText: { color: "#fff", fontWeight: "700" },
});

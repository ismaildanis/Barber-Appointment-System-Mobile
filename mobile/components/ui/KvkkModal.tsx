import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Modal,
  ActivityIndicator 
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  onAccept: () => void;
  isAccepting?: boolean;
};

export function KvkkModal({ visible, onAccept, isAccepting }: Props) {
  const [checked, setChecked] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);

  const handleAccept = () => {
    if (!checked || isAccepting) return;
    onAccept();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      statusBarTranslucent
      presentationStyle="fullScreen"
      onRequestClose={() => {}}
    >
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Ionicons name="shield-checkmark" size={48} color="#E4D2AC" />
            <Text style={styles.title}>Gizlilik ve Kişisel Verilerin Korunması</Text>
          </View>

          <Text style={styles.text}>
            Bu uygulama, tek bir berber/kuaför işletmesine özel olarak randevu
            hizmetlerinin sunulabilmesi ve kullanıcı hesabının oluşturulup
            yönetilebilmesi amacıyla kişisel verilerinizi işlemektedir.
          </Text>

          <Text style={styles.text}>
            Bu kapsamda; ad, soyad ve e-posta adresiniz zorunlu olarak, telefon
            numarası ve profil fotoğrafı ise isteğe bağlı olarak işlenebilir.
            Ayrıca randevu bilgileri ve randevu geçmişiniz sistem tarafından
            kaydedilir.
          </Text>

          <Text style={styles.text}>
            Bildirim gönderimi ve fotoğraf erişimi yalnızca sizin açık izninizle
            aktif hale gelir. İzin vermemeniz durumunda uygulamanın temel
            işlevleri kullanılmaya devam edilebilir.
          </Text>

          <Text style={styles.text}>
            Kişisel verileriniz yalnızca randevu hizmetinin sunulması amacıyla
            kullanılır, üçüncü kişilerle paylaşılmaz ve yetkisiz erişime karşı
            gerekli teknik ve idari önlemler alınarak korunur.
          </Text>

          <TouchableOpacity
            style={styles.linkContainer}
            onPress={() => setShowPolicy(true)}
          >
            <Text style={styles.link}>Gizlilik Politikası'nı görüntüle</Text>
            <Ionicons name="chevron-forward" size={16} color="#E4D2AC" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setChecked(!checked)}
          >
            <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
              {checked && <Ionicons name="checkmark" size={14} color="#000" />}
            </View>
            <Text style={styles.checkboxText}>
              Gizlilik Politikası’nı okudum ve kişisel verilerimin belirtilen
              amaçlar doğrultusunda işlenmesini kabul ediyorum.
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            disabled={!checked || isAccepting}
            style={[
              styles.button,
              (!checked || isAccepting) && styles.buttonDisabled,
            ]}
            onPress={handleAccept}
            activeOpacity={0.8}
          >
            {isAccepting ? (
              <ActivityIndicator color="#000" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color="#000" />
                <Text style={styles.buttonText}>Kabul Et ve Devam Et</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showPolicy}
        animationType="slide"
        transparent={false}
        statusBarTranslucent
        presentationStyle="fullScreen"
        onRequestClose={() => setShowPolicy(false)}
      >
        <View style={styles.container}>
          <View style={styles.policyHeader}>
            <TouchableOpacity onPress={() => setShowPolicy(false)}>
              <Ionicons name="chevron-back" size={24} color="#E4D2AC" />
            </TouchableOpacity>
            <Text style={styles.policyTitle}>Gizlilik Politikası</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.text}>Son güncelleme: Ocak 2026</Text>

            <Text style={styles.text}>
              Bu Gizlilik Politikası, Berber Randevum mobil uygulamasını kullanan
              kullanıcıların kişisel verilerinin nasıl toplandığını,
              işlendiğini ve korunduğunu açıklamaktadır.
            </Text>

            <Text style={styles.sectionTitle}>1. Toplanan Kişisel Veriler</Text>
            <Text style={styles.text}>Ad ve soyad</Text>
            <Text style={styles.text}>E-posta adresi</Text>
            <Text style={styles.text}>Telefon numarası (isteğe bağlı)</Text>
            <Text style={styles.text}>Profil fotoğrafı (isteğe bağlı)</Text>
            <Text style={styles.text}>
              Randevu bilgileri ve randevu geçmişi
            </Text>

            <Text style={styles.sectionTitle}>
              2. Kişisel Verilerin İşlenme Amaçları
            </Text>
            <Text style={styles.text}>
              Kullanıcı hesabının oluşturulması ve yönetilmesi
            </Text>
            <Text style={styles.text}>
              Randevu oluşturma, görüntüleme ve yönetme işlemleri
            </Text>
            <Text style={styles.text}>
              Randevularla ilgili bilgilendirme yapılması
            </Text>

            <Text style={styles.sectionTitle}>
              3. Bildirimler ve Cihaz İzinleri
            </Text>
            <Text style={styles.text}>
              Bildirim izni: Randevu durumları ve bilgilendirmeler için kullanılır.
            </Text>
            <Text style={styles.text}>
              Fotoğraf erişimi: Yalnızca profil fotoğrafı eklemek istenirse kullanılır.
            </Text>

            <Text style={styles.sectionTitle}>
              4. Kişisel Verilerin Paylaşılması
            </Text>
            <Text style={styles.text}>
              Kişisel veriler üçüncü kişilerle paylaşılmaz ve reklam veya
              pazarlama amacıyla kullanılmaz.
            </Text>

            <Text style={styles.sectionTitle}>5. Veri Güvenliği</Text>
            <Text style={styles.text}>
              Kişisel verilerinizin güvenliği için gerekli teknik ve idari
              tedbirler alınmaktadır.
            </Text>

            <Text style={styles.sectionTitle}>6. Veri Saklama Süresi</Text>
            <Text style={styles.text}>
              Kişisel veriler hizmetin sunulması süresince saklanır. Hesap
              silindiğinde, yasal yükümlülükler saklı kalmak kaydıyla silinir veya
              anonim hale getirilir.
            </Text>

            <Text style={styles.sectionTitle}>
              7. Kullanıcı Hakları ve Hesap Silme
            </Text>
            <Text style={styles.text}>
              Kullanıcılar hesaplarını uygulama içerisinden kalıcı olarak
              silebilir. Hesap silindiğinde kişisel veriler silinir ve ileri
              tarihli randevular iptal edilir.
            </Text>

            <Text style={styles.sectionTitle}>8. Değişiklikler</Text>
            <Text style={styles.text}>
              Bu Gizlilik Politikası gerektiğinde güncellenebilir ve uygulama
              üzerinden duyurulur.
            </Text>
          </ScrollView>
        </View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#1a1a1a",
    padding: 16
  },
  content: { 
    padding: 24,
    paddingBottom: 100 
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
    gap: 12
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  text: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 22,
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    marginTop: 8,
    marginBottom: 32,
  },
  link: {
    color: "#E4D2AC",
    fontSize: 14,
    fontWeight: "600",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(173,140,87,0.1)",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(173,140,87,0.3)",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#E4D2AC",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#E4D2AC",
  },
  checkboxText: {
    color: "#fff",
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#1a1a1a",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  button: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#E4D2AC",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 16,
  },
  policyHeader: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1a1a1a",
  },
  policyTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  sectionTitle: {
    color: "#E4D2AC",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
  },
});

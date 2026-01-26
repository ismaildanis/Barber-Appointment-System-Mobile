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
            Bu uygulama, randevu hizmetlerinin sunulabilmesi ve kullanıcı hesabının
            oluşturulup yönetilebilmesi amacıyla kişisel verilerinizi işlemektedir.
          </Text>

          <Text style={styles.text}>
            Bu kapsamda; ad, soyad, telefon numarası, e-posta adresi, profil
            fotoğrafı (isteğe bağlı), randevu bilgileri ve randevu geçmişi
            verileriniz işlenmektedir.
          </Text>

          <Text style={styles.text}>
            Bildirim gönderimi ve fotoğraf erişimi, yalnızca tarafınızca izin
            verilmesi halinde aktif hale gelir. İzin verilmemesi durumunda
            uygulamanın temel işlevleri kullanılmaya devam edilebilir.
          </Text>

          <Text style={styles.text}>
            Kişisel verileriniz, yalnızca hizmetin sunulması amacıyla kullanılır,
            üçüncü kişilerle paylaşılmaz ve yetkisiz erişime karşı gerekli teknik
            ve idari tedbirler alınarak korunur.
          </Text>

          <TouchableOpacity style={styles.linkContainer} onPress={() => setShowPolicy(true)}>
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
              Gizlilik Politikası'nı okudum ve kişisel verilerimin işlenmesini
              kabul ediyorum.
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            disabled={!checked || isAccepting}
            style={[styles.button, (!checked || isAccepting) && styles.buttonDisabled]}
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
            <Text style={styles.text}>Son güncelleme: 2026</Text>
            <Text style={styles.text}>
            Bu Gizlilik Politikası, Berber Randevum mobil uygulamasını kullanan
            kullanıcıların kişisel verilerinin nasıl toplandığını, işlendiğini ve
            korunduğunu açıklamaktadır.
            </Text>

            <Text style={styles.sectionTitle}>1. Toplanan Kişisel Veriler</Text>
            <Text style={styles.text}>Ad ve soyad</Text>
            <Text style={styles.text}>Telefon numarası</Text>
            <Text style={styles.text}>E-posta adresi</Text>
            <Text style={styles.text}>Profil fotoğrafı (isteğe bağlı)</Text>
            <Text style={styles.text}>Randevu bilgileri ve randevu geçmişi</Text>
            <Text style={styles.text}>
            Bu veriler, kullanıcı tarafından doğrudan sağlanmaktadır.
            </Text>

            <Text style={styles.sectionTitle}>2. Kişisel Verilerin İşlenme Amaçları</Text>
            <Text style={styles.text}>
            Kullanıcı hesabının oluşturulması ve yönetilmesi
            </Text>
            <Text style={styles.text}>
            Randevu oluşturma, görüntüleme ve yönetme işlemleri
            </Text>
            <Text style={styles.text}>Kullanıcı ile iletişim kurulması</Text>
            <Text style={styles.text}>Hizmet kalitesinin artırılması</Text>
            <Text style={styles.text}>
            Kişisel veriler, bu amaçlar dışında kullanılmaz.
            </Text>

            <Text style={styles.sectionTitle}>3. Bildirimler ve Cihaz İzinleri</Text>
            <Text style={styles.text}>Bildirim izni: Randevu bilgilendirmeleri için</Text>
            <Text style={styles.text}>Fotoğraf erişimi: Profil fotoğrafı eklemek için</Text>
            <Text style={styles.text}>
            Bu izinlerin verilmemesi durumunda uygulamanın temel işlevleri kullanılmaya
            devam edilebilir.
            </Text>

            <Text style={styles.sectionTitle}>4. Kişisel Verilerin Paylaşılması</Text>
            <Text style={styles.text}>Üçüncü kişilerle paylaşılmaz</Text>
            <Text style={styles.text}>Reklam veya pazarlama amacıyla kullanılmaz</Text>
            <Text style={styles.text}>
            Yalnızca hizmetin sunulması için işlenir
            </Text>
            <Text style={styles.text}>
            Yasal yükümlülükler haricinde hiçbir kişi veya kuruluşla paylaşım yapılmaz.
            </Text>

            <Text style={styles.sectionTitle}>5. Veri Güvenliği</Text>
            <Text style={styles.text}>
            Kişisel verilerinizin güvenliği için gerekli teknik ve idari tedbirler
            alınmaktadır. Yetkisiz erişim, veri kaybı veya kötüye kullanım risklerine
            karşı koruma sağlanır.
            </Text>

            <Text style={styles.sectionTitle}>6. Veri Saklama Süresi</Text>
            <Text style={styles.text}>
            Kişisel veriler, hizmetin_attach 유지 süresince saklanır. Kullanıcı hesabının
            silinmesi halinde veriler, yasal yükümlülükler dışında silinir veya anonim
            hale getirilir.
            </Text>

            <Text style={styles.sectionTitle}>7. Kullanıcı Hakları ve Hesap Silme</Text>
            <Text style={styles.text}>Kişisel verileri hakkında bilgi talep etme</Text>
            <Text style={styles.text}>Verilerinin güncellenmesini veya düzeltilmesini isteme</Text>
            <Text style={styles.text}>Hesaplarının ve kişisel verilerinin silinmesini talep etme</Text>
            <Text style={styles.text}>
            Hesap silme ve kişisel veri silme talepleri, kullanıcı tarafından uygulama
            içindeki Gizlilik Politikası sayfası üzerinden veya uygulamanın resmi iletişim
            kanalları aracılığıyla iletilebilir.
            </Text>
            <Text style={styles.text}>
            Bu talepler, yürürlükteki mevzuat ve yasal yükümlülükler saklı kalmak kaydıyla
            makul süre içinde sonuçlandırılır.
            </Text>

            <Text style={styles.sectionTitle}>8. Değişiklikler</Text>
            <Text style={styles.text}>
            Bu Gizlilik Politikası gerektiğinde güncellenebilir. Güncellemeler uygulama
            üzerinden veya bu sayfa aracılığıyla duyurulur.
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
    headerTitle: { color: "#1a1a1a", fontSize: 22, fontWeight: "800" },
    headerSub: { color: "#1a1a1a", fontSize: 12, opacity: 0.7 },
    sectionTitle: { color: "#E4D2AC", fontSize: 16, fontWeight: "700", marginTop: 8 },
});
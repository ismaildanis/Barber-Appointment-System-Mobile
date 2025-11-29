import { useEffect } from "react";
import { Text, View } from "react-native";
import { API_URL } from "../config";


export default function App() {
  useEffect(() => {
    fetch(`${API_URL}/auth/test`)
      .then(r => r.json())
      .then(d => console.log("API RESPONSE:", d))
      .catch(err => console.log("API ERROR:", err));
  }, []);

  return (
    <View style={{ padding: 50, backgroundColor: "white" , alignItems: "center", justifyContent: "center" }}>
      <Text>Barber Mobile Çalışıyor 🚀</Text>
      <Text>Barber Mobile Çalışıyorawdawdawd 🚀</Text>
    </View>
  );
}

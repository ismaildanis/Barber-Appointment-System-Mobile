import { Admin } from "@/src/types/adminAuth";
import { useRouter, useNavigation } from "expo-router";
import { Text, View, TouchableOpacity } from "react-native";
import Spinner from "../ui/Spinner";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";

type HeaderProps = {
  admin?: Admin;
  laoding?: boolean;
};

export default function AdminHeader({ admin, laoding }: HeaderProps) {
  const router = useRouter();
  const navigation = useNavigation();

  if (laoding) return <Spinner />;

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#AD8C57",
          padding: 16,
          borderRadius: 16,
        }}
      >
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>
            {admin?.firstName} {admin?.lastName}
          </Text>
          <Text style={{ fontSize: 16 }}>{admin?.email}</Text>
        </View>
        
        <TouchableOpacity
          onPress={() =>
            navigation.getParent()?.dispatch(DrawerActions.openDrawer())
          }
        >
          <Ionicons name="menu" size={32} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

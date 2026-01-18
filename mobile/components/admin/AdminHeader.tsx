import { Admin } from "@/src/types/adminAuth";
import { useRouter, useNavigation } from "expo-router";
import { Text, View, TouchableOpacity } from "react-native";
import Spinner from "../ui/Spinner";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { themeColors } from "@/constants/theme";

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
          backgroundColor: "transparent",
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: themeColors.primary,
        }}
      >
        <View>
          <Text style={{ 
            fontWeight: "bold", 
            fontSize: 20, 
            color: themeColors.text 
          }}>
            {admin?.firstName} {admin?.lastName}
          </Text>
          <Text style={{ 
            fontSize: 16, 
            color: themeColors.textMuted 
          }}>
            {admin?.email}
          </Text>
        </View>
        
        <TouchableOpacity
          onPress={() =>
            navigation.getParent()?.dispatch(DrawerActions.openDrawer())
          }
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            backgroundColor: themeColors.surface,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="menu" size={28} color={themeColors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
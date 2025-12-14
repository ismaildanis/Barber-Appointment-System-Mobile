import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";

export default function Profile() {
    return (
        <View style={{ flex: 1, padding: 16,marginTop: 40 }}>
                <TouchableOpacity style = {{}} onPress={() => router.back()} >
                    <Ionicons name="chevron-back" color={'#fff'} size={30} />
                </TouchableOpacity>
           
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>Profile</Text>
        </View>
    );
}
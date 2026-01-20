import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { themeColors } from "@/constants/theme";

type FilterOption<T> = {
  value: T;
  label: string;
};

type FilterModalProps<T extends string> = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  options: FilterOption<T>[];
  selectedValue: T;
  onSelect: (value: T) => void;
};

export default function FilterModal<T extends string>({
  isOpen,
  onClose,
  title,
  options,
  selectedValue,
  onSelect,
}: FilterModalProps<T>) {
  return (
    <Modal
      visible={isOpen}
      onRequestClose={onClose}
      transparent
      animationType="fade"
    >
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: themeColors.overlay,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Pressable
          style={{
            backgroundColor: themeColors.surface,
            borderRadius: 16,
            width: "100%",
            maxWidth: 400,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: themeColors.border,
          }}
        >
          <View
            style={{
              paddingVertical: 20,
              paddingHorizontal: 20,
              borderBottomWidth: 1,
              borderBottomColor: themeColors.divider,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: themeColors.text,
              }}
            >
              {title}
            </Text>
          </View>

          {options.map((option, index) => {
            const selected = option.value === selectedValue;
            const isLast = index === options.length - 1;

            return (
              <TouchableOpacity
                key={option.value}
                onPress={() => {
                  onSelect(option.value);
                  onClose();
                }}
                activeOpacity={0.7}
                style={{
                  paddingVertical: 16,
                  paddingHorizontal: 20,
                  backgroundColor: selected
                    ? themeColors.surfaceLight
                    : "transparent",
                  borderLeftWidth: selected ? 4 : 0,
                  borderLeftColor: themeColors.primary,
                  borderBottomWidth: isLast ? 0 : 1,
                  borderBottomColor: themeColors.divider,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: selected ? "600" : "400",
                    color: selected ? themeColors.primary : themeColors.text,
                  }}
                >
                  {option.label}
                </Text>
                {selected && (
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color={themeColors.primary}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
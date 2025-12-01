import { Image, ImageSourcePropType, StyleSheet, useWindowDimensions, View } from "react-native";

export type OwnerLogoProps = {
  logo?: React.ComponentType<{ width?: number; height?: number }> | ImageSourcePropType;
};
export default function OwnerLogo({logo}: OwnerLogoProps) {
    const { width } = useWindowDimensions();
    const LogoComp = typeof logo === "function" ? logo : undefined;
    const logoSrc = typeof logo !== "function" ? logo : undefined;
      const headerHeight = Math.min(Math.max(width * 0.38, 150), 280);

    const logoSize = headerHeight * 0.7;
    return (
        <View style={styles.right}>
            {LogoComp ? (
            <LogoComp width={logoSize} height={logoSize} />
            ) : logoSrc ? (
            <Image source={logoSrc} style={{ width: logoSize, height: logoSize }} resizeMode="contain" />
            ) : null}
        </View>
    );
}

export const styles = StyleSheet.create({
    right: { flex: 1, alignItems: "flex-end" },
});
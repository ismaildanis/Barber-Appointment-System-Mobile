import React, { useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import LottieView from "lottie-react-native";

export default function IntroSplash() {
  const router = useRouter();
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  const goNext = () => {
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <LottieView
        ref={animationRef}
        source={require("../../assets/animations/logo-intro.json")}
        autoPlay
        loop={false}
        onLayout={async () => {
          await SplashScreen.hideAsync();
        }}
        onAnimationFinish={goNext}
        style={styles.lottie}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  lottie: {
    width: 220,
    height: 220,
  },
});

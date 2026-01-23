import { useEffect, useRef, useState } from "react";
import { View, Animated, Easing, StyleSheet } from "react-native";
import { useRootNavigationState, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useUnifiedMe } from "@/src/hooks/useUnifiedAuth";
import { LinearGradient } from "expo-linear-gradient";
import { Asset } from "expo-asset";

SplashScreen.preventAutoHideAsync();

const ANIMATION_CONFIG = {
  MIN_DISPLAY_TIME: 2500,
  FADE_DURATION: 700,
  SCALE_TENSION: 40,
  SCALE_FRICTION: 6,
  PULSE_DURATION: 900,
};

const logoAsset = require("../assets/logo/adaptive-foreground.png");

export default function Index() {
  const router = useRouter();
  const nav = useRootNavigationState();
  const { data, isLoading, isError } = useUnifiedMe();

  const [canNavigate, setCanNavigate] = useState(false);
  const [splashHidden, setSplashHidden] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const prepare = async () => {
      try {
        await Asset.fromModule(logoAsset).downloadAsync();
      } catch (e) {
        console.warn("Logo preload failed", e);
      } finally {
        await SplashScreen.hideAsync();
        setSplashHidden(true);
      }
    };

    prepare();
  }, []);

  useEffect(() => {
    if (!splashHidden) return;

    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: ANIMATION_CONFIG.FADE_DURATION,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: ANIMATION_CONFIG.SCALE_TENSION,
          friction: ANIMATION_CONFIG.SCALE_FRICTION,
          useNativeDriver: true,
        }),
      ]),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.06,
            duration: ANIMATION_CONFIG.PULSE_DURATION,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: ANIMATION_CONFIG.PULSE_DURATION,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();

    const minTimer = setTimeout(
      () => setCanNavigate(true),
      ANIMATION_CONFIG.MIN_DISPLAY_TIME
    );

    return () => clearTimeout(minTimer);
  }, [splashHidden]);

  useEffect(() => {
    if (!nav?.key || isLoading || !canNavigate) return;

    if (isError || !data) {
      router.replace("/(auth)/login");
    } else if (data.role === "customer") {
      router.replace("/(customer)/home");
    } else if (data.role === "admin") {
      router.replace("/(admin)/dashboard");
    } else if (data.role === "barber") {
      router.replace("/(barber)/todayAppointments");
    } else {
      router.replace("/(auth)/login");
    }
  }, [nav?.key, isLoading, isError, data, canNavigate]);

  return (
    <LinearGradient
      colors={["#E4D2AC", "#AD8C57"]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={styles.container}
    >
      <Animated.Image
        source={logoAsset}
        style={[
          styles.logo,
          {
            opacity: fadeAnim,
            transform: [{ scale: Animated.multiply(scaleAnim, pulseAnim) }],
          },
        ]}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 220,
    height: 220,
  },
});

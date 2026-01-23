import { useRef, useState } from "react";
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export function useCredencial() {
  const [showBack, setShowBack] = useState(false);
  const rotation = useSharedValue(0);
  const isAnimating = useRef(false);

  const handleFlip = () => {
    if (isAnimating.current) return;

    isAnimating.current = true;
    const newShowBack = !showBack;

    rotation.value = withTiming(newShowBack ? 180 : 0, { duration: 600 });

    setTimeout(() => {
      setShowBack(newShowBack);
      isAnimating.current = false;
    }, 300);
  };

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 180], [0, 180]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      backfaceVisibility: "hidden",
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 180], [180, 360]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      backfaceVisibility: "hidden",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    };
  });

  return {
    showBack,
    handleFlip,
    frontAnimatedStyle,
    backAnimatedStyle,
  };
}

import { useState } from "react";
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

/**
 * Hook personalizado para manejar la lógica de volteo de la credencial
 * @returns {Object} Objeto con estados y funciones para controlar el volteo
 */
export function useCredencial() {
  const [showBack, setShowBack] = useState(false);
  const rotation = useSharedValue(0);

  /**
   * Maneja el volteo de la tarjeta con animación
   */
  const handleFlip = () => {
    rotation.value = withTiming(rotation.value + 180, { duration: 600 });
    setTimeout(() => setShowBack(!showBack), 300);
  };

  /**
   * Estilo animado para la parte frontal de la tarjeta
   */
  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 180], [0, 180]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      backfaceVisibility: "hidden",
    };
  });

  /**
   * Estilo animado para la parte trasera de la tarjeta
   */
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

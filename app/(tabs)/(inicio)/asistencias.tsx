import { pickerPropsIOS, styles } from "@/constants/asistenciaStyles";
import { colors } from "@/constants/styles";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";

export default function AsistenciasScreen() {
  const [selectPicker, setSelectPicker] = useState(null);
  const pickerRef = useRef<any>(null);

  const openPicker = () => {
    if (pickerRef.current) {
      pickerRef.current.togglePicker();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Título */}
        <Text style={styles.title}>Asistencias</Text>

        {/* Línea separadora */}
        <View style={styles.divider} />

        {/* Picker de materias */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={openPicker}
          style={styles.pickerTouchable}
        >
          <RNPickerSelect
            ref={pickerRef}
            placeholder={{
              label: "Selecciona una materia",
              value: null,
            }}
            value={selectPicker}
            onValueChange={(value) => setSelectPicker(value)}
            items={[
              { label: "Matemáticas", value: "matematicas" },
              { label: "Español", value: "espanol" },
              { label: "Inglés", value: "ingles" },
              { label: "Historia", value: "historia" },
              { label: "Física", value: "fisica" },
            ]}
            style={{
              inputIOS: styles.pickerInput,
              inputAndroid: styles.pickerInput,
              iconContainer: styles.pickerIconContainer,
              placeholder: styles.pickerPlaceholder,
            }}
            useNativeAndroidPickerStyle={false}
            pickerProps={Platform.OS === "ios" ? pickerPropsIOS : {}}
            touchableWrapperProps={{
              activeOpacity: 1,
            }}
            Icon={() => (
              <Ionicons
                name="chevron-down"
                size={24}
                color={colors.gray[600]}
              />
            )}
          />
        </TouchableOpacity>

        {/* Tres cajas de texto */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Dia"
            placeholderTextColor={colors.gray[400]}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Mes"
            placeholderTextColor={colors.gray[400]}
          />
          <TextInput
            style={styles.input}
            placeholder="año"
            placeholderTextColor={colors.gray[400]}
            keyboardType="numeric"
          />
        </View>
      </View>
    </ScrollView>
  );
}

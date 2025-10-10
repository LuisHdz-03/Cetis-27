import { commonStyles } from "@/constants/styles";
import { Text, View } from "react-native";

export default function ReportesScreen() {
  return (
    <View style={[commonStyles.container, commonStyles.centered]}>
      <Text style={commonStyles.title}>Reportes</Text>
      <Text style={[commonStyles.textSecondary, commonStyles.mt10]}>
        Aquí verás los reportes generados
      </Text>
    </View>
  );
}

import { Platform, StyleSheet } from "react-native";
import { colors } from "./colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
    padding: 15,
  },
  content: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[300],
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: colors.black,
  },
  containerPicker: {
    padding: 20,
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    backgroundColor: colors.white,
    color: colors.black,
  },
  pickerInput: {
    fontSize: 16,
    paddingVertical: 15,
    paddingHorizontal: 15,
    paddingRight: 45,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    color: colors.black,
    backgroundColor: colors.white,
  },
  pickerIconContainer: {
    top: Platform.OS === "ios" ? 15 : 15,
    right: 15,
  },
  pickerPlaceholder: {
    color: colors.gray[400],
  },
  pickerTouchable: {
    marginBottom: 20,
  },
});

export const pickerPropsIOS = {
  style: {
    backgroundColor: colors.white,
  },
  itemStyle: {
    color: colors.black,
    fontSize: 18,
  },
};

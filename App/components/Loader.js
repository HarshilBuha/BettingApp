import React from "react";
import { View, Text, ActivityIndicator, StyleSheet, Modal } from "react-native";

export default function Loader({ visible = false, text = "Loading..." }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.loaderBox}>
          <ActivityIndicator size="large" color="black" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderBox: {
    alignItems: "center",
  },
  text: {
    marginTop: 10,
    fontSize: 14,
    color: "#475569",
    fontWeight: "500",
  },
});

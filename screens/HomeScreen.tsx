import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
} from "react-native";
import React from "react";
import Schedule from "../components/Schedule";

const HomeScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.containerText}>
              <Text
                style={{ textAlign: "left", fontSize: 30, fontWeight: "bold" }}
              >
                Buenos días, Daniel
              </Text>
            </View>
            <View style={styles.containerImage}>
              <Image
                source={require("../assets/hombre.png")}
                style={styles.avatar}
              />
            </View>
          </View>
          {/* Espacio disponible para la agenda */}
          <Schedule />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    marginVertical: 30,
    flex: 1,
    padding: 14,
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    marginBottom: 16,
  },
  containerText: {
    width: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  containerImage: {
    width: "50%",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "green",
  },
});

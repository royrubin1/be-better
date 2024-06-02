import { signOut } from "firebase/auth";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { auth } from "../config/firebase";

const SettingsScreen = ({ navigation }) => {
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigation.navigate("Auth");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../assets/settings-image.png")}
      />
      <Text style={styles.title}>Ajustes</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 20,
    padding: 20,
    margin: 20,
  },
  image: {
    width: "100%",
    height: 260,
    resizeMode: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 34,
    color: "#364f6b",
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    width: "100%",
    backgroundColor: "#74C69D",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SettingsScreen;

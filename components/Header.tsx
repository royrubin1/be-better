import { SafeAreaView, StyleSheet, Text, View, Image } from "react-native";
import React from "react";

const Header = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.image}
        source={require("../assets/capybara-logo.png")}
      />
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#5EA3B7",
    width: "100%",
    borderBottomEndRadius: 40,
    borderBottomStartRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "5%",
    height: "50%",
  },
  image: {
    width: 200,
    height: 250,
  },
});

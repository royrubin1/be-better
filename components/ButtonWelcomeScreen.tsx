import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

interface Props {
  text: string;
  navigation?: any;
}

const ButtonWelcomeScreen = ({ text, navigation }: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Auth")}
      >
        <Text style={styles.buttonText}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ButtonWelcomeScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  button: {
    backgroundColor: "#3A2635",
    width: "90%",
    height: "25%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "gray",
    textAlign: "center",
    fontSize: 17,
    fontStyle: "italic",
  },
});

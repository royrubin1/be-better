import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import Header from "../components/Header";
import ButtonWelcomeScreen from "../components/ButtonWelcomeScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WelcomeScreen = ({ navigation }) => {
  useEffect(() => {
    checkIfUserNew();
  }, []);

  const checkIfUserNew = async () => {
    const newUser = await AsyncStorage.getItem("newUser");
    if (newUser === "false") {
      navigation.navigate("Home");
    }
  };

  return (
    <SafeAreaView>
      <Header />
      <View style={styles.containerText}>
        <Text style={styles.bestSelfMessage}>
          Sé la mejor versión de ti mismo
        </Text>
        <Text style={styles.beBetterAlly}>
          Be Better es tu aliado para el crecimiento personal. Establece metas,
          supera desafíos y mejora cada día. Únete y comienza tu viaje hacia una
          vida mejor.
        </Text>
      </View>
      <ButtonWelcomeScreen text="Iniciar" navigation={navigation} />
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  containerText: {
    marginBottom: "6%",
    marginTop: "5%",
  },
  bestSelfMessage: {
    fontSize: 40,
    fontStyle: "italic",
    marginBottom: "5%",
  },
  beBetterAlly: {
    fontSize: 20,
    color: "gray",
  },
});

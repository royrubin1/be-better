import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React from "react";
import ButtonWelcomeScreen from "../components/ButtonWelcomeScreen";
import { Colors } from "react-native/Libraries/NewAppScreen";

const AuthScreen = () => {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View>
          <Text style={styles.bigTitle}>¡Bienvenido!</Text>
          <Text style={styles.smallTitle}>Registrate ahora</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Usuario</Text>
          <TextInput style={styles.input} placeholder="Nombre de usuario" />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput style={styles.input} placeholder="********" />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Correo</Text>
          <TextInput style={styles.input} placeholder="email@mail.com" />
        </View>
        <View style={styles.flexContainer}>
          <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              source={require("../assets/facebook-icon-black.png")}
            />
          </View>
          <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              source={require("../assets/twitter-logo-black.png")}
            />
          </View>
          <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              source={require("../assets/google-logo-black.jpg")}
            />
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Iniciar Sesión" color={"#000000"} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    marginVertical: 50,
    marginHorizontal: 10,
  },
  bigTitle: {
    fontSize: 30,
    textAlign: "center",
  },
  smallTitle: {
    fontSize: 12,
    textAlign: "center",
  },
  text: {
    fontSize: 20,
  },
  label: {
    margin: 5,
    fontSize: 14,
  },
  inputContainer: {
    margin: 5,
  },
  input: {
    height: 35,
    margin: 5,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  flexContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    display: "flex",
    justifyContent: "center",
    height: 50,
  },
  logo: {
    height: 30,
    width: 30,
    borderRadius: 25,
  },
  logoContainer: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 50,
    margin: 5,
  },
  buttonContainer: {
    margin: 15,
    marginTop: "15%",
  },
});

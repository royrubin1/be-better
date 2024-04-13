import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from "react-native";
import React, { useState } from "react";
import {
  initializeAuth,
  getReactNativePersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";

import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import app from "../config/firebase";

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const AuthScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    console.log(`Email: ${email} password: ${password}`);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("El usuario ha iniciado sesión");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Error : " + errorMessage + " " + errorCode);
      });
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View>
          <Text style={styles.bigTitle}>¡Bienvenido!</Text>
          <Text style={styles.smallTitle}>Registrate ahora</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Correo</Text>
          <TextInput
            style={styles.input}
            placeholder="email@mail.com"
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="********"
            onChangeText={(text) => setPassword(text)}
          />
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
          <Button
            title="Iniciar Sesión"
            color={"#000000"}
            onPress={handleLogin}
          />
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
    marginTop: "20%",
  },
});

import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../config/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

let registered = false;

const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [buttonText, setButtonText] = useState("Registrarse");
  const [smallTitleText, setSmallTitleText] = useState("¿Ya estás registrado?");

  const login = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        successLogin(userCredential);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const register = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        successLogin(userCredential);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Error : " + errorMessage + " " + errorCode);
      });
  };

  const handleLogin = async () => {
    registered ? login() : register();
  };

  const successLogin = (userCredential) => {
    AsyncStorage.setItem("newUser", "false");
    AsyncStorage.setItem("userCredential", JSON.stringify(userCredential));
    navigation.navigate("Home");
  };

  const changeAuthMode = () => {
    if (registered) {
      registered = false;
      setButtonText("Registrarse");
      setSmallTitleText("¿Ya estás registrado?");
    } else {
      registered = true;
      setButtonText("Iniciar sesión");
      setSmallTitleText("¿No tienes una cuenta?");
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View>
          <Text style={styles.bigTitle}>¡Bienvenido!</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Correo</Text>
          <TextInput
            textContentType="emailAddress"
            style={styles.input}
            placeholder="email@mail.com"
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            textContentType="password"
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
          <Button title={buttonText} color={"#000000"} onPress={handleLogin} />
          <Text style={styles.smallTitle} onPress={changeAuthMode}>
            {smallTitleText}
          </Text>
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

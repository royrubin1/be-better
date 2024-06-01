import {
  Animated,
  Button,
  Easing,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../config/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Container from "../components/Container";

let registered = false;

const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [buttonText, setButtonText] = useState("Registrarse");
  const [smallTitleText, setSmallTitleText] = useState("¿Ya estás registrado?");
  const emailBorderWidth = useRef(new Animated.Value(0)).current;
  const emailBorderColor = useRef(new Animated.Value(0)).current;

  const passwordBorderWidth = useRef(new Animated.Value(0)).current;
  const passwordBorderColor = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(emailBorderWidth, {
      toValue: email ? 100 : 0,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    Animated.timing(emailBorderColor, {
      toValue: email ? 1 : 0,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [email]);

  useEffect(() => {
    Animated.timing(passwordBorderWidth, {
      toValue: password ? 100 : 0,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    Animated.timing(passwordBorderColor, {
      toValue: password ? 1 : 0,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [password]);

  const animatedEmailBorderColor = emailBorderColor.interpolate({
    inputRange: [0, 1],
    outputRange: ["#B7E4C7", "#40916C"],
  });

  const animatedPasswordBorderColor = passwordBorderColor.interpolate({
    inputRange: [0, 1],
    outputRange: ["#B7E4C7", "#40916C"],
  });
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
    <Container>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          style={{
            width: "100%",
            height: 260,
            resizeMode: "contain", // Ajustar a 'cover', 'contain', 'stretch', etc. según sea necesario
            marginBottom: 20,
          }}
          source={require("../assets/checklist-image.png")}
        />
        <Text style={styles.bigTitle}>¡Bienvenido!</Text>
        <View style={styles.inputContainer}>
          <TextInput
            textContentType="emailAddress"
            style={styles.input}
            placeholder="email@mail.com"
            onChangeText={(text) => setEmail(text)}
          />
          <Animated.View
            style={[
              {
                height: 2,
                position: "absolute",
                bottom: -1,
                left: 0,
              },
              {
                width: emailBorderWidth.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                }),
                backgroundColor: animatedEmailBorderColor,
              },
            ]}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            textContentType="password"
            style={styles.input}
            placeholder="********"
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
          />
          <Animated.View
            style={[
              {
                height: 2,
                position: "absolute",
                bottom: -1,
                left: 0,
              },
              {
                width: passwordBorderWidth.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                }),
                backgroundColor: animatedPasswordBorderColor,
              },
            ]}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
        <Text style={styles.smallTitle} onPress={changeAuthMode}>
          {smallTitleText}
        </Text>
      </ScrollView>
    </Container>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 20,
    padding: 20,
  },
  bigTitle: {
    fontSize: 34,
    color: "#364f6b",
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 40,
  },
  input: {
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 15,
    fontSize: 18,
    borderBottomWidth: 1,
    borderColor: "#364f6b",
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
  smallTitle: {
    fontSize: 16,
    color: "#364f6b",
    marginTop: 20,
    textDecorationLine: "underline",
  },
});

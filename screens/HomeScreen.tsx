import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import Schedule from "../components/Schedule";
import AntDesign from "@expo/vector-icons/AntDesign";
import { auth } from "../config/firebase";

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const getUserName = () => {
    if (user && user.email) {
      const userEmail = user.email.split("@");
      const userName = userEmail[0];
      return userName;
    }
    return null;
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.containerText}>
          <Text style={styles.greetingText}>Buenos días,</Text>
          <Text style={styles.nameText}>{getUserName()}</Text>
        </View>
        <View style={styles.containerImage}>
          <Image
            source={require("../assets/hombre.png")}
            style={styles.avatar}
          />
        </View>
      </View>
      <Schedule />
      <View
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("Task")}
          style={styles.btnSchedule}
        >
          <Text style={styles.textButton}>
            <AntDesign name="plus" size={30} color="white" />
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginVertical: 20,
  },
  containerText: {
    flex: 1,
  },
  greetingText: {
    fontSize: 26,
    fontWeight: "bold",
  },
  nameText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "green",
  },
  containerImage: {
    marginLeft: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "green",
  },
  btnSchedule: {
    width: "17%",
    height: 60,
    alignSelf: "flex-end",
    backgroundColor: "#40916C",
    borderRadius: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  textButton: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
});

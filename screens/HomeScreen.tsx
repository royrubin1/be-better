import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Schedule from "../components/Schedule";

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.containerText}>
          <Text style={styles.greetingText}>Good Morning,</Text>
          <Text style={styles.nameText}>Daniel</Text>
        </View>
        <View style={styles.containerImage}>
          <Image
            source={require("../assets/calendario.png")}
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
        <TouchableOpacity style={styles.btnSchedule}>
          <Text
            style={styles.textButton}
            onPress={() => navigation.navigate("Task")}
          >
            Set Schedule
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
    width: "60%",
    height: 50,
    backgroundColor: "#40916C",
    borderRadius: 50,
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

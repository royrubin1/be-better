import React, { useState } from "react";
import { Text, TextInput, Button, StyleSheet, Alert, View } from "react-native";
import { auth, db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { uid } from "uid";
import Container from "../components/Container";
import RNPickerSelect from "react-native-picker-select";
import { Calendar } from "react-native-calendars";
const TaskScreen = ({ navigation }) => {
  const addCategoryText = "Añadir categoría";
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([
    "Personal",
    "Trabajo",
    "Salud",
    addCategoryText,
  ]);

  const handleSubmit = async () => {
    if (!title || !startDate || !endDate || !category) {
      alert("Por favor rellena todos los datos");
      return;
    }

    const goal = {
      title,
      start_date: startDate,
      end_date: endDate,
      category,
      done: false,
      user_id: auth.currentUser.uid,
    };

    await addGoalData(goal);
    navigation.navigate("Home");
  };

  const handleAddCategory = () => {
    Alert.prompt(
      addCategoryText,
      "Introduce el nombre de la nueva categoría:",
      (newCategory) => {
        if (newCategory && !categories.includes(newCategory)) {
          setCategories([
            ...categories.slice(0, -1),
            newCategory,
            addCategoryText,
          ]);
          setCategory(newCategory);
        }
      }
    );
  };

  const addGoalData = async (goal) => {
    const newGoalDocRef = doc(db, "goals", uid(20));
    await setDoc(newGoalDocRef, goal);
  };

  const onDayPress = (day) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day.dateString);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (new Date(day.dateString) > new Date(startDate)) {
        setEndDate(day.dateString);
      } else {
        setStartDate(day.dateString);
      }
    }
  };

  const getMarkedDates = () => {
    const markedDates = {};
    if (startDate) {
      markedDates[startDate] = {
        startingDay: true,
        color: "#70d7c7",
        textColor: "white",
      };
    }
    if (endDate) {
      markedDates[endDate] = {
        endingDay: true,
        color: "#70d7c7",
        textColor: "white",
      };
      // Rellenar las fechas entre startDate y endDate
      let current = new Date(startDate);
      while (current < new Date(endDate)) {
        current.setDate(current.getDate() + 1);
        const dateString = current.toISOString().split("T")[0];
        if (dateString !== endDate) {
          markedDates[dateString] = { color: "#c2e9e5", textColor: "black" };
        }
      }
    }
    return markedDates;
  };

  return (
    <Container>
      <View style={{ marginTop: 25 }}>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter the title"
        />

        <Calendar
          markedDates={getMarkedDates()}
          markingType="period"
          onDayPress={onDayPress}
          theme={{
            selectedDayBackgroundColor: "#70d7c7",
            selectedDayTextColor: "white",
            todayTextColor: "#70d7c7",
            arrowColor: "#70d7c7",
          }}
        />
        <Button
          title="Clear Dates"
          onPress={() => {
            setStartDate(null);
            setEndDate(null);
          }}
        />
      </View>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>
          Start Date: {startDate || "Select a start date"}
        </Text>
      </View>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>
          End Date: {endDate || "Select a end date"}
        </Text>
      </View>
      <RNPickerSelect
        style={{
          inputIOS: {
            width: "50%",
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 4,
            backgroundColor: "#fff",
          },
          inputAndroid: {
            width: "50%",
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderWidth: 0.5,
            borderColor: "#ccc",
            borderRadius: 8,
            backgroundColor: "#fff",
          },
        }}
        onValueChange={(value) => {
          if (value === addCategoryText) {
            handleAddCategory();
          } else {
            setCategory(value);
          }
        }}
        items={categories.map((cat) => ({ label: cat, value: cat }))}
        placeholder={{ label: "Selecciona una categoría", value: null }}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </Container>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 4,
    backgroundColor: "white",
    marginBottom: 15,
  },

  dateContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  dateText: {
    fontSize: 18,
  },
});

export default TaskScreen;

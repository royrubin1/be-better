import React, { useState } from "react";
import { Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { auth, db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { uid } from "uid";
import Container from "../components/Container";
import RNPickerSelect from "react-native-picker-select";
import RNDateTimePicker from "@react-native-community/datetimepicker";

const TaskScreen = ({ navigation }) => {
  const addCategoryText = "Añadir categoría";
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
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
      start_date: startDate.getTime(),
      end_date: endDate.getTime(),
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

  return (
    <Container>
      <Text style={styles.label}>Título:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter the title"
      />

      <Text style={styles.label}>Fecha de inicio:</Text>
      <RNDateTimePicker
        mode="date"
        value={startDate}
        onChange={(event, selectedDate) => {
          const currentDate = selectedDate || startDate;
          if (event.type !== "dismissed") {
            setStartDate(currentDate);
          }
        }}
        display="default"
      />

      <Text style={styles.label}>Fecha de fin:</Text>
      <RNDateTimePicker
        mode="date"
        value={endDate}
        onChange={(event, selectedDate) => {
          const currentDate = selectedDate || endDate;
          if (event.type !== "dismissed") {
            setEndDate(currentDate);
          }
        }}
        display="default"
      />

      <Text style={styles.label}>Categoría:</Text>
      <RNPickerSelect
        style={{
          inputIOS: {
            height: 40,
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 4,
            backgroundColor: "#fff",
          },
          inputAndroid: {
            height: 40,
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
    marginBottom: 16,
    borderRadius: 4,
  },
});

export default TaskScreen;

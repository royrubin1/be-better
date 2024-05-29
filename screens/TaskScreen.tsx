import React, { useState } from "react";
import {
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  View,
  ScrollView,
  Platform,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { auth, db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { uid } from "uid";
import Container from "../components/Container";
import RNPickerSelect from "react-native-picker-select";
import { Calendar } from "react-native-calendars";

const TaskScreen = ({ navigation }) => {
  const addCategoryText = "Añadir categoría";
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([
    "Personal",
    "Trabajo",
    "Salud",
    addCategoryText,
  ]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerMode, setTimePickerMode] = useState("start"); // 'start' or 'end'
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleSubmit = async () => {
    if (!title || !date || !startTime || !endTime || !category) {
      alert("Por favor rellena todos los datos");
      return;
    }

    const goal = {
      title,
      start_date: startTime,
      end_date: endTime,
      category,
      done: false,
      user_id: auth.currentUser.uid,
    };

    await addGoalData(goal);
    navigation.navigate("Home");
  };

  const handleAddCategory = () => {
    if (Platform.OS === "ios") {
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
    } else {
      setIsModalVisible(true);
    }
  };

  const handleAndroidCategoryAdd = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories.slice(0, -1), newCategory, addCategoryText]);
      setCategory(newCategory);
    }
    setIsModalVisible(false);
    setNewCategory("");
  };

  const addGoalData = async (goal) => {
    const newGoalDocRef = doc(db, "goals", uid(20));
    await setDoc(newGoalDocRef, goal);
  };

  const onDayPress = (day) => {
    setDate(day.dateString);
    setShowTimePicker(true);
    setTimePickerMode("start");
  };

  const getMarkedDates = () => {
    const markedDates = {};
    if (date) {
      markedDates[date] = {
        selected: true,
        selectedColor: "#70d7c7",
      };
    }
    return markedDates;
  };

  const onTimePickerChange = (event, selectedDate) => {
    setShowTimePicker(false);
    if (selectedDate) {
      const timeString = selectedDate
        .toTimeString()
        .split(" ")[0]
        .substring(0, 5);
      if (timePickerMode === "start") {
        setStartTime(timeString);
        setShowTimePicker(true);
        setTimePickerMode("end");
      } else {
        setEndTime(timeString);
      }
    }
  };

  return (
    <Container>
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter the title"
        />

        <Calendar
          markedDates={getMarkedDates()}
          onDayPress={onDayPress}
          theme={{
            selectedDayBackgroundColor: "#70d7c7",
            selectedDayTextColor: "white",
            todayTextColor: "#70d7c7",
            arrowColor: "#70d7c7",
          }}
        />

        {showTimePicker && Platform.OS === "android" && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onTimePickerChange}
          />
        )}

        {showTimePicker && Platform.OS === "ios" && (
          <Modal transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <DateTimePicker
                  value={new Date()}
                  mode="time"
                  is24Hour={true}
                  display="spinner"
                  onChange={onTimePickerChange}
                />
                <Button title="Done" onPress={() => setShowTimePicker(false)} />
              </View>
            </View>
          </Modal>
        )}

        <Button
          title="Clear Dates"
          onPress={() => {
            setDate(null);
            setStartTime(null);
            setEndTime(null);
          }}
        />

        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>Date: {date || "Select a date"}</Text>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            Start Time: {startTime || "Select a start time"}
          </Text>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            End Time: {endTime || "Select an end time"}
          </Text>
        </View>
        <RNPickerSelect
          style={pickerSelectStyles}
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
      </ScrollView>
      {Platform.OS === "android" && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Añadir categoría</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre de la categoría"
                value={newCategory}
                onChangeText={setNewCategory}
              />
              <Button title="Añadir" onPress={handleAndroidCategoryAdd} />
              <Button
                title="Cancelar"
                onPress={() => {
                  setIsModalVisible(false);
                  setNewCategory("");
                }}
              />
            </View>
          </View>
        </Modal>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "100%",
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
    marginVertical: 5,
  },
  dateText: {
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  inputAndroid: {
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
});

export default TaskScreen;

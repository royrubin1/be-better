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
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { auth, db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { uid } from "uid";
import Container from "../components/Container";
import RNPickerSelect from "react-native-picker-select";
import { Calendar } from "react-native-calendars";

const TaskScreen = ({ navigation }) => {
  const ADD_CATEGORY_TEXT = "Añadir categoría";
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([
    "Personal",
    "Trabajo",
    "Salud",
    ADD_CATEGORY_TEXT,
  ]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerMode, setTimePickerMode] = useState("start");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleSubmit = async () => {
    if (!title || !date || !startTime || !endTime || !category) {
      Alert.alert("Por favor rellena todos los datos");
      return;
    }

    const goal = {
      title,
      start_date: startTime,
      end_date: endTime,
      date,
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
        ADD_CATEGORY_TEXT,
        "Introduce el nombre de la nueva categoría:",
        (input) => {
          if (input && !categories.includes(input)) {
            setCategories([
              ...categories.slice(0, -1),
              input,
              ADD_CATEGORY_TEXT,
            ]);
            setCategory(input);
          }
        }
      );
    } else {
      setIsModalVisible(true);
    }
  };

  const handleAndroidCategoryAdd = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([
        ...categories.slice(0, -1),
        newCategory,
        ADD_CATEGORY_TEXT,
      ]);
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
    return date ? { [date]: { selected: true, selectedColor: "#70d7c7" } } : {};
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

  const renderTimePicker = () => {
    if (!showTimePicker) return null;

    return (
      <DateTimePicker
        value={new Date()}
        mode="time"
        is24Hour={true}
        display="default"
        onChange={onTimePickerChange}
      />
    );
  };

  const renderIOSModal = () => {
    if (!showTimePicker || Platform.OS !== "ios") return null;

    return (
      <Modal transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {renderTimePicker()}
            <Button title="Done" onPress={() => setShowTimePicker(false)} />
          </View>
        </View>
      </Modal>
    );
  };

  const renderAndroidModal = () => {
    if (!isModalVisible) return null;

    return (
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
    );
  };

  return (
    <Container>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.bigTitle}>Crear tarea</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Título"
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

          {Platform.OS === "android" && renderTimePicker()}
          {renderIOSModal()}

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setDate(null);
              setStartTime(null);
              setEndTime(null);
            }}
          >
            <Text style={styles.buttonText}>Borrar fechas</Text>
          </TouchableOpacity>

          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>Fecha: {date || ""}</Text>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>
              Hora de inicio: {startTime || ""}
            </Text>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>
              Hora de finalización: {endTime || ""}
            </Text>
          </View>

          <RNPickerSelect
            style={pickerSelectStyles}
            onValueChange={(value) => {
              if (value === ADD_CATEGORY_TEXT) {
                handleAddCategory();
              } else {
                setCategory(value);
              }
            }}
            items={categories.map((cat) => ({ label: cat, value: cat }))}
            placeholder={{ label: "Selecciona una categoría", value: null }}
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Crear</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {renderAndroidModal()}
    </Container>
  );
};

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
  dateContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  dateText: {
    fontSize: 18,
    color: "#364f6b",
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
    color: "#364f6b",
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

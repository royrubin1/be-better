import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  AppState,
} from "react-native";
import moment from "moment";
import DateSection from "./DateSection";
import { auth, db } from "../config/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  GestureHandlerRootView,
  RectButton,
  Swipeable,
} from "react-native-gesture-handler";
import CheckBox from "./CheckBox";

const Schedule = () => {
  const currentDate = moment();
  const [selectedDay, setSelectedDay] = useState(currentDate.date());
  const [tasksByDay, setTasksByDay] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchAndFilterUserTasks = async () => {
        const selectedDate = currentDate.date(selectedDay).format("YYYY-MM-DD");
        const goals = await fetchUserTasks(selectedDate);
        goals.sort((a: any, b: any) => {
          if (a.start_date < b.start_date) return -1;
          if (a.start_date > b.start_date) return 1;
          return 0;
        });
        setTasksByDay({ ...tasksByDay, [selectedDay]: goals });
      };
      fetchAndFilterUserTasks();
    }
  }, [isAuthenticated, selectedDay]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserTasks = async (formatDate) => {
    // get all tasks with uid user auth
    const queryGoals = query(
      collection(db, "goals"),
      where("user_id", "==", auth.currentUser.uid),
      where("date", "==", formatDate)
    );

    const querySnapShot = await getDocs(queryGoals);
    const goals = [];
    querySnapShot.forEach((doc) => {
      goals.push({ id: doc.id, ...doc.data() });
    });
    return goals;
  };

  const syncTasksWithFirestore = async (idTask) => {
    const taskRef = doc(db, "goals", idTask);
    try {
      const taskSnap = await getDoc(taskRef);
      if (taskSnap.exists()) {
        const currentData = taskSnap.data();
        const currentDoneStatus = currentData.done;
        await updateDoc(taskRef, { done: !currentDoneStatus });
        console.log("Cambios guardados exitosamente en Firestore.");
      } else {
        console.log("Documento no encontrado!");
      }
    } catch (error) {
      console.error("Error al guardar cambios en Firestore:", error);
    }
  };

  // Category default with their colors
  const categoryColors = {
    Trabajo: "#3498db",
    Personal: "#e74c3c",
    Salud: "#2ecc71",
  };

  const deleteTask = async (taskId) => {
    await deleteDoc(doc(db, "goals", taskId));
    setTasksByDay({
      ...tasksByDay,
      [selectedDay]: tasksByDay[selectedDay].filter(
        (task) => task.id !== taskId
      ),
    });
  };

  const handleCheckboxChange = async (idItem) => {
    setTasksByDay((prevTasksByDay) => {
      const updatedTasks = prevTasksByDay[selectedDay].map((task) => {
        if (task.id === idItem) {
          return { ...task, done: !task.done };
        }
        return task;
      });

      return { ...prevTasksByDay, [selectedDay]: updatedTasks };
    });
    await syncTasksWithFirestore(idItem);
  };

  const renderHour = ({ item }) => {
    return (
      <View style={styles.objectiveContainer}>
        <View
          style={[
            styles.objectiveCard,
            {
              backgroundColor: !categoryColors[item.category]
                ? "#cccccc"
                : categoryColors[item.category],
            },
          ]}
        >
          <View style={{ display: "flex", flexDirection: "column", gap: 30 }}>
            <View
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={[
                  styles.objectiveTitle,
                  item.done && {
                    textDecorationLine: "line-through",
                  },
                ]}
              >
                {item.title}
              </Text>
              <CheckBox
                isChecked={item.done}
                onToggle={() => handleCheckboxChange(item.id)}
              />
            </View>
            <View
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.objectiveTime}>
                {item.start_date} - {item.end_date}
              </Text>
              <Text style={styles.objectiveCategory}>{item.category}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  const renderRightActions = (item) => {
    return (
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 120,
        }}
      >
        <RectButton
          style={styles.deleteButton}
          onPress={() => handleDelete(item)}
        >
          <Text style={styles.deleteButtonText}>Borrar</Text>
        </RectButton>
      </View>
    );
  };

  const handleDelete = (item) => {
    Alert.alert(
      "Borrar Objetivo",
      " Estás seguro de que quieres borrar esta tarea?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Borrar", onPress: () => deleteTask(item.id) },
      ],
      { cancelable: true }
    );
  };

  const handleDayPress = (day) => {
    setSelectedDay(day);
  };

  const SwipeableRow = ({ item }) => {
    let swipeableRef = null;

    const updateRef = (ref) => {
      swipeableRef = ref;
    };

    return (
      <Swipeable
        ref={updateRef}
        renderRightActions={() => renderRightActions(item)}
      >
        {renderHour({ item })}
      </Swipeable>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <DateSection selectedDay={selectedDay} handleDayPress={handleDayPress} />
      <View>
        <Text style={styles.dateText}>
          {moment(currentDate).date(selectedDay).format("dddd, D MMMM YYYY")}
        </Text>
        {!tasksByDay[selectedDay] || tasksByDay[selectedDay].length === 0 ? (
          <View
            style={{
              height: "90%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={styles.noTasksText}>No tasks for today!</Text>
            <Text style={styles.suggestionText}>
              How about taking a walk or reading a book?
            </Text>
          </View>
        ) : (
          <FlatList
            data={tasksByDay[selectedDay] || []}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <SwipeableRow item={item} />}
            style={{ height: "90%" }}
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    gap: 10,
  },
  dateText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  objectiveContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    marginBottom: 20,
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    width: 75,
    height: 40,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  objectiveCard: {
    padding: 14,
    borderRadius: 10,
    borderTopStartRadius: 20,
    borderBottomStartRadius: 20,
    borderStartWidth: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    width: "100%",
  },
  objectiveTime: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  objectiveTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    color: "white",
  },
  objectiveCategory: {
    fontSize: 16,
    textAlign: "right",
    fontWeight: "bold",
    color: "white",
  },
  reminderContainer: {
    height: 220,
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  reminderText: {
    color: "gray",
    marginBottom: 12,
  },
  containerTask: {
    backgroundColor: "#5e60ce",
    width: "100%",
    height: 80,
    marginBottom: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 40,
    padding: 12,
  },
  containerImage: {
    width: 50,
    backgroundColor: "#A7A8F5",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  noTasksText: {
    fontSize: 18,
    color: "#333",
    marginTop: 10,
  },
  suggestionText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
});
export default Schedule;

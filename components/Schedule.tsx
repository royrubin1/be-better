import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import moment from "moment";
import DateSection from "./DateSection";
import { auth, db } from "../config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const Schedule = () => {
  const currentDate = moment();
  const [selectedDay, setSelectedDay] = useState(currentDate.date());
  const [tasksByDay, setTasksByDay] = useState({});
  const [reminderTasks, setReminderTasks] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchAndFilterUserTasks = async () => {
        const selectedDate = currentDate.date(selectedDay).format("YYYY-MM-DD");
        const goals = await fetchUserTasks(selectedDate);
        setTasksByDay({ ...tasksByDay, [selectedDay]: goals });
      };
      fetchAndFilterUserTasks();
    }
  }, [isAuthenticated, selectedDay]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchAndFilterUserTasks = async () => {
        const tomorrowDate = moment().add(1, "day").format("YYYY-MM-DD");
        const goals = await fetchUserTasks(tomorrowDate);
        setReminderTasks(goals);
      };
      fetchAndFilterUserTasks();
    }
  }, [isAuthenticated]);

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
      where("start_date", "==", formatDate),
      where("done", "==", false)
    );

    const querySnapShot = await getDocs(queryGoals);
    const goals = [];
    querySnapShot.forEach((doc) => {
      goals.push({ id: doc.id, ...doc.data() });
    });
    return goals;
  };

  // Category default with their colors
  const categoryColors = {
    Trabajo: "#3498db",
    Personal: "#e74c3c",
    Salud: "#2ecc71",
  };

  const renderHour = ({ item }) => {
    return (
      <View style={styles.objectiveContainer}>
        <Text style={styles.objectiveTime}>
          {moment(item.start_date).format("DD-MM")}
        </Text>
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
          <Text style={styles.objectiveTitle}>{item.title}</Text>
          <Text style={styles.objectiveCategory}>{item.category}</Text>
        </View>
        <Text style={styles.objectiveTime}>
          {moment(item.end_date).format("DD-MM")}
        </Text>
      </View>
    );
  };

  const renderTasks = ({ item }) => {
    return (
      <View style={styles.containerTask}>
        <View style={styles.containerImage}>
          <Image
            source={require("../assets/calendario.png")}
            style={{ width: 30, height: 30 }}
          />
        </View>
        <View
          style={{
            flexDirection: "column",
            gap: 8,
          }}
        >
          <Text style={{ color: "#D4D4F6" }}>{item.title}</Text>
          <Text style={{ color: "#D4D4F6" }}>
            {moment(item.start_date, "YYYY-MM-DD").format("DD-MM")} -{" "}
            {moment(item.end_date, "YYYY-MM-DD").format("DD-MM")}
          </Text>
        </View>
      </View>
    );
  };

  const handleDayPress = (day) => {
    setSelectedDay(day);
  };

  return (
    <View style={styles.container}>
      <DateSection selectedDay={selectedDay} handleDayPress={handleDayPress} />
      <View style={{ maxHeight: "40%", minHeight: "40%" }}>
        <Text style={styles.dateText}>
          {moment(currentDate).date(selectedDay).format("dddd, D MMMM YYYY")}
        </Text>
        {!tasksByDay[selectedDay] || tasksByDay[selectedDay].length === 0 ? (
          <View
            style={{
              height: "100%",
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
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderHour}
            style={{ height: "100%" }}
          />
        )}
      </View>
      <View style={{ maxHeight: "40%" }}>
        <Text style={styles.reminderTitle}>Reminder</Text>
        <Text style={styles.reminderText}>
          Don't forget schedule for tomorrow
        </Text>
        {reminderTasks.length === 0 ? (
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "15%",
            }}
          >
            <Image
              style={{ width: "35%", height: 100 }}
              source={require("../assets/capibara_sleep.png")}
            />
          </View>
        ) : (
          <FlatList
            data={reminderTasks || []}
            showsVerticalScrollIndicator={false}
            renderItem={renderTasks}
            style={{ height: "100%" }}
          />
        )}
      </View>
    </View>
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
    padding: 12,
    marginBottom: 20,
  },
  objectiveCard: {
    alignSelf: "flex-end",
    padding: 14,
    borderRadius: 10,
    borderTopStartRadius: 20,
    borderBottomStartRadius: 20,
    borderStartWidth: 5,
    width: 250,
  },
  objectiveTime: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#c0c0c0",
  },
  objectiveTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "left",
  },
  objectiveCategory: {
    fontSize: 16,
    color: "white",
    textAlign: "right",
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

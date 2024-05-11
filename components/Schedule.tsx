import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import moment from "moment";
import DateSection from "./DateSection";
import { auth, db } from "../config/firebase";
import { uid } from "uid";
import { collection, getDocs, query, where } from "firebase/firestore";

const Schedule = () => {
  const currentDate = moment();
  const [selectedDay, setSelectedDay] = useState(currentDate.date());
  const [tasksByDay, setTasksByDay] = useState({});
  const [reminderTasks, setReminderTasks] = useState([]);

  useEffect(() => {
    const fetchAndFilterUserTasks = async () => {
      const goals = await fetchUserTasks();
      const filterGoals = goals.filter((goal) => {
        const selectedDate = currentDate.date(selectedDay);
        const selectedDayMilliseconds = selectedDate.valueOf();
        // Check if the current date is within the range
        return (
          goal.start_date >= selectedDayMilliseconds &&
          goal.end_date <= selectedDayMilliseconds
        );
      });
      setTasksByDay({ ...tasksByDay, [selectedDay]: filterGoals });
    };
    fetchAndFilterUserTasks();
  }, [selectedDay]);

  useEffect(() => {
    const fetchAndFilterUserTasks = async () => {
      const goals = await fetchUserTasks();
      const filterGoalsReminder = goals.filter((goal) => {
        const tomorrowDate = moment(currentDate)
          .add(1, "day")
          .startOf("day")
          .format("YYYY-MM-DD");
        const goalStartDate = moment(goal.start_date)
          .startOf("day")
          .format("YYYY-MM-DD");
        return goalStartDate.trim() === tomorrowDate.trim();
      });
      setReminderTasks(filterGoalsReminder);
    };
    fetchAndFilterUserTasks();
  }, []);

  const fetchUserTasks = async () => {
    // get all tasks with uid user auth
    const queryGoals = query(
      collection(db, "goals"),
      where("user_id", "==", auth.currentUser.uid)
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
            {moment(item.start_date).format("DD-MM")} -{" "}
            {moment(item.end_date).format("DD-MM")}
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
      <View style={{ maxHeight: "40%" }}>
        <Text style={styles.dateText}>
          {moment(currentDate).date(selectedDay).format("dddd, D MMMM YYYY")}
        </Text>
        <FlatList
          data={tasksByDay[selectedDay] || []}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderHour}
          style={{ height: "100%" }}
        />
      </View>
      <View style={{ maxHeight: "40%" }}>
        <Text style={styles.reminderTitle}>Reminder</Text>
        <Text style={styles.reminderText}>
          Don't forget schedule for tomorrow
        </Text>
        {!reminderTasks || [] ? (
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
});
export default Schedule;

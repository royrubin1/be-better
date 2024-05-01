import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import moment from "moment";

const Schedule = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [hoursByDay, setHoursByDay] = useState({});
  const [showTasks, setShowTasks] = useState(false);
  const currentDate = moment();
  const daysInMonth = [...Array(currentDate.daysInMonth()).keys()].map(
    (day) => day + 1
  );

  const renderDay = ({ item }) => {
    const date = moment(currentDate).date(item);
    const isActive = (day) => day === selectedDay;

    return (
      <TouchableOpacity
        onPress={() => handleDayPress(item)}
        style={[
          styles.dayContainer,
          isActive(item) && { backgroundColor: "#EAF5EC" },
        ]}
      >
        <Text style={[styles.day, isActive(item) && { color: "#40916C" }]}>
          {date.format("D")}
        </Text>
        <Text style={[styles.weekday, isActive(item) && { color: "#40916C" }]}>
          {date.format("ddd")}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderHour = ({ item }) => {
    return (
      <View style={styles.objectiveContainer}>
        <Text style={styles.objectiveTime}>{item.startTime}</Text>
        <View style={styles.objectiveCard}>
          <Text style={styles.objectiveTitle}>{item.title}</Text>
          <Text style={styles.objectiveCategory}>{item.category}</Text>
        </View>
        <Text style={styles.objectiveTime}>{item.endTime}</Text>
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
            {item.startTime} - {item.endTime}
          </Text>
        </View>
      </View>
    );
  };

  const handleReminderClick = () => {
    setShowTasks(!showTasks);
  };

  const handleDayPress = (day) => {
    setSelectedDay(day);
    const exampleObjectives = [
      {
        startTime: "09.00",
        endTime: "10.00",
        title: "Team Meeting",
        category: "Work",
      },
      {
        startTime: "11.00",
        endTime: "12.00",
        title: "Gym",
        category: "Health",
      },
      {
        startTime: "14.00",
        endTime: "16.00",
        title: "Work on Project",
        category: "Work",
      },
    ];
    setHoursByDay({ ...hoursByDay, [day]: exampleObjectives });
  };

  return (
    <View style={styles.container}>
      <View>
        <FlatList
          data={daysInMonth}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderDay}
        />
      </View>
      <View style={{ maxHeight: "40%" }}>
        <Text style={styles.dateText}>
          {selectedDay
            ? moment(currentDate).date(selectedDay).format("dddd, D MMMM YYYY")
            : "Select a Day"}
        </Text>
        <FlatList
          data={hoursByDay[selectedDay] || []}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderHour}
          style={{ height: "100%" }}
        />
      </View>
      <View style={{ maxHeight: "40%" }}>
        <TouchableOpacity onPress={handleReminderClick}>
          <Text style={styles.reminderTitle}>Reminder</Text>
          <Text style={styles.reminderText}>
            Don't forget schedule for tomorrow
          </Text>
        </TouchableOpacity>
        {!showTasks ? (
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10%",
            }}
          >
            <Image
              style={{ width: "35%", height: 100 }}
              source={require("../assets/capibara_sleep.png")}
            />
          </View>
        ) : (
          <FlatList
            data={hoursByDay[selectedDay] || []}
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
  dayContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    backgroundColor: "#f0f0f0",
    margin: 5,
    borderRadius: 10,
  },
  day: {
    fontSize: 18,
    fontWeight: "bold",
  },
  weekday: {
    fontSize: 14,
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
    backgroundColor: "#40916C",
    padding: 14,
    borderRadius: 10,
    width: 250,
  },
  objectiveTime: {
    fontSize: 16,
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

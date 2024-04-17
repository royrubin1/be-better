import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import moment from "moment";

const Schedule = () => {
  const [selectedDay, setSelectedDay] = useState(null);
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

  const handleDayPress = (day) => {
    setSelectedDay(day);
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={daysInMonth}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.toString()}
        renderItem={renderDay}
      />
      <View style={{ marginVertical: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          {selectedDay
            ? moment(currentDate).date(selectedDay).format("dddd, D MMMM YYYY")
            : "Selecciona un día"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default Schedule;

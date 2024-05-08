import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import moment from "moment";

const DateSection = ({ selectedDay, handleDayPress }) => {
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

  return (
    <View>
      <View>
        <FlatList
          data={daysInMonth}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderDay}
        />
      </View>
    </View>
  );
};

export default DateSection;

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

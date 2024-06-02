import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";
import { PieChart, LineChart } from "react-native-chart-kit";
import { auth, db } from "../config/firebase";
import Container from "../components/Container";

const StatisticsScreen = () => {
  const [goals, setGoals] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [
      {
        data: Array(7).fill(0), // Default values for completed goals
        color: () => `rgba(134, 65, 244, 1)`, // completed goals color
        strokeWidth: 2,
      },
      {
        data: Array(7).fill(0), // Default values for uncompleted goals
        color: () => `rgba(0, 0, 0, 1)`, // uncompleted goals color
        strokeWidth: 2,
      },
    ],
  });

  const getGoals = async () => {
    const q = query(
      collection(db, "goals"),
      where("user_id", "==", auth.currentUser.uid)
    );

    const querySnapshot = await getDocs(q);
    const goalsData = querySnapshot.docs.map((doc) => doc.data());
    return goalsData;
  };

  const calculateCategoryData = (goalsData) => {
    const categories = goalsData.reduce((acc, goal) => {
      acc[goal.category] = (acc[goal.category] || 0) + 1;
      return acc;
    }, {});

    const categoryColors = {
      Trabajo: "#3498db",
      Personal: "#e74c3c",
      Salud: "#2ecc71",
    };

    return Object.keys(categories).map((category) => ({
      name: category,
      count: categories[category],
      color: categoryColors[category] || "#cccccc",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    }));
  };

  const calculateLineChartData = (goalsData) => {
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - 6);

    const filteredGoals = goalsData.filter(
      (goal) => new Date(goal.date) >= startDate
    );

    const completedGoals = Array(7).fill(0);
    const uncompletedGoals = Array(7).fill(0);
    const labels = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateString = date.toISOString().split("T")[0];
      const label = dateString.substring(8);

      const goalsForDate = filteredGoals.filter(
        (goal) => goal.date === dateString
      );

      const completedCount = goalsForDate.filter((goal) => goal.done).length;
      const uncompletedCount = goalsForDate.filter((goal) => !goal.done).length;

      completedGoals[i] = completedCount;
      uncompletedGoals[i] = uncompletedCount;
      labels.push(label);
    }

    return { labels, completedGoals, uncompletedGoals };
  };

  useEffect(() => {
    const fetchGoals = async () => {
      const goalsData = await getGoals();
      setGoals(goalsData);

      const categoryChartData = calculateCategoryData(goalsData);
      setCategoryData(categoryChartData);

      const last7DaysData = calculateLineChartData(goalsData);
      setLineChartData({
        labels: last7DaysData.labels,
        datasets: [
          {
            data: last7DaysData.completedGoals,
            color: () => `rgba(56, 126, 255, 1)`,
            strokeWidth: 2,
          },
          {
            data: last7DaysData.uncompletedGoals,
            color: () => `rgba(122, 0, 0, 1)`,
            strokeWidth: 2,
          },
        ],
      });
    };

    fetchGoals();
  }, []);

  return (
    <Container>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.bigTitle}>Estadísticas de Objetivos</Text>
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Progreso en los últimos 7 días</Text>
          <LineChart
            data={lineChartData}
            width={Dimensions.get("window").width - 30}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={chartConfig}
            bezier
          />
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Objetivos por categoría</Text>
          <PieChart
            data={categoryData}
            width={Dimensions.get("window").width - 20}
            height={220}
            chartConfig={chartConfig}
            accessor="count"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Total Objetivos</Text>
            <Text style={styles.summaryValue}>{goals.length}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Objetivos Completados</Text>
            <Text style={styles.summaryValue}>
              {goals.filter((goal) => goal.done).length}
            </Text>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};

const chartConfig = {
  backgroundGradientFrom: "#616161",
  backgroundGradientTo: "#616161",
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 20,
    padding: 10,
  },
  bigTitle: {
    fontSize: 34,
    color: "#364f6b",
    fontWeight: "bold",
    marginBottom: 20,
  },
  chartContainer: {
    marginVertical: 20,
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 18,
    marginBottom: 10,
    color: "#333333",
    textAlign: "center",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    width: "100%",
  },
  summaryCard: {
    backgroundColor: "#4e5d6c",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    minWidth: "40%",
  },
  summaryTitle: {
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "bold",
  },
});

export default StatisticsScreen;

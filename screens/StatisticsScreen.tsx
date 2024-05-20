import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";
import { PieChart, LineChart } from "react-native-chart-kit";
import { auth, db } from "../config/firebase";

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

  useEffect(() => {
    const fetchGoals = async () => {
      const goalsData = await getGoals();
      setGoals(goalsData);

      // Calculate statistics for pie chart
      const categories = goalsData.reduce((acc, goal) => {
        acc[goal.category] = (acc[goal.category] || 0) + 1;
        return acc;
      }, {});

      const categoryChartData = Object.keys(categories).map((category) => ({
        name: category,
        count: categories[category],
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
      }));

      setCategoryData(categoryChartData);

      // Calculate data for line chart (last 7 days)
      const calculateLineChartData = () => {
        const now = new Date();
        const startDate = new Date(now.setDate(now.getDate() - 6)); // Get date 6 days ago, including today it's 7 days
        const filteredGoals = goalsData.filter(
          (goal) => new Date(goal.start_date) >= startDate
        );

        const completedGoals = Array(7).fill(0);
        const uncompletedGoals = Array(7).fill(0);
        const labels = [];

        for (let i = 0; i < 7; i++) {
          const date = new Date(startDate);
          date.setDate(date.getDate() + i);
          const dateString = date.toISOString().split("T")[0];
          const label = dateString.substring(8); // Remove year from date (MM-DD format)

          const goalsForDate = filteredGoals.filter((goal) => {
            const goalDate = new Date(goal.start_date)
              .toISOString()
              .split("T")[0];
            return goalDate === dateString;
          });

          const completedCount = goalsForDate.filter(
            (goal) => goal.done
          ).length;
          const uncompletedCount = goalsForDate.filter(
            (goal) => !goal.done
          ).length;

          completedGoals[i] = completedCount;
          uncompletedGoals[i] = uncompletedCount;
          labels.push(label);
        }

        return { labels, completedGoals, uncompletedGoals };
      };

      const last7DaysData = calculateLineChartData();

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
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Estadísticas de objetivos</Text>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Progreso en los últimos 7 días</Text>
        <LineChart
          data={lineChartData}
          width={Dimensions.get("window").width - 20}
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
    </ScrollView>
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
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    textAlign: "center",
    marginVertical: 20,
    fontWeight: "bold",
  },
  chartContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  chartTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default StatisticsScreen;

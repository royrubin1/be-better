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

      // Category default with their colors
      const categoryColors = {
        Trabajo: "#3498db",
        Personal: "#e74c3c",
        Salud: "#2ecc71",
      };

      const categoryChartData = Object.keys(categories).map((category) => ({
        name: category,
        count: categories[category],
        color: !categoryColors[category] ? "#cccccc" : categoryColors[category],
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
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Estadísticas de Objetivos</Text>
      </View>
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
    flexGrow: 1,
    backgroundColor: "#ffffff", // Fondo claro para un diseño moderno
  },
  headerContainer: {
    paddingVertical: 30,
    backgroundColor: "#4e5d6c", // Un color de fondo más oscuro para el encabezado
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    color: "#ffffff", // Texto claro para contraste
    fontWeight: "bold",
  },
  chartContainer: {
    marginVertical: 20,
    padding: 16,
    backgroundColor: "#f8f9fa", // Fondo claro para los contenedores de gráficos
    borderRadius: 8,
    shadowColor: "#000", // Sombra para dar profundidad
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
    color: "#333333", // Color oscuro para el título del gráfico
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  // Tarjeta de Resumen
  summaryCard: {
    backgroundColor: "#4e5d6c",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    minWidth: "40%", // Asegura que las tarjetas tengan un ancho mínimo
  },
  // Título de la Tarjeta de Resumen
  summaryTitle: {
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 5,
  },
  // Valor de la Tarjeta de Resumen
  summaryValue: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "bold",
  },
});

export default StatisticsScreen;

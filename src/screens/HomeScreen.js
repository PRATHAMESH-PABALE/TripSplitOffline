import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { loadTrips } from "../utils/storage";

export default function HomeScreen({ navigation }) {
  const [trips, setTrips] = useState([]);

  const refresh = async () => {
    const t = await loadTrips();
    setTrips(t);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", refresh);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Trips</Text>
        <Text style={styles.subtitle}>Manage your group expenses</Text>
      </View>

      {trips.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>✈️</Text>
          <Text style={styles.emptyText}>No trips yet</Text>
          <Text style={styles.emptySubtext}>Create your first trip to get started</Text>
        </View>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.tripCard}
              onPress={() => navigation.navigate("Trip", { tripId: item.id })}
              activeOpacity={0.7}
            >
              <View style={styles.tripHeader}>
                <Text style={styles.tripName}>{item.name}</Text>
                <Text style={styles.arrow}>→</Text>
              </View>
              <View style={styles.memberContainer}>
                <Text style={styles.memberIcon}>👥</Text>
                <Text style={styles.memberText}>{item.members.join(", ")}</Text>
              </View>
              <Text style={styles.expenseCount}>
                {item.expenses?.length || 0} expense{item.expenses?.length !== 1 ? 's' : ''}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate("CreateTrip")}
        activeOpacity={0.8}
      >
        <Text style={styles.createButtonText}>+ Create New Trip</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#4A90E2",
    padding: 24,
    paddingTop: 60,
    paddingBottom: 30,
  },
  title: { 
    fontSize: 32, 
    fontWeight: "bold", 
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#e8f4ff",
  },
  listContainer: {
    padding: 16,
  },
  tripCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  tripName: { 
    fontSize: 20, 
    fontWeight: "bold",
    color: "#2c3e50",
    flex: 1,
  },
  arrow: {
    fontSize: 24,
    color: "#4A90E2",
    fontWeight: "bold",
  },
  memberContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  memberIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  memberText: {
    color: "#7f8c8d",
    fontSize: 14,
    flex: 1,
  },
  expenseCount: {
    color: "#95a5a6",
    fontSize: 13,
    fontStyle: "italic",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
  },
  createButton: {
    backgroundColor: "#4A90E2",
    margin: 16,
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
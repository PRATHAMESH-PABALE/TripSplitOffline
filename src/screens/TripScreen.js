import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { loadTrips, updateTrip, saveTrips } from "../utils/storage";

export default function TripScreen({ route, navigation }) {
  const { tripId } = route.params;
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    const fetchTrip = async () => {
      const trips = await loadTrips();
      const t = trips.find((tr) => tr.id === tripId);
      setTrip(t);
    };
    fetchTrip();
  }, []);

  const deleteExpense = async (id) => {
    const trips = await loadTrips();
    const index = trips.findIndex((t) => t.id === tripId);

    const updatedTrip = { ...trips[index] };
    updatedTrip.expenses = updatedTrip.expenses.filter((e) => e.id !== id);

    await updateTrip(updatedTrip);
    setTrip(updatedTrip);
    Alert.alert("Deleted!", "Expense removed successfully");
  };

  const getTotal = () => {
    if (!trip?.expenses?.length) return 0;
    return trip.expenses.reduce((sum, e) => sum + e.amount, 0);
  };

  const splitExpense = () => {
    const total = getTotal();
    const perHead = total / trip.members.length;
    Alert.alert(
      "💰 Split Summary",
      `Total Spent: ₹${total.toFixed(2)}\n\nPer Person: ₹${perHead.toFixed(2)}\n\n${trip.members.length} members splitting equally`
    );
  };

  const deleteTrip = async () => {
    Alert.alert(
      "⚠️ Delete Trip",
      `Are you sure you want to delete "${trip.name}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const trips = await loadTrips();
            const updatedTrips = trips.filter((t) => t.id !== tripId);
            await saveTrips(updatedTrips);
            Alert.alert("Deleted!", "Trip removed successfully");
            navigation.navigate("Home");
          },
        },
      ]
    );
  };

  if (!trip) return <View style={styles.loading}><Text>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.tripName}>{trip.name}</Text>
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Spent</Text>
          <Text style={styles.totalAmount}>₹{getTotal().toFixed(2)}</Text>
        </View>
      </View>

      {trip.expenses.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>💸</Text>
          <Text style={styles.emptyText}>No expenses yet</Text>
          <Text style={styles.emptySubtext}>Add your first expense to get started</Text>
        </View>
      ) : (
        <FlatList
          data={trip.expenses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.expenseCard}>
              <View style={styles.expenseHeader}>
                <Text style={styles.expenseTitle}>{item.title}</Text>
                <Text style={styles.expenseAmount}>₹{item.amount.toFixed(2)}</Text>
              </View>
              <View style={styles.expenseFooter}>
                <View style={styles.paidByContainer}>
                  <Text style={styles.paidByLabel}>Paid by</Text>
                  <Text style={styles.paidByName}>{item.paidBy}</Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() =>
                    Alert.alert(
                      "Delete Expense",
                      `Remove "${item.title}"?`,
                      [
                        { text: "Cancel", style: "cancel" },
                        { 
                          text: "Delete", 
                          style: "destructive",
                          onPress: () => deleteExpense(item.id) 
                        },
                      ]
                    )
                  }
                  activeOpacity={0.7}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <View style={styles.actionBar}>
        <TouchableOpacity
          style={[styles.actionButton, styles.addButton]}
          onPress={() => navigation.navigate("AddExpense", { tripId })}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>+ Add Expense</Text>
        </TouchableOpacity>

        <View style={styles.secondaryActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.splitButton]}
            onPress={splitExpense}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>Split Bill</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteTrip]}
            onPress={deleteTrip}
            activeOpacity={0.8}
          >
            <Text style={styles.deleteButtonText}>Delete Trip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8f9fa",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#4A90E2",
    padding: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  tripName: { 
    fontSize: 28, 
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  totalCard: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  totalLabel: {
    fontSize: 14,
    color: "#e8f4ff",
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
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
  expenseCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  expenseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  expenseTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    flex: 1,
  },
  expenseAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#27ae60",
  },
  expenseFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paidByContainer: {
    flex: 1,
  },
  paidByLabel: {
    fontSize: 12,
    color: "#95a5a6",
    marginBottom: 2,
  },
  paidByName: {
    fontSize: 14,
    color: "#7f8c8d",
    fontWeight: "500",
  },
  deleteButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#ffe5e5",
  },
  deleteButtonText: {
    color: "#e74c3c",
    fontSize: 14,
    fontWeight: "600",
  },
  actionBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  actionButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: "#4A90E2",
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  secondaryActions: {
    flexDirection: "row",
    gap: 8,
  },
  splitButton: {
    flex: 1,
    backgroundColor: "#27ae60",
  },
  deleteTrip: {
    flex: 1,
    backgroundColor: "#ffe5e5",
    borderWidth: 1,
    borderColor: "#e74c3c",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
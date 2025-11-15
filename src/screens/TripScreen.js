import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  Alert,
  StyleSheet,
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
    Alert.alert("Expense deleted!");
  };

  const getTotal = () => {
    if (!trip?.expenses?.length) return 0;
    return trip.expenses.reduce((sum, e) => sum + e.amount, 0);
  };

  const splitExpense = () => {
    const total = getTotal();
    const perHead = total / trip.members.length;
    Alert.alert(
      "Split Summary",
      `Total: ₹${total}\nEach member should pay: ₹${perHead.toFixed(2)}`
    );
  };

  const deleteTrip = async () => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete the trip "${trip.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const trips = await loadTrips();
            const updatedTrips = trips.filter((t) => t.id !== tripId);
            await saveTrips(updatedTrips);
            Alert.alert("Trip deleted!");
            navigation.navigate("Home");
          },
        },
      ]
    );
  };

  if (!trip) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.tripName}>{trip.name}</Text>
      <Text style={styles.total}>Total Spent: ₹{getTotal()}</Text>

      <FlatList
        data={trip.expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.expenseItem}>
            <Text style={styles.title}>
              {item.title} - ₹{item.amount}
            </Text>
            <Text>Paid by: {item.paidBy}</Text>
            <Button
              title="Delete Expense"
              color="red"
              onPress={() =>
                Alert.alert(
                  "Confirm Delete",
                  "Delete this expense?",
                  [
                    { text: "Cancel" },
                    { text: "Delete", onPress: () => deleteExpense(item.id) },
                  ]
                )
              }
            />
          </View>
        )}
      />

      <View style={styles.buttonContainer}>
        <Button
          title="Add Expense"
          onPress={() => navigation.navigate("AddExpense", { tripId })}
        />
        <Button title="Split Trip" onPress={splitExpense} />
        <Button title="Delete Trip" color="red" onPress={deleteTrip} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  tripName: { fontSize: 22, fontWeight: "bold" },
  total: { fontSize: 18, marginVertical: 10 },
  expenseItem: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    marginVertical: 6,
    borderRadius: 8,
  },
  title: { fontWeight: "bold" },
  buttonContainer: { marginTop: 20, gap: 10 },
});

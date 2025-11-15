import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Text,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { loadTrips, updateTrip } from "../utils/storage";

function makeId() {
  return Math.random().toString(36).substr(2, 9);
}

export default function AddExpenseScreen({ navigation, route }) {
  const { tripId } = route.params;
  const [trip, setTrip] = useState(null);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");

  useEffect(() => {
    (async () => {
      const trips = await loadTrips();
      const t = trips.find((tr) => tr.id === tripId);
      setTrip(t);
      if (t?.members?.length > 0) setPaidBy(t.members[0]);
    })();
  }, []);

  const addExpense = async () => {
    if (!title || !amount || !paidBy) {
      Alert.alert("Please fill all fields");
      return;
    }

    const trips = await loadTrips();
    const index = trips.findIndex((t) => t.id === tripId);

    const newExpense = {
      id: makeId(),
      title,
      amount: parseFloat(amount),
      paidBy,
    };

    const updatedTrip = { ...trips[index] };
    updatedTrip.expenses = [...updatedTrip.expenses, newExpense];
    await updateTrip(updatedTrip);

    Alert.alert("Expense Added!");
    navigation.goBack();
  };

  if (!trip) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Expense Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        placeholder="e.g. Dinner, Cab"
      />

      <Text style={styles.label}>Amount</Text>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
        placeholder="Enter amount"
      />

      <Text style={styles.label}>Paid By</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={paidBy}
          onValueChange={(itemValue) => setPaidBy(itemValue)}
        >
          {trip.members.map((m) => (
            <Picker.Item key={m} label={m} value={m} />
          ))}
        </Picker>
      </View>

      <Button title="Add Expense" onPress={addExpense} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { marginTop: 10, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
  },
});

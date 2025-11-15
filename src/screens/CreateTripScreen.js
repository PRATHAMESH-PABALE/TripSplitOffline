import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { loadTrips, saveTrips } from "../utils/storage";

function makeId() {
  return Math.random().toString(36).substr(2, 9);
}

export default function CreateTripScreen({ navigation }) {
  const [tripName, setTripName] = useState("");
  const [members, setMembers] = useState("");

  const createTrip = async () => {
    if (!tripName || !members) {
      Alert.alert("Please fill both fields");
      return;
    }

    const memberList = members.split(",").map((m) => m.trim());
    const newTrip = {
      id: makeId(),
      name: tripName,
      members: memberList,
      expenses: [],
    };

    const trips = await loadTrips();
    trips.push(newTrip);
    await saveTrips(trips);

    Alert.alert("Trip Created!");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Trip Name</Text>
      <TextInput
        value={tripName}
        onChangeText={setTripName}
        style={styles.input}
        placeholder="Goa Trip"
      />

      <Text style={styles.label}>Members (comma-separated)</Text>
      <TextInput
        value={members}
        onChangeText={setMembers}
        style={styles.input}
        placeholder="e.g. Prathamesh, Ashutosh, Riya"
      />

      <Button title="Create Trip" onPress={createTrip} />
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
});

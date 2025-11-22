import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { loadTrips, saveTrips } from "../utils/storage";

function makeId() {
  return Math.random().toString(36).substr(2, 9);
}

export default function CreateTripScreen({ navigation }) {
  const [tripName, setTripName] = useState("");
  const [members, setMembers] = useState("");

  const createTrip = async () => {
    if (!tripName || !members) {
      Alert.alert("Missing Information", "Please fill both fields");
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

    Alert.alert("Success!", "Trip created successfully");
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create New Trip</Text>
        <Text style={styles.headerSubtitle}>Set up your group expense tracker</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>🏖️ Trip Name</Text>
          <TextInput
            value={tripName}
            onChangeText={setTripName}
            style={styles.input}
            placeholder="e.g. Goa Weekend, NYC 2024"
            placeholderTextColor="#95a5a6"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>👥 Members</Text>
          <Text style={styles.hint}>Add names separated by commas</Text>
          <TextInput
            value={members}
            onChangeText={setMembers}
            style={[styles.input, styles.multilineInput]}
            placeholder="e.g. Prathamesh, Ashutosh, Riya"
            placeholderTextColor="#95a5a6"
            multiline
          />
        </View>

        <TouchableOpacity
          style={styles.createButton}
          onPress={createTrip}
          activeOpacity={0.8}
        >
          <Text style={styles.createButtonText}>Create Trip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#e8f4ff",
  },
  content: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: { 
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 8,
  },
  hint: {
    fontSize: 13,
    color: "#7f8c8d",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#2c3e50",
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  createButton: {
    backgroundColor: "#4A90E2",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
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
  cancelButton: {
    backgroundColor: "transparent",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  cancelButtonText: {
    color: "#7f8c8d",
    fontSize: 16,
    fontWeight: "600",
  },
});
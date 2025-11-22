import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Text,
  ScrollView,
  Modal,
} from "react-native";
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
  const [showMemberPicker, setShowMemberPicker] = useState(false);

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
      Alert.alert("Missing Information", "Please fill all fields");
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

    Alert.alert("Success!", "Expense added successfully");
    navigation.goBack();
  };

  if (!trip) return <View style={styles.loading}><Text>Loading...</Text></View>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Expense</Text>
        <Text style={styles.headerSubtitle}>For {trip.name}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>💰 Expense Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            placeholder="e.g. Dinner, Taxi, Hotel"
            placeholderTextColor="#95a5a6"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>💵 Amount</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor="#95a5a6"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>👤 Paid By</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowMemberPicker(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.pickerButtonText}>{paidBy || "Select member"}</Text>
            <Text style={styles.pickerArrow}>▼</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={addExpense}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>Add Expense</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showMemberPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMemberPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Member</Text>
              <TouchableOpacity onPress={() => setShowMemberPicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {trip.members.map((member) => (
                <TouchableOpacity
                  key={member}
                  style={[
                    styles.memberOption,
                    paidBy === member && styles.memberOptionSelected
                  ]}
                  onPress={() => {
                    setPaidBy(member);
                    setShowMemberPicker(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.memberOptionText,
                    paidBy === member && styles.memberOptionTextSelected
                  ]}>
                    {member}
                  </Text>
                  {paidBy === member && (
                    <Text style={styles.checkMark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
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
  input: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#2c3e50",
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#27ae60",
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    padding: 16,
    fontSize: 20,
    fontWeight: "600",
    color: "#2c3e50",
  },
  pickerButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pickerButtonText: {
    fontSize: 16,
    color: "#2c3e50",
    fontWeight: "500",
  },
  pickerArrow: {
    fontSize: 12,
    color: "#7f8c8d",
  },
  addButton: {
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
  addButtonText: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  modalClose: {
    fontSize: 24,
    color: "#7f8c8d",
    fontWeight: "300",
  },
  memberOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  memberOptionSelected: {
    backgroundColor: "#e8f4ff",
  },
  memberOptionText: {
    fontSize: 16,
    color: "#2c3e50",
  },
  memberOptionTextSelected: {
    fontWeight: "600",
    color: "#4A90E2",
  },
  checkMark: {
    fontSize: 20,
    color: "#4A90E2",
    fontWeight: "bold",
  },
});
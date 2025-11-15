import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from "react-native";
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
      <Text style={styles.title}>Your Trips</Text>

      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.tripItem}
            onPress={() => navigation.navigate("Trip", { tripId: item.id })}
          >
            <Text style={styles.tripName}>{item.name}</Text>
            <Text>{item.members.join(", ")}</Text>
          </TouchableOpacity>
        )}
      />

      <Button title="Create New Trip" onPress={() => navigation.navigate("CreateTrip")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  tripItem: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
  },
  tripName: { fontWeight: "bold" },
});

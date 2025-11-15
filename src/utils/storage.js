import AsyncStorage from "@react-native-async-storage/async-storage";

const TRIPS_KEY = "TRIPS_DATA";

export async function loadTrips() {
  try {
    const json = await AsyncStorage.getItem(TRIPS_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error("Error loading trips:", e);
    return [];
  }
}

export async function saveTrips(trips) {
  try {
    await AsyncStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
  } catch (e) {
    console.error("Error saving trips:", e);
  }
}

export async function updateTrip(updatedTrip) {
  try {
    const trips = await loadTrips();
    const index = trips.findIndex((t) => t.id === updatedTrip.id);
    if (index !== -1) {
      trips[index] = updatedTrip;
      await saveTrips(trips);
    }
  } catch (e) {
    console.error("Error updating trip:", e);
  }
}

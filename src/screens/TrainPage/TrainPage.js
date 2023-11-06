import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Button,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import SchedulesPage from "../SchedulesPage/SchedulesPage";
// import geoDistance from 'geo-distance-helper';

const stationCoordinates = [
  { name: "Antipolo", latitude: 14.6248, longitude: 121.1213 }, // Antipolo Station
  { name: "Marikina", latitude: 14.62039, longitude: 121.10014 }, // Marikina-Pasig Station
  { name: "Pajaron", latitude: 14.6184, longitude: 121.09111 }, // LANDMARK CLOSE TO SANTOLAN STATION (PAJARON)
  { name: "BCEO", latitude: 14.61988, longitude: 121.08848 }, // LANDMARK CLOSE TO SANTOLAN STATION (BCEO)
  { name: "Santolan", latitude: 14.62211, longitude: 121.08596 }, // Santolan Station
];

const TrainPage = ({ navigation }) => {
  const mapRef = useRef(null); // Create a ref for the MapView
  const [showSchedules, setShowSchedules] = useState(false);
  const [trainDirection, setTrainDirection] = useState({});
  const [prevTrainLongitudes, setPrevTrainLongitudes] = useState({});

  const updateTrainData = () => {
    Promise.all([
      PWXSensor1GetRequestFromTagIO(),
      PWXSensor2GetRequestFromTagIO(),

      // Sensor1GetRequestFromTagIO(),
      // Sensor2GetRequestFromTagIO(),
      // Sensor3GetRequestFromTagIO(),
      // Sensor4GetRequestFromTagIO(),
    ])
      .then((responses) => {
        const updatedTrainData = responses.map((response, index) => {
          const { latitude, longitude } = response;
          const speed = response.speed;
          const prevLongitude = prevTrainLongitudes[index];
          console.log(index);
          // Determine the train direction
          const direction = getTrainDirection(
            index,
            prevLongitude,
            longitude,
            stationCoordinates[index].longitude
          );
          console.log("Direction of Train: ", direction);

          // Update train direction
          setTrainDirection((prevDirection) => ({
            ...prevDirection,
            [index]: direction,
          }));
          // Update the previous longitude for the train
          setPrevTrainLongitudes((prevLongitudes) => ({
            ...prevLongitudes,
            [index]: longitude,
          }));
          return {
            id: index + 1, // Assign a unique id based on the index
            latitude: response.latitude,
            longitude: response.longitude,
            speed: response.speed,
          };
        });

        setTrainData(updatedTrainData);
        console.log("Updated Train Data: ", updatedTrainData);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    const interval = setInterval(updateTrainData, 3000); //POST Request every 1 second, can be changed

    return () => clearInterval(interval);
  }, []);

  const getTrainDirection = (
    trainId,
    prevLng,
    currentLng,
    stationLongitude
  ) => {
    if (prevLng === undefined) {
      return "Previous Longitude is undefined";
    }

    console.log("TESTTSTSTSTS", currentLng);

    if (currentLng > prevLng) {
      if (currentLng < stationLongitude) {
        return "Approaching"; // Train is moving east and approaching the station
      } else {
        return "Eastbound"; // Train is moving east but not approaching the station
      }
    } else if (currentLng < prevLng) {
      if (currentLng > stationLongitude) {
        return "Approaching"; // Train is moving west and approaching the station
      } else {
        return "Westbound"; // Train is moving west but not approaching the station
      }
    }

    return "No significant movement"; // No significant movement
  };

  const handleDoubleTap = () => {
    mapRef.current.animateToRegion(initialRegion, 500); // Adjust the duration as needed
    setSelectedStation(null);
  };

  // Initial Train values
  const [trainData, setTrainData] = useState([]);

  const [selectedStation, setSelectedStation] = useState(null);

  const PWXSensor1GetRequestFromTagIO = () => {
    const url = "https://api.tago.io/data?variable=location&variable=speed";
    const deviceToken = "6037a6da-0cc8-46bd-8296-f75dc7c17428"; // Replace with your actual device token

    const headers = new Headers({
      Authorization: deviceToken,
    });

    const requestOptions = {
      method: "GET",
      headers: headers,
    };

    return fetch(url, requestOptions)
      .then((response) => response.json())
      .then((json) => {
        const locationData = json.result.find(
          (item) => item.variable === "location"
        );
        if (locationData && locationData.value) {
          const coordinates = locationData.value
            .split(",")
            .map((coord) => parseFloat(coord.trim()));
          const [latitude, longitude] = coordinates;

          const speedData = json.result.find(
            (item) => item.variable === "speed"
          );
          const speed = speedData
            ? speedData.value
            : "Train 1 is currently not moving.";

          console.log("Latitude of Node 1:", latitude);
          console.log("Longitude of Node 1:", longitude);
          console.log("Speed of Node 1:", speed);
          return { latitude, longitude, speed };
        }
        return null;
      })
      .catch((error) => {
        console.error("Node 1 has a " + error);
      });
  };

  const PWXSensor2GetRequestFromTagIO = () => {
    const url = "https://api.tago.io/data?variable=location&variable=speed";
    const deviceToken = "09824749-dc75-40c5-9a95-5df1bc4d1ce2"; // Replace with your actual device token

    const headers = new Headers({
      Authorization: deviceToken,
    });

    const requestOptions = {
      method: "GET",
      headers: headers,
    };

    return fetch(url, requestOptions)
      .then((response) => response.json())
      .then((json) => {
        const locationData = json.result.find(
          (item) => item.variable === "location"
        );
        if (locationData && locationData.value) {
          const coordinates = locationData.value
            .split(",")
            .map((coord) => parseFloat(coord.trim()));
          const [latitude, longitude] = coordinates;

          const speedData = json.result.find(
            (item) => item.variable === "speed"
          );
          const speed = speedData
            ? speedData.value
            : "Train 2 is currently not moving.";

          console.log("Latitude of Node 2:", latitude);
          console.log("Longitude of Node 2:", longitude);
          console.log("Speed of Node 2:", speed);
          return { latitude, longitude, speed };
        }
        return null;
      })
      .catch((error) => {
        console.error("Node 1 has a " + error);
      });
  };

  const Sensor1GetRequestFromTagIO = () => {
    const url = "https://api.tago.io/data?variable=location&variable=speed";
    const deviceToken = "7531c772-6dbe-469f-91ef-910cfb1e1a5f"; // Replace with your actual device token

    const headers = new Headers({
      Authorization: deviceToken,
    });

    const requestOptions = {
      method: "GET",
      headers: headers,
    };

    return fetch(url, requestOptions)
      .then((response) => response.json())
      .then((json) => {
        const locationData = json.result.find(
          (item) => item.variable === "location"
        );
        if (locationData && locationData.value) {
          const coordinates = locationData.value
            .split(",")
            .map((coord) => parseFloat(coord.trim()));
          const [latitude, longitude] = coordinates;

          const speedData = json.result.find(
            (item) => item.variable === "speed"
          );
          const speed = speedData
            ? speedData.value
            : "Train 1 is currently not moving.";

          console.log("Latitude of Node 1:", latitude);
          console.log("Longitude of Node 1:", longitude);
          console.log("Speed of Node 1:", speed);
          return { latitude, longitude, speed };
        }
        return null;
      })
      .catch((error) => {
        console.error("Node 1 has a " + error);
      });
  };

  const Sensor2GetRequestFromTagIO = () => {
    const url = "https://api.tago.io/data?variable=location&variable=speed";
    const deviceToken = "a7d29d89-6c1e-464e-b865-60f653b3bbee"; // Replace with your actual device token

    const headers = new Headers({
      Authorization: deviceToken,
    });

    const requestOptions = {
      method: "GET",
      headers: headers,
    };

    return fetch(url, requestOptions)
      .then((response) => response.json())
      .then((json) => {
        const locationData = json.result.find(
          (item) => item.variable === "location"
        );
        if (locationData && locationData.value) {
          const coordinates = locationData.value
            .split(",")
            .map((coord) => parseFloat(coord.trim()));
          const [latitude, longitude] = coordinates;

          const speedData = json.result.find(
            (item) => item.variable === "speed"
          );
          const speed = speedData
            ? speedData.value
            : "Train 2 is currently not moving.";

          // const rssiData = json.result.find(item => item.variable === 'rssi');
          // const rssi = rssiData ? rssiData.value : "RSSI data not available"; // Handle missing RSSI data

          // console.log("RSSI of Node 2: ", rssiData);
          console.log("Latitude of Node 2:", latitude);
          console.log("Longitude of Node 2:", longitude);
          console.log("Speed of Node 2:", speed);
          return { latitude, longitude, speed };
        }
        return null;
      })
      .catch((error) => {
        console.error("Node 2 has a " + error);
      });
  };

  const Sensor3GetRequestFromTagIO = () => {
    const url = "https://api.tago.io/data?variable=location&variable=speed";
    const deviceToken = "380e4ab4-dcf0-4acc-b818-f914a2656469";

    const headers = new Headers({
      Authorization: deviceToken,
    });

    const requestOptions = {
      method: "GET",
      headers: headers,
    };

    return fetch(url, requestOptions)
      .then((response) => response.json())
      .then((json) => {
        const locationData = json.result.find(
          (item) => item.variable === "location"
        );
        if (locationData && locationData.value) {
          const coordinates = locationData.value
            .split(",")
            .map((coord) => parseFloat(coord.trim()));
          const [latitude, longitude] = coordinates;

          const speedData = json.result.find(
            (item) => item.variable === "speed"
          );
          const speed = speedData ? speedData.value : "0 Speed";

          console.log("Latitude of Node 3:", latitude);
          console.log("Longitude of Node 3:", longitude);
          console.log("Speed of Node 3:", speed);
          return { latitude, longitude, speed };
        }
        return null;
      })
      .catch((error) => {
        console.error("Node 3 has a " + error);
      });
  };

  const Sensor4GetRequestFromTagIO = () => {
    const url = "https://api.tago.io/data?variable=location&variable=speed";
    const deviceToken = "05facda3-2867-4b85-94e5-f6dcbb0a5dd0";

    const headers = new Headers({
      Authorization: deviceToken,
    });

    const requestOptions = {
      method: "GET",
      headers: headers,
    };

    return fetch(url, requestOptions)
      .then((response) => response.json())
      .then((json) => {
        const locationData = json.result.find(
          (item) => item.variable === "location"
        );
        if (locationData && locationData.value) {
          const coordinates = locationData.value
            .split(",")
            .map((coord) => parseFloat(coord.trim()));
          const [latitude, longitude] = coordinates;

          const speedData = json.result.find(
            (item) => item.variable === "speed"
          );
          const speed = speedData
            ? speedData.value
            : "Train 4 is currently not moving.";
          console.log("Latitude of Node 4:", latitude);
          console.log("Longitude of Node 4:", longitude);
          console.log("Speed of Node 4:", speed);
          return { latitude, longitude, speed };
          ``;
        }
        return null;
      })
      .catch((error) => {
        console.error("Node 4 has a " + error);
      });
  };

  const calculateRegion = () => {
    const minLat = Math.min(
      ...stationCoordinates.map((coord) => coord.latitude)
    );
    const maxLat = Math.max(
      ...stationCoordinates.map((coord) => coord.latitude)
    );
    const minLng = Math.min(
      ...stationCoordinates.map((coord) => coord.longitude)
    );
    const maxLng = Math.max(
      ...stationCoordinates.map((coord) => coord.longitude)
    );

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    const latDelta = maxLat - minLat + 0.02;
    const lngDelta = maxLng - minLng + 0.02;

    return {
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: latDelta,
      longitudeDelta: lngDelta,
    };
  };

  const initialRegion = calculateRegion();

  const handleDestination = (station) => {
    setSelectedStation(station);

    let region;
    if (station === "Antipolo") {
      const antipoloCoord = stationCoordinates[0];
      const marikinaPasigCoord = stationCoordinates[1];

      const centerLat =
        (antipoloCoord.latitude + marikinaPasigCoord.latitude) / 2;
      const centerLng =
        (antipoloCoord.longitude + marikinaPasigCoord.longitude) / 2;
      const latDelta =
        Math.abs(antipoloCoord.latitude - marikinaPasigCoord.latitude) + 0.007;
      const lngDelta =
        Math.abs(antipoloCoord.longitude - marikinaPasigCoord.longitude) +
        0.007;

      region = {
        latitude: centerLat,
        longitude: centerLng,
        // latitudeDelta: latDelta,
        // longitudeDelta: lngDelta,
      };
    } else if (station === "Marikina") {
      const marikinaPasigCoord = stationCoordinates[1];
      region = {
        latitude: marikinaPasigCoord.latitude,
        longitude: marikinaPasigCoord.longitude,
        // latitudeDelta: 0.02,
        // longitudeDelta: 0.01,
      };
    } else if (station === "Santolan") {
      const santolanCoord = stationCoordinates[4];
      region = {
        latitude: santolanCoord.latitude,
        longitude: santolanCoord.longitude,
        // latitudeDelta: 0.036,
        // longitudeDelta: 0.0001,
      };
    }
    mapRef.current.animateToRegion(region, 500); // Adjust the duration as needed

    const etaText = getEtaTextForStation(
      selectedStation,
      stationCoordinates,
      trainDirection
    );
    console.log("Updated ETA:", etaText); // Log the updated ETA text
  };

  const getEtaTextForStation = (station, stationCoordinates) => {
    if (trainData.length > 0) {
      const etaTexts = trainData.map((train) => {
        // const trainCoordinates = { lat: train.latitude, lng: train.longitude };
        const stationObject = stationCoordinates.find((coord) => coord.name === station);

        if (!stationObject) {
          return `No station is currently being selected`;
        }

        // const stationCoords = { lat: stationObject.latitude, lng: stationObject.longitude };

        const distance = haversineDistanceFormula(train.latitude, stationObject.latitude, train.longitude, stationObject.longitude);
        if (train.speed !== 0) {
          const etaInMinutes = ((distance / ((train.speed * 3600) / 1000)) * 60).toFixed(2); // ETA in minutes
          let etaText;
          if (etaInMinutes < 1) { //Less than 1 minute (Seconds)
            const etaInSeconds = (etaInMinutes * 60).toFixed(0); // ETA in seconds
            const remainingSeconds = etaInSeconds % 60; // Remaining seconds
            etaText = `Train ${train.id} - ETA to ${station}:   ${remainingSeconds} seconds`;

          } else if (etaInMinutes >= 60) {
            const etaInHours = Math.floor(etaInMinutes / 60); // ETA in hours
            const remainingMinutes = (etaInMinutes % 60).toFixed(0); // Remaining minutes
            etaText = `Train ${train.id} - ETA to ${station}: ${etaInHours} hour and ${remainingMinutes} minutes`;
          } else {
            const etaMinutes = Math.floor(etaInMinutes);
            const etaInSeconds = (etaInMinutes * 60).toFixed(0); // ETA in seconds
            const remainingSeconds = etaInSeconds % 60; // Remaining seconds
            etaText = `Train ${train.id} - ETA to ${station}: ${etaMinutes} minutes and ${remainingSeconds} seconds`;
          }
          return etaText;
        } else {
          return `Train ${train.id} - ETA to ${station}: Train stopped.`; // Train not Moving
        }
      });
      return etaTexts.join('\n');
    } else {
      return 'No train data available.';
    }
  };


  const haversineDistanceFormula = (lat1, lat2, lon1, lon2) => {

    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.
    lon1 = lon1 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;

    // Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers. Use 3956
    // for miles
    let r = 6371;

    // calculate the result
    return (c * r);
  }

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  };

  const navigateToSchedulesPage = () => {
    if (selectedStation) {
      const etaText = getEtaTextForStation(
        selectedStation,
        stationCoordinates,
        trainDirection
      );
      navigation.navigate("SchedulesPage", {
        station: selectedStation,
        etaText,
      }); // Pass etaText to SchedulesPage
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={handleDoubleTap}>
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          region={initialRegion}
          zoomEnabled={true}
          scrollEnabled={true}
        >
          <Polyline
            coordinates={stationCoordinates}
            strokeColor="#9370DB" // Line color
            strokeWidth={5} // Line width
          />

          {trainData.map((train, index) => (
            <Marker
              key={train.id}
              coordinate={{
                latitude: train.latitude,
                longitude: train.longitude,
              }}
              title={`Train ${train.id}`}
              // description={`Speed: ${(train.speed * 3.6).toFixed(2)} km/h`}
              pinColor={
                trainDirection[index] === "Eastbound"
                  ? "blue"
                  : trainDirection[index] === "Westbound"
                  ? "red"
                  : "gray"
              }
            />
          ))}
          <Marker
            coordinate={stationCoordinates[0]}
            title="Antipolo Station"
            style={{ width: 50, height: 50 }}
          >
            <Image
              source={require("../../../assets/train-station.png")}
              style={{ width: 50, height: 50, resizeMode: "contain" }}
            />
          </Marker>

          <Marker
            coordinate={stationCoordinates[1]}
            title="Marikina-Pasig Station"
            style={{ width: 50, height: 50 }}
          >
            <Image
              source={require("../../../assets/train-station.png")}
              style={{ width: 50, height: 50, resizeMode: "contain" }}
            />
          </Marker>

          <Marker
            coordinate={stationCoordinates[4]}
            title="Santolan Station"
            style={{ width: 50, height: 50 }}
          >
            <Image
              source={require("../../../assets/train-station.png")}
              style={{ width: 50, height: 50, resizeMode: "contain" }}
            />
          </Marker>
        </MapView>
      </TouchableWithoutFeedback>
      <View
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          padding: 10,
          backgroundColor: "#9370DB",
          borderRadius: 10,
          borderWidth: 2,
          borderColor: "#fff",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 2,
          elevation: 3,
          alignItems: "flex-end", // Align text to the right
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", textAlign: "left" }}>
          {getEtaTextForStation(selectedStation, stationCoordinates, trainData)}
        </Text>
      </View>

      {selectedStation && (
        <View
          style={{
            position: "absolute",
            top: "10.5%",
            right: 10,
            padding: 10,
            backgroundColor: "#9370DB",
            borderRadius: 10,
            borderWidth: 2,
            borderColor: "#fff",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: 3,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={navigateToSchedulesPage}>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              View {selectedStation} Train Schedules{" "}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {showSchedules && <SchedulesPage selectedStation={selectedStation} />}

      {/* {trainData.length > 0 && (
        <View
          style={{
            position: "absolute",
            top: "15%",
            right: 10,
            padding: 10,
            backgroundColor: "#9370DB",
            borderRadius: 10,
            borderWidth: 2,
            borderColor: "#fff",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: 3,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            Train 1 (For Testing Purposes){"\n"}
            Latitude: {trainData[0].latitude}, {"\n"}
            Longitude: {trainData[0].longitude},{"\n"}
            Speed: {(trainData[0].speed * 3.6).toFixed(2)} km/h or{" "}
            {trainData[0].speed} m/s
          </Text>
        </View>
      )} */}

      {/* {trainData.length > 0 && (
        <View
          style={{
            position: "absolute",
            top: "45%",
            left: 0,
            padding: 10,
            backgroundColor: "#9370DB",
            borderRadius: 10,
            borderWidth: 2,
            borderColor: "#fff",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: 3,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            Train 2 (For Testing Purposes){"\n"}
            Latitude: {trainData[1].latitude}, {"\n"}
            Longitude: {trainData[1].longitude},{"\n"}
            Speed: {(trainData[1].speed * 3.6).toFixed(2)} km/h or{" "}
            {trainData[1].speed} m/s
          </Text>
        </View>
      )} */}
      <View
        style={{
          flexDirection: "column",
          paddingTop: 5,
          paddingRight: 10,
          paddingLeft: 10,
          paddingBottom: 15,
          marginTop: 5,
          marginBottom: 5,
          marginRight: 10,
          marginLeft: 10,
          justifyContent: "space-around",
          backgroundColor: "#CCCCFF",
          borderRadius: 10,
          borderWidth: 2,
          borderColor: "#9370DB",
          shadowColor: "#000",
          shadowOffset: { width: 1, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 2,
        }}
      >
        <Text style={styles.stationText}>Select your Station:</Text>
        <Button
          title="Santolan Station"
          onPress={() => handleDestination("Santolan")}
          color="#9370DB"
          style={styles.button}
        />
        <Button
          title="Marikina-Pasig Station"
          onPress={() => handleDestination("Marikina")}
          color="#9370DB"
          style={styles.button}
        />
        <Button
          title="Antipolo Station"
          onPress={() => handleDestination("Antipolo")}
          color="#9370DB"
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  stationTextContainer: {
    alignItems: "center",
  },
  stationText: {
    color: "#51414F",
    fontSize: 14,
    textShadowColor: "#000",
    textShadowRadius: 1,
    justifyContent: "center",
    marginBottom: 6,
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#9370DB",
    width: 200,
    height: 40,
    borderRadius: 20,
    marginBottom: 10,
  },
});
export default TrainPage;

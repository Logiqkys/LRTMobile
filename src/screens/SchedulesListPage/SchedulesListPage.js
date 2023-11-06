import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';

const SchedulesListPage = () => {
  const [trainData, setTrainData] = useState([]);
  const [organizeByTrains, setOrganizeByTrains] = useState(true);
  const [viewMode, setViewMode] = useState('trains'); // 'trains' or 'stations'

  // Define the GET request functions for each sensor
  const Sensor1GetRequestFromTagIO = () => {
    const url = 'https://api.tago.io/data?variable=location&variable=speed';
    const deviceToken = '7531c772-6dbe-469f-91ef-910cfb1e1a5f'; // Replace with your actual device token

    const headers = new Headers({
      'Authorization': deviceToken
    });

    const requestOptions = {
      method: 'GET',
      headers: headers,
    };

    return fetch(url, requestOptions)
      .then(response => response.json())
      .then(json => {
        const locationData = json.result.find(item => item.variable === 'location');
        if (locationData && locationData.value) {
          const coordinates = locationData.value.split(',').map(coord => parseFloat(coord.trim()));
          const [latitude, longitude] = coordinates;

          const speedData = json.result.find(item => item.variable === 'speed');
          const speed = speedData ? speedData.value : "Train 1 is currently not moving.";

          console.log("Latitude of Node 1:", latitude);
          console.log("Longitude of Node 1:", longitude);
          console.log("Speed of Node 1:", speed);
          return { latitude, longitude, speed };
        }
        return null;
      })
      .catch(error => {
        console.error("Node 1 has a " + error);
      });
  };



  const Sensor2GetRequestFromTagIO = () => {
    const url = 'https://api.tago.io/data?variable=location&variable=speed';
    const deviceToken = 'a7d29d89-6c1e-464e-b865-60f653b3bbee'; // Replace with your actual device token

    const headers = new Headers({
      'Authorization': deviceToken
    });

    const requestOptions = {
      method: 'GET',
      headers: headers,
    };

    return fetch(url, requestOptions)
      .then(response => response.json())
      .then(json => {
        const locationData = json.result.find(item => item.variable === 'location');
        if (locationData && locationData.value) {
          const coordinates = locationData.value.split(',').map(coord => parseFloat(coord.trim()));
          const [latitude, longitude] = coordinates;

          const speedData = json.result.find(item => item.variable === 'speed');
          const speed = speedData ? speedData.value : "Train 2 is currently not moving.";

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
      .catch(error => {
        console.error("Node 2 has a " + error);
      });
  };

  const Sensor3GetRequestFromTagIO = () => {
    const url = 'https://api.tago.io/data?variable=location&variable=speed';
    const deviceToken = '380e4ab4-dcf0-4acc-b818-f914a2656469';

    const headers = new Headers({
      'Authorization': deviceToken
    });

    const requestOptions = {
      method: 'GET',
      headers: headers,
    };

    return fetch(url, requestOptions)
      .then(response => response.json())
      .then(json => {
        const locationData = json.result.find(item => item.variable === 'location');
        if (locationData && locationData.value) {
          const coordinates = locationData.value.split(',').map(coord => parseFloat(coord.trim()));
          const [latitude, longitude] = coordinates;

          const speedData = json.result.find(item => item.variable === 'speed');
          const speed = speedData ? speedData.value : "0 Speed";

          console.log("Latitude of Node 3:", latitude);
          console.log("Longitude of Node 3:", longitude);
          console.log("Speed of Node 3:", speed);
          return { latitude, longitude, speed };
        }
        return null;
      })
      .catch(error => {
        console.error("Node 3 has a " + error);
      });
  };

  const Sensor4GetRequestFromTagIO = () => {
    const url = 'https://api.tago.io/data?variable=location&variable=speed';
    const deviceToken = '05facda3-2867-4b85-94e5-f6dcbb0a5dd0';

    const headers = new Headers({
      'Authorization': deviceToken
    });

    const requestOptions = {
      method: 'GET',
      headers: headers,
    };

    return fetch(url, requestOptions)
      .then(response => response.json())
      .then(json => {
        const locationData = json.result.find(item => item.variable === 'location');
        if (locationData && locationData.value) {
          const coordinates = locationData.value.split(',').map(coord => parseFloat(coord.trim()));
          const [latitude, longitude] = coordinates;

          const speedData = json.result.find(item => item.variable === 'speed');
          const speed = speedData ? speedData.value : "Train 4 is currently not moving.";
          console.log("Latitude of Node 4:", latitude);
          console.log("Longitude of Node 4:", longitude);
          console.log("Speed of Node 4:", speed);
          return { latitude, longitude, speed }; ``
        }
        return null;
      })
      .catch(error => {
        console.error("Node 4 has a " + error);
      });
  };

  // Function to render cards by trains
  const renderCardsByTrains = () => {
    return trainData.map((train) => (
      <View key={train.id} style={styles.card}>
        <View style={styles.cardHeader}>
          <Image source={require('../../../assets/clock.png')} style={styles.clockIcon} />
          <Text style={styles.cardTitle}>Train {train.id}</Text>
        </View>
        <Text style={styles.cardText}>Latitude: {train.latitude}</Text>
        <Text style={styles.cardText}>Longitude: {train.longitude}</Text>
        <Text style={styles.cardText}>Speed: {train.speed}</Text>
        <Text style={styles.cardText}>ETA to Antipolo: {calculateETA(train, antipoloStationCoordinates.latitude, antipoloStationCoordinates.longitude)}</Text>
        <Text style={styles.cardText}>ETA to Marikina-Pasig: {calculateETA(train, marikinaPasigStationCoordinates.latitude, marikinaPasigStationCoordinates.longitude)}</Text>
        <Text style={styles.cardText}>ETA to Santolan: {calculateETA(train, santolanStationCoordinates.latitude, santolanStationCoordinates.longitude)}</Text>
      </View>
    ));
  };


  // Function to render cards by stations
  const renderCardsByStations = () => {
    return (
      <View>
        <View style={styles.stationCard}>
          <Text style={styles.stationTitle}>ETA to Antipolo Station</Text>
          {trainData.map((train) => (
            <Text key={train.id} style={styles.stationTrain}>
              <Image source={require('../../../assets/clock.png')} style={styles.clockIcon} />
              Train {train.id}: {calculateETA(train, antipoloStationCoordinates.latitude, antipoloStationCoordinates.longitude)}
            </Text>
          ))}
        </View>
        <View style={styles.stationCard}>
          <Text style={styles.stationTitle}>ETA to Marikina-Pasig Station</Text>
          {trainData.map((train) => (

            <Text key={train.id} style={styles.stationTrain}>
              <Image source={require('../../../assets/clock.png')} style={styles.clockIcon} />
              Train {train.id}: {calculateETA(train, marikinaPasigStationCoordinates.latitude, marikinaPasigStationCoordinates.longitude)}
            </Text>
          ))}
        </View>
        <View style={styles.stationCard}>
          <Text style={styles.stationTitle}>ETA to Santolan Station</Text>
          {trainData.map((train) => (
            <Text key={train.id} style={styles.stationTrain}>
              <Image source={require('../../../assets/clock.png')} style={styles.clockIcon} />
              Train {train.id}: {calculateETA(train, santolanStationCoordinates.latitude, santolanStationCoordinates.longitude)}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  useEffect(() => {
    // Fetch data for all sensors when the component mounts
    fetchTrainData();

    // Set up an interval to fetch data every 2500 milliseconds (2.5 seconds)
    const updateInterval = 2500;
    const intervalId = setInterval(fetchTrainData, updateInterval);

    // Clear the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const fetchTrainData = () => {
    // Fetch data for all sensors when the component mounts
    Promise.all([
        PWXSensor1GetRequestFromTagIO(),
      PWXSensor2GetRequestFromTagIO(),
      // Sensor1GetRequestFromTagIO(),
      // Sensor2GetRequestFromTagIO(),
      // Sensor3GetRequestFromTagIO(),
      // Sensor4GetRequestFromTagIO(),
      // Call other sensor functions here
    ])
      .then((responses) => {
        const updatedTrainData = responses.map((response, index) => {
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
  // Function to calculate ETA for a given station
  const calculateETA = (train, stationLatitude, stationLongitude) => {
    if (train.speed !== 0) {
      const distance = haversineDistanceFormula(train.latitude, stationLatitude, train.longitude, stationLongitude);
      const etaInMinutes = ((distance / ((train.speed * 3600) / 1000)) * 60).toFixed(2); // ETA in minutes

      if (etaInMinutes < 1) {
        const etaInSeconds = (etaInMinutes * 60).toFixed(0); // ETA in seconds
        return `${etaInSeconds} seconds`;
      } else if (etaInMinutes >= 60) {
        const etaInHours = Math.floor(etaInMinutes / 60); // ETA in hours
        const remainingMinutes = (etaInMinutes % 60).toFixed(0); // Remaining minutes
        return `${etaInHours} hours and ${remainingMinutes} minutes`;
      } else {
        return `${etaInMinutes} minutes`;
      }
    } else {
      return 'Train stopped';
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
  // Example station coordinates (replace with actual coordinates)
  const antipoloStationCoordinates = { latitude: 14.6248, longitude: 121.1213 };
  const marikinaPasigStationCoordinates = { latitude: 14.62039, longitude: 121.10014 };
  const santolanStationCoordinates = { latitude: 14.62211, longitude: 121.08596 };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, viewMode === 'trains' && styles.activeButton]}
          onPress={() => setViewMode('trains')}
        >
          <Text style={styles.buttonText}>Organize by Train</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, viewMode === 'stations' && styles.activeButton]}
          onPress={() => setViewMode('stations')}
        >
          <Text style={styles.buttonText}>Organize by Station</Text>
        </TouchableOpacity>
      </View>

      {viewMode === 'trains' ? renderCardsByTrains() : renderCardsByStations()}

    </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  //Styles for card
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cardInfo: {
    fontSize: 14,
    marginBottom: 4,
  },
  clockIcon: {
    width: 20,
    height: 20,
    marginRight: 3,
  },
  // Styles for buttons container
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Center the buttons horizontally
    alignItems: 'center', // Center the buttons vertically
    marginHorizontal: 16,
    marginVertical: 12,
  },

  // Styles for buttons
  button: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#9370DB',
    borderRadius: 8,
    marginHorizontal: 4,
  },

  // Styles for active button
  activeButton: {
    backgroundColor: '#5c2fba',
  },

  // Styles for button text
  buttonText: {
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Styles for station cards
  stationCard: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  // Styles for station titles
  stationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333333',
  },

  // Styles for train ETAs
  stationTrain: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666666',
  },
});

export default SchedulesListPage;

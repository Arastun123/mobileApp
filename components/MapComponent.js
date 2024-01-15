import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const MapComponent = () => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [initialRegion, setInitialRegion] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);

    useEffect(() => {
        const getLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.log("Permission to access location was denied");
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setCurrentLocation(location.coords);

            setInitialRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            });
        };

        getLocation();
    }, []);

    const handleMapPress = (e) => {
        const { coordinate } = e.nativeEvent;
        setSelectedLocation(coordinate);
    };

    return (
        <View style={{ flex: 1 }}>
            {initialRegion && (
                <MapView
                    style={{ flex: 1 }}
                    initialRegion={initialRegion}
                    onPress={handleMapPress}
                >
                    {/* {currentLocation && (
                        <Marker
                            coordinate={{
                                latitude: currentLocation.latitude,
                                longitude: currentLocation.longitude,
                            }}
                            title="Your Location"
                        />
                    )} */}
                    {selectedLocation && (
                        <Marker
                            coordinate={selectedLocation}
                            title="Selected Location"
                        />
                    )}
                </MapView>
            )}
            {selectedLocation && (
                <View style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
                    <Text>Selected Location:</Text>
                    <Text>{`Latitude: ${selectedLocation.latitude.toFixed(6)}`}</Text>
                    <Text>{`Longitude: ${selectedLocation.longitude.toFixed(6)}`}</Text>

                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 100
    },
    map: {
        width: "100%",
        height: "100%",
    },
});

export default MapComponent;


// AIzaSyBXMByiyVxwbt2SKf4a-pnMaRhxxZ_uNSo
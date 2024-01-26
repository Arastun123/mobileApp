import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useFonts } from 'expo-font';

const MapComponent = ({ closeModal, onDataReceived }) => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [initialRegion, setInitialRegion] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [address, setAddress] = useState()
    let [fontsLoad] = useFonts({ 'Medium': require('../assets/fonts/static/Montserrat-Medium.ttf') })
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

    const findAddress = async () => {
        if (!selectedLocation) {
            // console.error("Selected location is null");
            return;
        }
    
        let latitude = selectedLocation.latitude;
        let longitude = selectedLocation.longitude;
    
        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
    
            const addressComponents = response.data.address || {};
            const formattedAddress = `${addressComponents.road || ''} ${addressComponents.house_number || ''}`;
    
            setAddress(formattedAddress);
            return formattedAddress.trim();
        } catch (error) {
            console.error(error.message);
        }
    }
    
    findAddress()
    const handleMapPress = (e) => {
        const { coordinate } = e.nativeEvent;
        setSelectedLocation(coordinate);
    };

    const sendDataToParent = () => {
        onDataReceived(address);
        closeModal();
    }

    

    return (
        <View style={{ flex: 1 }}>
            <View style={{ padding: 5 }}>
                <Text style={ {textAlign: 'right' }} onPress={closeModal} ><Ionicons name="close" size={24} color="red" /></Text>
            </View>
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
                    {/* <Text>{`Latitude: ${selectedLocation.latitude.toFixed(6)}`}</Text> */}
                    <Text>{address}</Text>
                    <Pressable style={{ ...styles.button, width: 150 }} onPress={sendDataToParent}>
                        <Text style={styles.text}>Save Location</Text>
                    </Pressable>
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
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderRadius: 4,
        backgroundColor: '#3498db',
        height: 40,
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
        fontFamily: 'Medium'
    },
});

export default MapComponent;


// AIzaSyBXMByiyVxwbt2SKf4a-pnMaRhxxZ_uNSo
import { StyleSheet, View, Dimensions, } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { useEffect, useState } from "react";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Map = () => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [initialRegion, setInitialRegion] = useState(null);

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

    return (
        <View style={styles.container}>
            {initialRegion && (
                <MapView style={styles.map} initialRegion={initialRegion}>
                    {currentLocation && (
                        <Marker
                            coordinate={{
                                latitude: currentLocation.latitude,
                                longitude: currentLocation.longitude,
                            }}
                            title="Your Location"
                        />
                    )}
                </MapView>
            )}
            {/* <Text> {JSON.stringify({ initialRegion }, null, 4)} </Text> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 20
    },
    map: {
        width: "100%",
        height: 300,
    },
});

export default Map;
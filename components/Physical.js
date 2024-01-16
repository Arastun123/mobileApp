import React, { useState } from "react";
import { ScrollView, View, StyleSheet, Pressable, Modal } from "react-native";
import Text from "@kaloraat/react-native-text"
import UserInput from "./auth/UserInput";
import { Ionicons } from '@expo/vector-icons';
import MapComponent from "./MapComponent";
import axios from "axios";

const Physical = ({selectedLocation}) => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [voen, setVoen] = useState("");
    const [isModalVisible, setModalVisible] = useState(false);
    const [receivedData, setReceivedData] = useState(null);

    const handlePress = () => {
        setModalVisible(true)
    }

    const closeModal = () => {
        setModalVisible(false)
    }
    const onDataReceived = (data) => { setReceivedData(data) }
    const findAddress = async () => {
        let latitude = receivedData.latitude;
        let longitude = receivedData.longitude
        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );

            const addressComponents = response.data.address || {};
            const formattedAddress = `${addressComponents.road || ''} ${addressComponents.house_number || ''}`;

            setAddress(formattedAddress)
            return formattedAddress.trim();
        } catch (error) {
            console.error(error.message);
        }
    };
    findAddress()
    return (

        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical: 35, marginVertical: 20, marginHorizontal: 10 }}>
            <Text center title style={{ marginBottom: 10 }}>Fiziki şəxs</Text>
            <View style={{ marginVertical: 10 }}>
                <UserInput
                    name="S.A.A"
                    value={name}
                    setValue={setName}
                    autoCompleteType="text"
                    keyboardType="text"
                />
                <UserInput
                    name="Əlaqə nömrəsi"
                    value={phone}
                    setValue={setPhone}
                    autoCompleteType="numeric"
                    keyboardType="numeric"
                />
                <UserInput
                    name="Vöen"
                    value={voen}
                    setValue={setVoen}
                    autoCompleteType="text"
                    keyboardType="text"
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ width: 250 }}>
                        <UserInput
                            name="Ünvan"
                            value={address}
                            setValue={setAddress}
                            autoCompleteType="text"
                            keyboardType="text"
                            onChangeText={(text => (setAddress(text)))}
                        />
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Pressable style={{ ...styles.button, width: 40 }} onPress={handlePress}>
                            <Text style={styles.text}><Ionicons name="location" size={16} color="white" /></Text>
                        </Pressable>
                    </View>
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={closeModal}
                >
                    <MapComponent closeModal={closeModal} onDataReceived={onDataReceived} />
                </Modal>
                <Text>{JSON.stringify({ name, phone, address, voen }, null, 4)}</Text>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 4,
        backgroundColor: '#3498db',
        marginHorizontal: 10,
        height: 40,

    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
});


export default Physical;
import React, { useState } from "react";
import { ScrollView, View, StyleSheet, Pressable, Modal, Text, Alert } from "react-native";
import UserInput from "./UserInput";
import { Ionicons } from '@expo/vector-icons';
import MapComponent from "./MapComponent";
import { useFonts } from "expo-font";
import { sendRequest } from '../services/Server';


const Physical = () => {
    let [fontsLoad] = useFonts({ 'Medium': require('../assets/fonts/static/Montserrat-Medium.ttf') });
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [tin, setTin] = useState("");
    const [isModalVisible, setModalVisible] = useState(false);

    if (!fontsLoad) { return null }
    const handlePress = () => { setModalVisible(true) }
    const closeModal = () => { setModalVisible(false) }
    const onDataReceived = (data) => { setAddress(data) }

    const sendData = async () => {
        let apiUrl = '/kontragent';
        
        if (
            !name ||
            !phone ||
            !tin ||
            !address 
        ) {
            Alert.alert('Məlumatları daxil edin!');
            return;
        }

        const postData = {
            name: name,
            phone_number: phone,
            tin: tin,
            address: address,
            type: 'Fiziki'
        };
        const result = await sendRequest(apiUrl, postData);

        if (result.success) {
            Alert.alert(result.message);
        } else {
            Alert.alert(result.message);
        }
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical: 35, marginVertical: 20, marginHorizontal: 10 }}>
            <Text style={{ marginBottom: 10, textAlign: 'center', fontSize: 32 }}>Fiziki şəxs</Text>
            <View style={{ marginVertical: 10 }}>
                <UserInput
                    name="S.A.A"
                    value={name}
                    setValue={setName}
                    autoCompleteType="text"
                    onChangeText={(text) => setName(text)}
                />
                <UserInput
                    name="Əlaqə nömrəsi"
                    value={phone}
                    setValue={setPhone}
                    autoCompleteType="numeric"
                    keyboardType="numeric"
                    onChangeText={(text) => setPhone(text)}
                />
                <UserInput
                    name="Vöen"
                    value={tin}
                    setValue={setTin}
                    autoCompleteType="text"
                    onChangeText={(text) => setTin(text)}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ width: 250 }}>
                        <UserInput
                            name="Ünvan"
                            value={address}
                            setValue={setAddress}
                            autoCompleteType="text"
                            onChangeText={(text => (setAddress(text)))}
                        />
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Pressable style={{ width: 60 }} onPress={handlePress}>
                            <Text><Ionicons name="location" size={32} color="#333" /></Text>
                        </Pressable>
                    </View>
                </View>
                <View>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={isModalVisible}
                        onRequestClose={closeModal}
                    >
                        <MapComponent closeModal={closeModal} onDataReceived={onDataReceived} />

                    </Modal>
                </View>
                {/* <Text>{JSON.stringify({ name, phone, address, voen }, null, 4)}</Text> */}
                <View style={{ alignItems: 'flex-end', margin: 10 }}>
                    <Pressable style={{ ...styles.button, width: 150 }} onPress={sendData}>
                        <Text style={styles.text}>Təsdiq et</Text>
                    </Pressable>
                </View>
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
        backgroundColor: 'green',
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


export default Physical;
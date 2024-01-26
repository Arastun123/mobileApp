import React, { useState } from "react";
import { ScrollView, View, StyleSheet, Pressable, Modal, Text, Alert } from "react-native";
import UserInput from "./UserInput";
import { Ionicons } from '@expo/vector-icons';
import MapComponent from "./MapComponent";
import { useFonts } from "expo-font";


const Legal = ({ selectedLocation }) => {
    let [fontsLoad] = useFonts({'Medium': require('../assets/fonts/static/Montserrat-Medium.ttf') });    
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [tin, setTin] = useState("");
    const [isModalVisible, setModalVisible] = useState(false);
    
    if (!fontsLoad) {  return null }
    const handlePress = () => { setModalVisible(true) }
    const closeModal = () => { setModalVisible(false) }
    const onDataReceived = (data) => { setAddress(data) }

    const sendData = async () => {
        const apiUrl = 'http://192.168.88.41:3000/api/kontragent';
        try {
            const postData = {
                name: name,
                phone_number: phone,
                tin: tin,
                address: address,
            };
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (response.status === 200) Alert.alert('Məlumatlar göndərildi!');
            else Alert.alert('Uğursuz cəht!');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical: 35, marginVertical: 20, marginHorizontal: 10 }}>
            <Text style={{ marginBottom: 10, textAlign: 'center', fontSize: 32 }}>Hüquqi şəxs</Text>
            <View style={{ marginVertical: 10 }}>
                <UserInput
                    name="S.A.A"
                    value={name}
                    setValue={setName}
                    autoCompleteType="text"
                    keyboardType="text"
                    onChangeText = {(text) => setName(text)}
                />
                <UserInput
                    name="Əlaqə nömrəsi"
                    value={phone}
                    setValue={setPhone}
                    autoCompleteType="numeric"
                    keyboardType="numeric"
                    onChangeText = {(text) => setPhone(text)}
                />
                <UserInput
                    name="Vöen"
                    value={tin}
                    setValue={setTin}
                    autoCompleteType="text"
                    keyboardType="text"
                    onChangeText = {(text) => setTin(text)}
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
                        <Pressable style={{ width: 60 }} onPress={handlePress}>
                            <Text><Ionicons name="location" size={32} color="#333" /></Text>
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


export default Legal;
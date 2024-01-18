import axios from "axios";
import UserInput from "./UserInput";
import React, { useState } from "react";
import MapComponent from "./MapComponent";
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, ScrollView, Pressable, Modal, Text } from "react-native";
import { useFonts } from "expo-font";


const Legal = () => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [voen, setVoen] = useState("");
    const [isModalVisible, setModalVisible] = useState(false);

    const handlePress = () => { setModalVisible(true) }
    const closeModal = () => { setModalVisible(false) }
    const onDataReceived = (data) => { setAddress(data) }

    let [fontsLoad] = useFonts({
        'Medium': require('../assets/fonts/static/Montserrat-Medium.ttf')
    })
    
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
                        // editable={false}
                        />
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Pressable style={{ width: 60 }} onPress={handlePress}>
                            <Text><Ionicons name="location" size={32} color="#333" /></Text>
                        </Pressable>
                    </View>
                </View>
                {/* <Text>{JSON.stringify({ name, phone, address, voen }, null, 4)}</Text> */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={closeModal}
                >
                    <MapComponent closeModal={closeModal} onDataReceived={onDataReceived} />
                </Modal>
            </View>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
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
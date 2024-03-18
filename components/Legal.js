import React, { useState, useRef } from "react";
import { ScrollView, View, StyleSheet, Pressable, Modal, Text, Alert, TextInput } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import MapComponent from "./MapComponent";
import { useFonts } from "expo-font";
import { sendRequest } from '../services/Server';


const Legal = ({ selectedLocation }) => {
    let [fontsLoad] = useFonts({ 'Medium': require('../assets/fonts/static/Montserrat-Medium.ttf') });
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [tin, setTin] = useState("");
    const [isModalVisible, setModalVisible] = useState(false);
    const inputRefs = useRef([]);

    
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
            type: 'Hüquqi'
        };
        const result = await sendRequest(apiUrl, postData);

        if (result.success) {
            Alert.alert(result.message);
        } else {
            Alert.alert(result.message);
        }
    }

    const focusInputRefs = (index) => {
        const nextIndex = index + 1;
        if (inputRefs.current[nextIndex]) {
            inputRefs.current[nextIndex].focus();
        }
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical: 35, marginVertical: 20, marginHorizontal: 10 }}>
            <Text style={{ marginBottom: 10, textAlign: 'center', fontSize: 32 }}>Hüquqi şəxs</Text>
            <View style={{ marginVertical: 10 }}>
                <TextInput
                    placeholder="S.A.A"
                    value = {name}
                    onChangeText={(text) => setName(text)}
                    style = {styles.input}
                    ref={(ref) => (inputRefs.current[1] = ref)}
                    onSubmitEditing={() => focusInputRefs(1)}
                />
                <TextInput
                    placeholder="Əlaqə nömrəsi"
                    value={phone}
                    keyboardType="numeric"
                    onChangeText={(text) => setPhone(text)}
                    style = {styles.input}
                    ref={(ref) => (inputRefs.current[2] = ref)}
                    onSubmitEditing={() => focusInputRefs(2)}
                />
                <TextInput
                    placeholder="Vöen"
                    value={tin}
                    onChangeText={(text) => setTin(text)}
                    style = {styles.input}
                    ref={(ref) => (inputRefs.current[3] = ref)}
                    onSubmitEditing={() => focusInputRefs(3)}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ width: 250 }}>
                        <TextInput
                            placeholder="Ünvan"
                            value={address}
                            onChangeText={(text => (setAddress(text)))}
                            style = {styles.input}
                            ref={(ref) => (inputRefs.current[4] = ref)}
                            onSubmitEditing={() => focusInputRefs(4)}
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
    input: {
        margin: 10,
        borderBottomWidth: 0.5,
        height: 48,
        borderBottomColor: '#8e93a1',
    },
});


export default Legal;
import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Pressable, Modal, LocationPicker } from "react-native";
import Text from "@kaloraat/react-native-text"
import UserInput from "./auth/UserInput";
import { Ionicons } from '@expo/vector-icons';
import MapComponent from "./MapComponent";


const Legal = () => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [voen, setVoen] = useState("");
    const [isModalVisible, setModalVisible] = useState(false);
    const [receivedData, setReceivedData] = useState(null);

    const handlePress = () => { setModalVisible(true) }

    const closeModal = () => { setModalVisible(false) }

    const onDataReceived = (data) => { setReceivedData(data) }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical: 35, marginVertical: 20, marginHorizontal: 10 }}>
            <Text center title style={{ marginBottom: 10 }}>Hüquqi şəxs</Text>
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
                            value={JSON.stringify(receivedData)}
                            setValue={setAddress}
                            autoCompleteType="text"
                            keyboardType="text"
                            onChangeText={(text => (setReceivedData(text)))}
                            editable={false}
                        />
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Pressable style={{ ...styles.button, width: 40 }} onPress={handlePress}>
                            <Text style={styles.text}><Ionicons name="location" size={16} color="white" /></Text>
                        </Pressable>
                    </View>
                </View>
                <Text>{JSON.stringify({
                    name, phone, address,
                    voen
                }, null, 4)}</Text>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={closeModal}
                >
                    <MapComponent closeModal={closeModal} onDataReceived={onDataReceived} />
                </Modal>
                {console.log(receivedData)}
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

export default Legal;
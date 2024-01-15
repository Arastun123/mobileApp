import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Text from "@kaloraat/react-native-text"
import UserInput from "./auth/UserInput";

const Legal = () => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [voen, setVoen] = useState("");

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
                <UserInput
                    name="Ünvan"
                    value={address}
                    setValue={setAddress}
                    autoCompleteType="text"
                    keyboardType="text"
                />
            </View>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    input: {
        margin: 10,
        borderBottomWidth: 0.5,
        height: 48,
        borderBottomColor: '#8e93a1',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 4,
        backgroundColor: '#3498db',
        marginHorizontal: 10,
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
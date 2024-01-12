import React, { useState } from "react";
import { ScrollView, View, StyleSheet, Pressable } from "react-native";
import Text from "@kaloraat/react-native-text"
import UserInput from "../components/auth/UserInput";
import Table from "../components/Table";


const Kontragent = () => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [voen, setVoen] = useState("");
    const headers = ["№", "Tarix", "Növ"];
    const data = ["1", "09.01.24", "Satış"];

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical: 35, marginVertical: 20, marginHorizontal: 10 }}>
            <Text center title style={{ marginBottom: 10 }}>Kontragent</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
                <Pressable style={{ ...styles.button, width: 150 }} >
                    <Text style={styles.text}>Fiziki şəxs</Text>
                </Pressable>

                <Pressable style={{ ...styles.button, width: 150 }} >
                    <Text style={styles.text}>Hüquqi şəxs</Text>
                </Pressable>
            </View>
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
                <Text center title style={{ marginBottom: 10 }}>Müqavilələr</Text>
                <Table data={data} headers={headers}/>
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

export default Kontragent;
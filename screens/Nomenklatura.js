import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Pressable } from "react-native";
import Text from "@kaloraat/react-native-text"
import UserInput from "../components/auth/UserInput";


const Nomenklatura = () => {
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [catgeory, setCategory] = useState("");
    const [brand, setBrand] = useState("");
    const [price, setPrice] = useState("");

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical: 35, marginVertical: 20, marginHorizontal: 10 }}>
            <Text center title style={{ marginBottom: 10 }}> Nomenklatura </Text>
            <View style={{ marginVertical: 10 }}>
                <UserInput
                    name="Ad"
                    value={name}
                    setValue={setName}
                    autoCompleteType="text"
                    keyboardType="text"
                />
                <UserInput
                    name="Növ"
                    value={type}
                    setValue={setType}
                    autoCompleteType="text"
                    keyboardType="text"
                />
                <UserInput
                    name="Kateqoriya"
                    value={catgeory}
                    setValue={setCategory}
                    autoCompleteType="text"
                    keyboardType="text"
                />
                <UserInput
                    name="Brend"
                    value={brand}
                    setValue={setBrand}
                    autoCompleteType="text"
                    keyboardType="text"
                />
                <UserInput
                    name="Qiymət"
                    value={price}
                    setValue={setPrice}
                    autoCompleteType="numeric"
                    keyboardType="numeric"
                />
                <Text>
                    {JSON.stringify({ name, type, catgeory, brand, price }, null, 4)}
                </Text>
            </View>
            <View style={{ margin: 10 }}>
                <Pressable style={{ ...styles.button, width: 150 }} >
                    <Text style={styles.text}>Təsdiq et</Text>
                </Pressable>
            </View>
            <View style={styles.table}>

                <View style={styles.row}>
                    <View style={styles.cell}>
                        <Text center>Qalıqlar</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.cell} >
                        <Text center>Baş anbar</Text>
                    </View>
                    <View style={styles.cell} >
                        <Text center>3</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.cell}>
                        <Text center>Anbar</Text>
                    </View>
                    <View style={styles.cell}>
                        <Text center>5</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    table: {
        borderWidth: 1,
        borderColor: '#ddd',
        margin: 5,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    cell: {
        flex: 1,
        padding: 5,
        borderRightWidth: 1,
        borderColor: '#ddd',
    },
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
    },
});

export default Nomenklatura;
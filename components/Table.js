import React, { useState, useRef } from "react";
import { View, StyleSheet, Pressable, TextInput, Text } from "react-native";
import { useFonts } from "expo-font";

const Table = ({ headers, data }) => {
    let [fontsLoad] = useFonts({ 'Medium': require('../assets/fonts/static/Montserrat-Medium.ttf') });
    const [rows, setRows] = useState([]);
    const [inputData, setData] = useState([]);

    if (!fontsLoad) { return null }
    const numColumns = 5;

    const addRow = () => {
        const newRow = Array(headers.length).fill('');
        setRows((prevRows) => [...prevRows, newRow]);
    };

    const handleInputChange = (rowIndex, header, value) => {
        const key = `${header}`;
        setData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
    }

    return (
        <View>
            <View style={{ flex: 1, justifyContent: 'end', marginVertical: 20, marginHorizontal: 10 }}>
                <View >
                    <Pressable style={{ ...styles.button, width: 50 }} onPress={addRow}>
                        <Text style={styles.text}>+</Text>
                    </Pressable>
                </View>
            </View>
            <View style={styles.table}>

                <View style={styles.row}>
                    {headers.map((header, index) => (
                        <View style={styles.cell} key={index}>
                            <Text style={styles.cellText}>{header}</Text>
                        </View>
                    ))}
                </View>
                {data.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.row}>
                        {row.map((cell, cellIndex) => (
                            <View style={styles.cell} key={cellIndex}>
                                <Text style={styles.cellText}>{cell}</Text>
                            </View>
                        ))}
                    </View>
                ))}
                {rows.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.row}>
                        {row.map((cell, cellIndex) => (
                            <View style={styles.cell} key={cellIndex}>
                                <TextInput
                                    placeholder={String(headers[cellIndex])}
                                    onChangeText={(text) => handleInputChange(rowIndex, headers[cellIndex], text)}
                                    value={inputData[`${rowIndex}_${headers[cellIndex]}`]}
                                    style={{ textAlign: 'center' }}
                                    keyboardType={String(headers[cellIndex]) == "Məbləğ" | "Miqdar" ? 'numeric' : 'text'}
                                />
                            </View>
                        ))}
                    </View>
                ))}
            </View>
            {/* <View style={{ alignItems: 'flex-end', margin: 10 }}>
                <Pressable style={{ ...styles.button, width: 150 }} onPress={handleInputChange}>
                    <Text style={styles.text}>Təsdiq et</Text>
                </Pressable>
            </View> */}
            {/* <Text> {JSON.stringify({ inputData }, null, 4)} </Text> */}
        </View>
    );
}

export default Table;

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
    cellText: {
        textAlign: 'center',
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
        fontFamily: 'Medium'
    },
});
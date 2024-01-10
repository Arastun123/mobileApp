import React, { useState } from "react";
import { View, StyleSheet, Pressable, } from "react-native";
import Text from "@kaloraat/react-native-text"

const Table = ({ headers, data }) => {
    const numColumns = 5;
    const [rows, setRows] = useState([]);


    const addRow = () => {
        const newRow = Array(headers.length).fill('');
        setRows((prevRows) => [...prevRows, newRow]);
    };

    return (
        <View>
            <View style={{ flex: 1, justifyContent: 'end', marginVertical: 20, marginHorizontal: 10 }}>
                <View >
                    <Pressable style={styles.button} onPress={addRow}>
                        <Text style={styles.text}>+</Text>
                    </Pressable>
                </View>
            </View>
            <View style={styles.table}>

                <View style={styles.row}>
                    {headers.map((header) => (
                        <View style={styles.cell}>
                            <Text style={styles.cellText}>{header}</Text>
                        </View>
                    ))}
                </View>
                <View style={styles.row}>
                    {data.map((cellData, cellIndex) => (
                        <View style={styles.cell} key={cellIndex}>
                            <Text style={styles.cellText}>{cellData}</Text>
                        </View>
                    ))}
                </View>
                {rows.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.row}>
                        {row.map((cell, cellIndex) => (
                            <Text key={cellIndex} style={styles.cell}>
                                {cell}
                            </Text>
                        ))}
                    </View>
                ))}
            </View>
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
        width: 50,
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
});
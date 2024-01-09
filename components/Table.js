import React from "react";
import { View, StyleSheet,  } from "react-native";
import Text from "@kaloraat/react-native-text"

const Table = ({ headers, data }) => {
    const numColumns = 5;

    return (
        <View style={styles.table}>
            <View style={styles.row}>
                {headers.map((header) => (
                    <View style={styles.cell}>
                        <Text style={styles.cellText}>{header}</Text>
                    </View>
                ))}
            </View>

            <View>
                {[...Array(Math.ceil(data.length / numColumns)).keys()].map((rowIndex) => (
                    <View style={styles.row} key={rowIndex}>
                        {data.slice(rowIndex * numColumns, (rowIndex + 1) * numColumns).map((cellData, cellIndex) => (
                            <View style={styles.cell} key={cellIndex}>
                                <Text style={styles.cellText}>{cellData}</Text>
                            </View>
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
});
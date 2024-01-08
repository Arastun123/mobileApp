import React from "react";
import { View, StyleSheet, ScrollView } from 'react-native';
import Text from "@kaloraat/react-native-text"
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();

const Orders = ({ navigation }) => {
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', marginTop: 20 }}>
            <View>
                <Text title center> Sifarişlər </Text>
                <View style={styles.table}>
                    <View style={styles.row}>
                        <View style={styles.cell}>
                            <Text style={styles.cellText}>№</Text>
                        </View>
                        <View style={styles.cell}>
                            <Text style={styles.cellText}>Tarix</Text>
                        </View>
                        <View style={styles.cell}>
                            <Text style={styles.cellText}>Müştəri</Text>
                        </View>
                        <View style={styles.cell}>
                            <Text style={styles.cellText}>Məbləğ</Text>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.cell}>
                            <Text style={styles.cellText}>1</Text>
                        </View>
                        <View style={styles.cell}>
                            <Text style={styles.cellText}>28.12.23</Text>
                        </View>
                        <View style={styles.cell}>
                            <Text style={styles.cellText}>User</Text>
                        </View>
                        <View style={styles.cell}>
                            <Text style={styles.cellText}>2000</Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView >
    )

}
const styles = StyleSheet.create({
    table: {
        borderWidth: 1,
        borderColor: '#ddd',
        margin: 10,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    cell: {
        flex: 1,
        padding: 10,
    },
    cellText: {
        textAlign: 'center',
    },
});
export default Orders;
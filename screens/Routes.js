import React from "react";
import { View, StyleSheet, ScrollView } from 'react-native';
import Text from "@kaloraat/react-native-text"
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Table from "../components/Table";


const Stack = createNativeStackNavigator();

const Routes = ({ navigation }) => {
    const headers = ["№", "Tarix", "Ünvan", "Müştəri"];
    const data = ["1", "09.01.24", "Baku", "Me"];
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', marginTop: 20 }}>
            <View>
                <Text title center> Marşurutlar </Text>
                <Table headers={headers} data={data}/>
            </View>
        </ScrollView >
    )

}
export default Routes;
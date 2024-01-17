import React from "react";
import { View, ScrollView } from 'react-native';
import Text from "@kaloraat/react-native-text"
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Table from "../components/Table";


const Stack = createNativeStackNavigator();

const Orders = ({ navigation }) => {
    const headers = ["№", "Tarix", "Müştəri", "Məbləğ"];
    const data = ["1", "09.01.24", "Me", "2000"];
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', marginTop: 20 }}>
            <Text title center> Sifarişlər </Text>
            <Table headers={headers} data={data}/>
        </ScrollView >
    )

}

export default Orders;
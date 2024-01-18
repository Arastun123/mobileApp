import React from "react";
import { View, ScrollView, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Table from "../components/Table";
import { useFonts } from "expo-font";


const Stack = createNativeStackNavigator();

const Orders = ({ navigation }) => {
    const headers = ["№", "Tarix", "Müştəri", "Məbləğ"];
    const data = ["1", "09.01.24", "Me", "2000"];
    
    let [fontsLoad] = useFonts({
        'Medium': require('../assets/fonts/static/Montserrat-Medium.ttf')
    })

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', marginTop: 20 }}>
            <Text style={{ textAlign: 'center', fontFamily: 'Medium', fontSize: 32}}> Sifarişlər </Text>
            <Table headers={headers} data={data}/>
        </ScrollView >
    )

}

export default Orders;
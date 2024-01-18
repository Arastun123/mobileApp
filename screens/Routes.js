import React from "react";
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Table from "../components/Table";
import { useFonts } from "expo-font";


const Stack = createNativeStackNavigator();

const Routes = ({ navigation }) => {
    const headers = ["№", "Tarix", "Ünvan", "Müştəri"];
    const data = ["1", "09.01.24", "Baku", "Me"];

    let [fontsLoad] = useFonts({
        'Medium': require('../assets/fonts/static/Montserrat-Medium.ttf')
    })

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', marginTop: 20 }}>
            <Text style={{ textAlign: 'center', fontFamily: 'Medium', fontSize: 32}}> Marşurutlar </Text>
            <Table headers={headers} data={data} />
        </ScrollView >
    )

}
export default Routes;
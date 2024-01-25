import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Table from "../components/Table";
import { useFonts } from "expo-font";
import { fetchData } from '../services/Server';

const Stack = createNativeStackNavigator();

const Routes = ({ navigation }) => {
    const [resData, setData] = useState([]);
    let [fontsLoad] = useFonts({'Medium': require('../assets/fonts/static/Montserrat-Medium.ttf') });
    
    useEffect(() => {
        const fetchDataAsync = async () => {
            try {
                const result = await fetchData('routes');
                if (result !== null) {
                    setData(result);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchDataAsync();
    }, []);

    const extractedData = resData.map((item) => [String(item.id), item.address, item.date]);

    const headers = ["№", "Tarix", "Ünvan"];

    if (!fontsLoad) {  return null }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', marginTop: 20 }}>
            <Text style={{ textAlign: 'center', fontFamily: 'Medium', fontSize: 32}}> Marşurutlar </Text>
            <Table  data={extractedData}  headers={headers}/>
        </ScrollView>
    )

}
export default Routes;
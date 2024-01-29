import React, { useEffect, useState } from "react";
import { View, ScrollView, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Table from "../components/Table";
import { useFonts } from "expo-font";
import { fetchData } from '../services/Server';


const Stack = createNativeStackNavigator();

const Orders = ({ navigation }) => {
    const [resData, setData] = useState([]);
    let [fontsLoad] = useFonts({'Medium': require('../assets/fonts/static/Montserrat-Medium.ttf') });
    const headers = ["№", "Tarix", "Məbləğ"];
    // const data = ["1", "09.01.24", "2000"];

    useEffect(() => {
        const fetchDataAsync = async () => {
            try {
                const result = await fetchData('orders');
                if (result !== null) { setData(result) }
            } catch (error) {  
                console.error(error);
            }
        };

        fetchDataAsync();
    }, []);

    const extractedData = resData.map((item) => [String(item.id), item.date, item.amount]);

    if (!fontsLoad) {  return null }

    const sendData = async () => {
        const apiUrl = 'http://192.168.88.41:3000/api/orders';
        try {
            const postData = {
                date: formatDateString(date),
                amount: amount,
            };
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (response.status === 200) Alert.alert('Məlumatlar göndərildi!');
            else Alert.alert('Uğursuz cəht!');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', marginTop: 20 }}>
            <Text style={{ textAlign: 'center', fontFamily: 'Medium', fontSize: 32}}> Sifarişlər </Text>
            <Table headers={headers} data={extractedData}/>
        </ScrollView >
    )

}

export default Orders;
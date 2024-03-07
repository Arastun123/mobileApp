import React, { useEffect, useState } from "react";
import { ScrollView, Text } from "react-native";
import Table from "../components/Table";
import { useFonts } from "expo-font";
import { fetchData } from "../services/Server";

const CassaOrders = () => {
    const [resData, setData] = useState([]);
    let [fontsLoad] = useFonts({ 'Medium': require('../assets/fonts/static/Montserrat-Medium.ttf') });

    useEffect(() => {
        const fetchDataAsync = async () => {
            try {
                const result = await fetchData('casse_orders','true');
                if (result !== null) {
                    setData(result)
                }
            } catch (error) {
                console.error(error)
            }
        }
        fetchDataAsync();
    }, []);

    const headers = ["№", "Tarix", "Məbləğ"]
    let extractedData = resData.map((item) => [String(item.id), item.date, item.amount]);

    if (!fontsLoad) { return null }

    const sendData = async () => {
        const apiUrl = 'http://192.168.88.11:3000/api/cassa_orders';
        try {
            const postData = {
                date: formatDateString(date),
                kontragentId: kontragentId,
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
            fetchDataAsync();
            
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical: 25 }}>
            <Text style={{ textAlign: 'center', fontFamily: 'Medium', fontSize: 32 }}> Kassa Orderləri </Text>
            <Table headers={headers} data={extractedData} />
        </ScrollView>
    )
}

export default CassaOrders;
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
                const result = await fetchData('casse_orders');
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

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical: 25 }}>
            <Text style={{ textAlign: 'center', fontFamily: 'Medium', fontSize: 32 }}> Kassa Orderləri </Text>
            <Table headers={headers} data={extractedData} />
        </ScrollView>
    )
}

export default CassaOrders;
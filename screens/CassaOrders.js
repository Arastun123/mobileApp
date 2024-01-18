import React from "react";
import { ScrollView, Text } from "react-native";
import Table from "../components/Table";
import { useFonts } from "expo-font";

const CassaOrders = () => {
    const headers = ["№", "Ad", "Miqdar"]
    const data = ["1", "Monitor", 15]

    let [fontsLoad] = useFonts({
        'Medium': require('../assets/fonts/static/Montserrat-Medium.ttf')
    })

    return(
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical: 25 }}>
            <Text style={{textAlign: 'center', fontFamily: 'Medium', fontSize: 32}}> Kassa Orderləri </Text>
            <Table headers={headers} data={data} />
        </ScrollView>
    )
}

export default CassaOrders;
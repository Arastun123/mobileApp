import React from "react";
import { ScrollView } from "react-native";
import Text from "@kaloraat/react-native-text"
import Table from "../components/Table";

const CassaOrders = () => {
    const headers = ["№", "Ad", "Miqdar"]
    const data = ["1", "Monitor", 15]
    return(
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical: 25 }}>
            <Text title center> Kassa Orderləri </Text>
            <Table headers={headers} data={data} />
        </ScrollView>
    )
}

export default CassaOrders;
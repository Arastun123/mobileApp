import React from "react";
import { ScrollView } from "react-native";
import Text from "@kaloraat/react-native-text"

const CassaOrders = () => {
    return(
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical: 25 }}>
            <Text title center>
                Kassa Orderləri
            </Text>
        </ScrollView>
    )
}

export default CassaOrders;
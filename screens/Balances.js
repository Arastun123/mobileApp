import React from "react";
import { ScrollView } from "react-native";
import Text from "@kaloraat/react-native-text"


const Balances = () =>{
    return(
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical: 15 }}>
            <Text title center> Qalıqlar</Text>
        </ScrollView>
    )
}

export default Balances;
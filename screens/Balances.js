import React from "react";
import { ScrollView } from "react-native";
import Text from "@kaloraat/react-native-text"
import Table from "../components/Table";


const Balances = () =>{
    const headers = ["№", "Ad", "Miqdar"];
    const data = ["1", "Kompüter", 10];
    return(
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical: 15 }}>
            <Text title center> Qalıqlar</Text>
            <Table headers={headers} data={data} />
        </ScrollView>
    )
}

export default Balances;
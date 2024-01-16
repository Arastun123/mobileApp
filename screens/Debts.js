import React from "react";
import { ScrollView } from "react-native";
import Text from "@kaloraat/react-native-text"
import Table from "../components/Table";


const Debst = () =>{
    const headers = ["№", "Şirkətin adı", "Məbləğ"]
    const data = ["1", "İrşad", 4300]
    return(
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical: 15 }}>
            <Text title center>Borclar</Text>
            <Table headers={headers} data={data} />
        </ScrollView>
    )
    
}

export default Debst
import React from "react";
import { ScrollView, Text } from "react-native";
import Table from "../components/Table";
import { useFonts } from "expo-font";


const Debst = () =>{
    let [fontsLoad] = useFonts({'Medium': require('../assets/fonts/static/Montserrat-Medium.ttf') });
    
    const headers = ["№", "Şirkətin adı", "Məbləğ"]
    const data = ["1", "İrşad", 4300]
    
    if (!fontsLoad) {  return null }

    return(
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical: 15 }}>
            <Text style={{textAlign: 'center', fontFamily: 'Medium', fontSize: 32}}>Borclar</Text>
            {/* <Table headers={headers} data={data} /> */}
        </ScrollView>
    )
    
}

export default Debst
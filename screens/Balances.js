import React from "react";
import { ScrollView, Text } from "react-native";
import { useFonts } from "expo-font";


const Balances = () =>{
    let [fontsLoad] = useFonts({'Medium': require('../assets/fonts/static/Montserrat-Medium.ttf') });
    
    const headers = ["№", "Ad", "Miqdar"];
    const data = ["1", "Kompüter", 10];

    if (!fontsLoad) {  return null }

    return(
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical: 15 }}>
            <Text style={{textAlign:'center', fontFamily: 'Medium', fontSize: 32}}> Qalıqlar</Text>
            {/* <Table headers={headers} data={data} /> */}
        </ScrollView>
    )
}

export default Balances;
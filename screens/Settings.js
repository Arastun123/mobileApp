import { useFonts } from "expo-font";
import React from "react";
import { ScrollView, Text } from "react-native";


const Settings = () => {

    let [fontsLoad] = useFonts({
        'Medium': require('../assets/fonts/static/Montserrat-Medium.ttf')
    })

    return(
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical: 20 }}>
            <Text style={{ textAlign: 'center', fontFamily: 'Medium', fontSize: 32}}>Sazlamalar</Text>
        </ScrollView>
    )
}

export default Settings;
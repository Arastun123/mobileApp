import React from "react";
import { ScrollView, Text } from "react-native";


const Settings = () => {
    return(
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical: 20 }}>
            <Text style={{ textAlign: 'center', fontFamily: 'medium', fontSize: 32}}>Sazlamalar</Text>
        </ScrollView>
    )
}

export default Settings;
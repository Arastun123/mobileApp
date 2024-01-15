import React from "react";
import { ScrollView } from "react-native";
import Text from "@kaloraat/react-native-text"


const Settings = () => {
    return(
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical: 20 }}>
            <Text title center>Sazlamalar</Text>
        </ScrollView>
    )
}

export default Settings;
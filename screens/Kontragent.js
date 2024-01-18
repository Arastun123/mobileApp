import React, { useState } from "react";
import { ScrollView, View, StyleSheet, Pressable, Text } from "react-native";
import Table from "../components/Table";
import Physical from "../components/Physical";
import Legal from "../components/Legal";
import { useFonts } from "expo-font";


const Kontragent = ({selectedLocation}) => {
    const [selectedType, setSelectedType] = useState(null);

    const handlePress = (type) => {
        setSelectedType(type);
    };
    
    const headers = ["№", "Tarix", "Növ"];
    const data = ["1", "09.01.24", "Satış"];
    
    let [fontsLoad] = useFonts({
        'Medium': require('../assets/fonts/static/Montserrat-Medium.ttf')
    })
    
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical: 35, marginVertical: 20, marginHorizontal: 10 }}>
            <Text style={{ marginBottom: 10, textAlign: 'center', fontFamily: 'Medium', fontSize: 32 }}>Kontragent</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
                <Pressable style={{ ...styles.button, width: 150 }} onPress={() => handlePress('fiziki')}>
                    <Text style={styles.text}>Fiziki şəxs</Text>
                </Pressable>

                <Pressable style={{ ...styles.button, width: 150 }} onPress={() => handlePress('huquqi')}>
                    <Text style={styles.text}>Hüquqi şəxs</Text>
                </Pressable>
            </View>

            {selectedType === 'fiziki' && <Physical selectedLocation={selectedLocation} />}
            {selectedType === 'huquqi' && <Legal selectedLocation={selectedLocation} />}

            <View style={{ marginVertical: 10 }}> 
                <Text style={{ marginBottom: 10, textAlign: 'center', fontSize: 24 }}>Müqavilələr</Text>
                <Table data={data} headers={headers} />
            </View>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    input: {
        margin: 10,
        borderBottomWidth: 0.5,
        height: 48,
        borderBottomColor: '#8e93a1',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 4,
        backgroundColor: '#3498db',
        marginHorizontal: 10,
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
        fontFamily: 'Medium'
    },
});

export default Kontragent;
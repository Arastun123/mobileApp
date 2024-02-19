import React, { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet, Pressable, Text, TouchableOpacity } from "react-native";
import Table from "../components/Table";
import { Ionicons } from '@expo/vector-icons';
import Physical from "../components/Physical";
import Legal from "../components/Legal";
import { useFonts } from "expo-font";
import { fetchData } from '../services/Server';

const Kontragent = ({ selectedLocation }) => {
    const [selectedType, setSelectedType] = useState(null);
    const [resData, setData] = useState([]);
    let [fontsLoad] = useFonts({ 'Medium': require('../assets/fonts/static/Montserrat-Medium.ttf') });

    useEffect(() => { fetchDataAsync() }, []);

    const fetchDataAsync = async () => {
        try {
            const result = await fetchData('kontragent');
            if (result !== null) setData(result);
        } catch (error) {
            console.error(error);
        }
    };
    fetchDataAsync();

    const handlePress = (type) => { setSelectedType(type) };
    const handleRefresh = () => { fetchDataAsync() };

    const headers = ["№", "Adı", "Əlaqə nömrəsi", "Vöen", "Ünvan", "Növü"];
    const extractedData = resData.map((item) => [String(item.id), item.name, item.phone_number, item.tin, item.address, item.type]);

    if (!fontsLoad) { return null }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical: 35, marginVertical: 20, marginHorizontal: 10 }}>
            <Text style={{ marginBottom: 10, textAlign: 'center', fontFamily: 'Medium', fontSize: 32 }}>Kontragent</Text>
            <TouchableOpacity onPress={handleRefresh}>
                <View>
                    <Text style={{ textAlign: "right", fontWeight: "bold" }}> <Ionicons name="reload" size={16} color="#333" />  </Text>
                </View>
            </TouchableOpacity>
            
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
                <Table data={extractedData} headers={headers} />
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
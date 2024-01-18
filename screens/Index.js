import React from "react";
import { Ionicons } from '@expo/vector-icons';
import SearchBar from "../components/SearchBar";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet, TouchableOpacity, ScrollView, Text } from 'react-native';
import {useFonts} from 'expo-font';

const Stack = createNativeStackNavigator();

const Index = ({ navigation }) => {
    let [fontsLoad] = useFonts({
        'Medium': require('../assets/fonts/static/DancingScript-Medium.ttf')
    })
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical: 15 }}>
            <View>
                <SearchBar setCLicked={true} />
                <View style={{ marginTop: 10 }}>
                    <TouchableOpacity style={styles.buttonContainer}>
                        <Text onPress={() => navigation.navigate('Routes')} style={styles.buttonText}> Marşurutlar </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonContainer}>
                        <Text onPress={() => navigation.navigate('Orders')} style={styles.buttonText}>  Müştəri sifarişlər </Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection:'row', justifyContent: 'space-around',}}>
                        <TouchableOpacity style={styles.buttonContainer}>
                            <Text onPress={() => navigation.navigate('Invoce')} style={styles.buttonText}> Qaimələr </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonContainer}>
                            <Text onPress={() => navigation.navigate('Contracts')} style={styles.buttonText}>  {/* <Ionicons name="document" size={16} color="white" />  */} Müqavilələr </Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.buttonContainer}>
                        <Text onPress={() => navigation.navigate('Kontragent')} style={styles.buttonText}> Kontragentlər </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonContainer}>
                        <Text onPress={() => navigation.navigate('Nomenklatura')} style={styles.buttonText}> Nomenklatura </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonContainer}>
                        <Text onPress={() => navigation.navigate('CassaOrders')} style={styles.buttonText}> Kassa Orderləri </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonContainer}>
                        <Text onPress={() => navigation.navigate('Debts')} style={styles.buttonText}> Borclar / Qalıqlar </Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.buttonContainer}>
                    <Text medium center onPress={() => navigation.navigate('Balances')} style={styles.buttonText}> Qalıqlar </Text>
                </TouchableOpacity> */}
                    <TouchableOpacity style={styles.buttonContainer}>
                        <Text onPress={() => navigation.navigate('Settings')} style={styles.buttonText}>  <Ionicons name="settings" size={16} color="white" />  </Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.buttonContainer}>
                    <Text medium center onPress={() => navigation.navigate('Singin')} style={styles.buttonText}> Daxil ol </Text>
                </TouchableOpacity> */}
                    {/* <TouchableOpacity style={styles.buttonContainer}>
                    <Text medium center onPress={() => navigation.navigate('Singup')} style={styles.buttonText}> Singup </Text>
                </TouchableOpacity> */}
                </View>
            </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    buttonContainer: {
        backgroundColor: '#3498db',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 5,
        margin: 5
    },
    buttonText: {
        color: '#ffffff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily: 'Medium',
        fontSize: 20
    },
});



export default Index;
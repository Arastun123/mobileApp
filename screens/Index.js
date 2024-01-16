import React from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Text from "@kaloraat/react-native-text"
import Logo from "../components/Logo";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchBar from "../components/SearchBar";
import { Ionicons } from '@expo/vector-icons';


const Stack = createNativeStackNavigator();

const Index = ({ navigation }) => {
    
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical: 15 }}>
            <View>
                <SearchBar setCLicked={true} />
                <Logo />
                <TouchableOpacity style={styles.buttonContainer}>
                    <Text medium center onPress={() => navigation.navigate('Routes')} style={styles.buttonText}> Marşurutlar </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContainer}>
                    <Text medium center onPress={() => navigation.navigate('Orders')} style={styles.buttonText}>  Müştəri sifarişlər </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContainer}>
                    <Text medium center onPress={() => navigation.navigate('Invoce')} style={styles.buttonText}> Qaimələr </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContainer}>
                    <Text medium center onPress={() => navigation.navigate('Contracts')} style={styles.buttonText}> <Ionicons name="document" size={16} color="white" /> Müqavilələr </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContainer}>
                    <Text medium center onPress={() => navigation.navigate('Kontragent')} style={styles.buttonText}> Kontragentlər </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContainer}>
                    <Text medium center onPress={() => navigation.navigate('Nomenklatura')} style={styles.buttonText}> Nomenklatura </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContainer}>
                    <Text medium center onPress={() => navigation.navigate('CassaOrders')} style={styles.buttonText}> Kassa Orderləri </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContainer}>
                    <Text medium center onPress={() => navigation.navigate('Debts')} style={styles.buttonText}> Borclar </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContainer}>
                    <Text medium center onPress={() => navigation.navigate('Balances')} style={styles.buttonText}> Qalıqlar </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContainer}>
                    <Text medium center onPress={() => navigation.navigate('Settings')} style={styles.buttonText}> <Ionicons name="settings" size={16} color="white" /> Sazlamalar </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContainer}>
                    <Text medium center onPress={() => navigation.navigate('MapComponent')} style={styles.buttonText}> <Ionicons name="location" size={16} color="white" /> Map </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContainer}>
                    <Text medium center onPress={() => navigation.navigate('Singup')} style={styles.buttonText}> Singin </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContainer}>
                    <Text medium center onPress={() => navigation.navigate('Singup')} style={styles.buttonText}> Singup </Text>
                </TouchableOpacity>
               
            </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({ 
    buttonContainer: {
        backgroundColor: '#3498db',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        margin: 10
    },
    buttonText: {
        color: '#ffffff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});



export default Index;
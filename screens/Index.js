import React from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Text from "@kaloraat/react-native-text"
import Logo from "../components/auth/Logo";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchBar from "../components/SearchBar";

const Stack = createNativeStackNavigator();

const Index = ({ navigation }) => {
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical:15 }}>
            <View>
                <SearchBar setCLicked={true}/>
                <Logo/> 
                <TouchableOpacity style={styles.buttonContainer}>
                    <Text title center style={styles.buttonText}>Index</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContainer}>
                    <Text title center onPress={() => navigation.navigate('Routes')} style={styles.buttonText}> Marşurutlar </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContainer}>
                    <Text title center onPress={() => navigation.navigate('Orders')} style={styles.buttonText}> Müştəri sifarişlər </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContainer}>
                    <Text title center onPress={() => navigation.navigate('Orders')} style={styles.buttonText}> Qaimələr </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContainer}>
                    <Text title center onPress={() => navigation.navigate('Orders')} style={styles.buttonText}> Kassa Orderləri </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContainer}>
                    <Text title center onPress={() => navigation.navigate('Orders')} style={styles.buttonText}> Borclar </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContainer}>
                    <Text title center onPress={() => navigation.navigate('Orders')} style={styles.buttonText}> Qalıqlar </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContainer}>
                    <Text title center onPress={() => navigation.navigate('Orders')} style={styles.buttonText}> Sazlamalar </Text>
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
        margin:10
    },
    buttonText: {
        color: '#ffffff', 
        textAlign: 'center', 
        fontWeight: 'bold', 
    },
});



export default Index;
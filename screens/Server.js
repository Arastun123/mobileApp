import React, { useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Pressable, ScrollView, Text, TextInput } from 'react-native';
import { useFonts } from 'expo-font';

const Server = ({ navigation }) => {
    const [path, setPath] = useState();
    let [fontsLoad] = useFonts({ 'Medium': require('../assets/fonts/static/Montserrat-Medium.ttf') });

    if (!fontsLoad) { return null; }

    const goServer = () => {
        console.log(path);
    }
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical: 15 }}>
            <Text style={styles.text}> Server</Text>
            <View>
                <TextInput
                    placeholder='Server yolu'
                    keyboardType="numeric"
                    value={path}
                    onChangeText={(path) => setPath(path)}
                    style={styles.input}
                />
            </View>
            <View style={{ alignItems: 'flex-end', margin: 10 }}>
                <Pressable style={{ ...styles.button, width: 150 }} onPress={goServer}>
                    <Text style={styles.text}>Təsdiq et</Text>
                </Pressable>
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
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
        fontFamily: 'Medium'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 4,
        backgroundColor: 'green',
        width: 50,
    },
});

export default Server;
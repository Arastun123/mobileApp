import React, { useState } from "react";
import { ScrollView, StyleSheet, TextInput,  View, Pressable } from "react-native";
import Text from "@kaloraat/react-native-text"


const Contracts = () => {
    const [inputData, setData] = useState({
        'Company-name': '',
        'Number': '',
        'date': '',
        'type': '',
        'name': '',
        'comment': '',
    });
    const handleInputChange = (name, value) => {
        setData({
            ...inputData,
            [name]: value,
        });
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical: 15, marginVertical: 20, marginHorizontal: 10 }}>
           <Text center title> Müqavilələr</Text>
            <TextInput
                placeholder="Şirkətin adı"
                keyboardType="text"
                name="Company-name"
                onChangeText={(text) => handleInputChange('Company-name', text)}
                value={inputData['Company-name']}
                style={styles.input}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <View>
                    <TextInput
                        placeholder="№"
                        keyboardType="numeric"
                        name="Number"
                        onChangeText={(text) => handleInputChange('Number', text)}
                        value={inputData['Number']}
                        style={styles.input}
                    />
                </View>
                <View>
                    <TextInput
                        placeholder="Tarix"
                        keyboardType="date"
                        name="date"
                        onChangeText={(text) => handleInputChange('date', text)}
                        value={inputData['date']}
                        style={{ ...styles.input, width: 150 }}
                    />
                </View>
            </View>
            <TextInput
                placeholder="Növ"
                keyboardType="text"
                name="type"
                onChangeText={(text) => handleInputChange('type',text)}
                value={inputData['type']}
                style={{ ...styles.input }}
            />
            <TextInput
                placeholder="Ad"
                keyboardType="text"
                name="name"
                onChangeText={(text) => handleInputChange('name',text)}
                value={inputData['name']}
                style={{ ...styles.input }}
            />
            <TextInput
                placeholder="Şərh"
                name="comment"
                multiline
                keyboardType="text"
                onChangeText={(text) => handleInputChange('Comment',text)}
                value={inputData['Comment']}
                style={{ ...styles.input, }}
            />
            <View style={{ margin: 10 }}>
                <Pressable style={{ ...styles.button, width: 150 }} >
                    <Text style={styles.text}>Təsdiq et</Text>
                </Pressable>
            </View>
            <Text>
                {JSON.stringify({ inputData }, null, 4)}
            </Text>
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
        backgroundColor: 'green',
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
});

export default Contracts;
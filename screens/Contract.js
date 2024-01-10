import React from "react";
import { ScrollView, StyleSheet, TextInput, Text, View, Pressable} from "react-native";

const Contracts = () => {
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical: 15, marginVertical: 20, marginHorizontal: 10 }}>
            <TextInput
                placeholder="Şirkətin adı"
                keyboardType="text"
                // value=""
                // onChangeText={(text) => handleInputChange(text, rowIndex, 'name')}
                style={styles.input}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <View>
                    <TextInput
                        placeholder="№"
                        keyboardType="numric"
                        // value=""
                        style={styles.input}
                    />
                </View>
                <View>
                    <TextInput
                        placeholder="Tarix"
                        keyboardType="text"
                        // value=""
                        style={{ ...styles.input, width: 150 }}
                    />
                </View>
            </View>
            <TextInput
                placeholder="Növ"
                keyboardType="text"
                // value=""
                style={{ ...styles.input }}
            />
            <TextInput
                placeholder="Ad"
                keyboardType="text"
                // value=""
                style={{ ...styles.input }}
            />
            <TextInput
                placeholder="Şərh"
                multiline
                keyboardType="text"
                // value=""
                style={{ ...styles.input, }}
            />
            <View style={{ margin: 10 }}>
                <Pressable style={{ ...styles.button, width: 150 }} >
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
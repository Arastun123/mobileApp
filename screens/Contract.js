import React, { useState } from "react";
import { ScrollView, StyleSheet, TextInput, View, Pressable, Button } from "react-native";
import Text from "@kaloraat/react-native-text";
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import UserInput from "../components/auth/UserInput";


const Contracts = () => {
    const [companyName, setCompanyName] = useState()
    const [number, setNumber] = useState()
    const [date, setDate] = useState(new Date());
    const [type, setType] = useState()
    const [name, setName] = useState()
    const [comment, setComment] = useState()
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        // let currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        let formattedDate = `${selectedDate.getDate()}.${selectedDate.getMonth() + 1}.${selectedDate.getFullYear()}`
        setDate(formattedDate)
        console.log('formattedDate', formattedDate);
    };

    const showDatepicker = () => {
        setShow(true);
    };
   
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical: 15, marginVertical: 20, marginHorizontal: 10 }}>
            <Text center title> Müqavilələr</Text>
            <UserInput
                name="Şirkətin adı"
                value={name}
                setValue={setCompanyName}
                autoCompleteType="text"
                keyboardType="text"
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <View>
                    <UserInput
                        name="№"
                        value={number}
                        setValue={setNumber}
                        autoCompleteType="text"
                        keyboardType="numric"
                    />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <UserInput
                        name="Tarix"
                        value={date}
                        setValue={setDate}
                        autoCompleteType="date"
                        keyboardType="numric"
                    />
                    <Pressable onPress={showDatepicker}>
                        <Text> <Ionicons name="calendar" size={20} color="#333" /></Text>
                    </Pressable>
                    {show && (
                        <DateTimePicker
                            testID="datePicker"
                            value={date}
                            mode="date"
                            is24Hour={true}
                            display="default"
                            // display="spinner"
                            onChange={onChange}
                        />
                    )}
                </View>
            </View>
            <UserInput
                name="Növ"
                value={type}
                setValue={setType}
                autoCompleteType="text"
                keyboardType="text"
            />
            <UserInput
                name="Ad"
                value={name}
                setValue={setName}
                autoCompleteType="text"
                keyboardType="text"
            />
            <UserInput
                name="Şərh"
                value={comment}
                setValue={setComment}
                autoCompleteType="text"
                keyboardType="text"
                multiline
            />
            <View style={{ margin: 10 }}>
                <Pressable style={{ ...styles.button, width: 150 }} >
                    <Text style={styles.text}>Təsdiq et</Text>
                </Pressable>
            </View>
            <Text>
            <Text>{JSON.stringify({ companyName, number, date, type, name, comment }, null, 4)}</Text>
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
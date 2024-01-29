import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import UserInput from "../components/UserInput";
import { useFonts } from "expo-font";
// import { text } from "body-parser";



const Contracts = () => {
    const [companyName, setCompanyName] = useState()
    const [number, setNumber] = useState()
    const [date, setDate] = useState(new Date());
    const [type, setType] = useState()
    const [name, setName] = useState()
    const [comment, setComment] = useState()
    const [show, setShow] = useState(false);
    let [fontsLoad] = useFonts({'Medium': require('../assets/fonts/static/Montserrat-Medium.ttf') });

    const onChange = (event, selectedDate) => {
        let currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        let formattedDate = `${selectedDate.getDate()}.${selectedDate.getMonth() + 1}.${selectedDate.getFullYear()}`
        setDate(formattedDate)
    };

    const showDatepicker = () => { setShow(true) };

    if (!fontsLoad) {  return null }

    const sendData = async () => {
        const apiUrl = 'http://192.168.88.41:3000/api/contract';
        try {
            const postData = {
                name: name,
                number: number,
                date: formatDateString(date),
                type: type,
                company_name: companyName,
                comment: comment
            };
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (response.status === 200) Alert.alert('Məlumatlar göndərildi!');
            else Alert.alert('Uğursuz cəht!');
        } catch (error) {
            console.error(error);
        }
    };
    const formatDateString = (dateStr) => {
        const dateParts = dateStr.split('.');
        return `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;
    };
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical: 15, marginVertical: 20, marginHorizontal: 10 }}>
            <Text style={{ textAlign: 'center', fontFamily: 'Medium', fontSize: 32 }}> Müqavilələr</Text>
            <UserInput
                name="Şirkətin adı"
                value={companyName}
                setValue={setCompanyName}
                autoCompleteType="text"
                keyboardType="text"
                onChangeText = {(text) => setCompanyName(text)} 
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <View>
                    <UserInput
                        name="№"
                        value={number}
                        setValue={setNumber}
                        autoCompleteType="text"
                        keyboardType="numeric"
                        onChangeText = {(text) => setNumber(text)}
                    />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <UserInput
                        name="Tarix"
                        value={date}
                        setValue={setDate}
                        autoCompleteType="date"
                        keyboardType="numeric"
                        onChangeText = {(text) => setDate(text)}
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
                onChangeText = { (text) => setType(text)}
            />
            <UserInput
                name="Ad"
                value={name}
                setValue={setName}
                autoCompleteType="text"
                keyboardType="text"
                onChangeText = { (text) => setName(text)}
            />
            <UserInput
                name="Şərh"
                value={comment}
                setValue={setComment}
                autoCompleteType="text"
                keyboardType="text"
                multiline
                onChangeText = {(text) => setComment(text)}
            />
            <View style={{ alignItems: 'flex-end', margin: 10 }}>
                <Pressable style={{ ...styles.button, width: 150 }} onPress={sendData}>
                    <Text style={styles.text}>Təsdiq et</Text>
                </Pressable>
            </View>
            <Text>
                {/* <Text>{JSON.stringify({ companyName, number, date, type, name, comment }, null, 4)}</Text> */}
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
        fontFamily: 'Medium'
    },
});

export default Contracts;
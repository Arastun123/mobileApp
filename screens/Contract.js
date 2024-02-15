import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import UserInput from "../components/UserInput";
import { useFonts } from "expo-font";
import { formatDateString } from '../services/Functions';
import { sendRequest, fetchData } from '../services/Server';


const Contracts = () => {
    const [companyName, setCompanyName] = useState()
    const [number, setNumber] = useState()
    const [date, setDate] = useState(new Date());
    const [type, setType] = useState()
    const [name, setName] = useState()
    const [comment, setComment] = useState()
    const [show, setShow] = useState(false);
    const [data, setData] = useState([])
    let [fontsLoad] = useFonts({ 'Medium': require('../assets/fonts/static/Montserrat-Medium.ttf') });

    useEffect(() => {
        const fetchDataAsync = async () => {
            try {
                const result = await fetchData('contract');
                if (result !== null) { setData(result) }
            } catch (error) {
                console.error(error);
            }
        };

        fetchDataAsync();
    }, []);

    const onChange = (event, selectedDate) => {
        let currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        let formattedDate = `${selectedDate.getDate()}.${selectedDate.getMonth() + 1}.${selectedDate.getFullYear()}`
        setDate(formattedDate)
    };

    const showDatepicker = () => { setShow(true) };

    if (!fontsLoad) { return null }

    const sendData = async () => {
        let apiUrl = '/contract'
        const postData = {
            name: name,
            number: number,
            date: formatDateString(date),
            type: type,
            company_name: companyName,
            comment: comment
        };

        const result = await sendRequest(apiUrl, postData);

        if (result.success) {
            Alert.alert(result.message);
        } else {
            Alert.alert(result.message);
        }
    };

    const handleDate = () => { formatDateString(dateStr) }

    let id = data.map((item) => item.id);
    let lastId = 1 + id.pop();

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical: 15, marginVertical: 20, marginHorizontal: 10 }}>
            <Text style={{ textAlign: 'center', fontFamily: 'Medium', fontSize: 32 }}> Müqavilələr</Text>
            <UserInput
                name="Şirkətin adı"
                value={companyName}
                setValue={setCompanyName}
                autoCompleteType="text"
                keyboardType="text"
                onChangeText={(text) => setCompanyName(text)}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <View>
                    <UserInput
                        name="№"
                        value={String(lastId)}
                        setValue={setNumber}
                        autoCompleteType="text"
                        keyboardType="numeric"
                        onChangeText={(text) => setNumber(text)}
                    />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <UserInput
                        name="Tarix"
                        value={date}
                        setValue={setDate}
                        autoCompleteType="date"
                        keyboardType="numeric"
                        onChangeText={(text) => setDate(text)}
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
                onChangeText={(text) => setType(text)}
            />
            <UserInput
                name="Ad"
                value={name}
                setValue={setName}
                autoCompleteType="text"
                keyboardType="text"
                onChangeText={(text) => setName(text)}
            />
            <UserInput
                name="Şərh"
                value={comment}
                setValue={setComment}
                autoCompleteType="text"
                keyboardType="text"
                multiline
                onChangeText={(text) => setComment(text)}
            />
            <View style={{ alignItems: 'flex-end', margin: 10 }}>
                <Pressable style={{ ...styles.button, width: 150 }} onPress={sendData}>
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
        fontFamily: 'Medium'
    },
});

export default Contracts;
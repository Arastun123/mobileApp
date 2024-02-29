import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable, Alert, LogBox, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import UserInput from "../components/UserInput";
import { useFonts } from "expo-font";
// import { formatDateString } from '../services/Functions';
import { sendRequest, fetchData } from '../services/Server';


const Contracts = () => {
    const [companyName, setCompanyName] = useState()
    const [number, setNumber] = useState()
    const [date, setDate] = useState(new Date());
    const [type, setType] = useState()
    const [name, setName] = useState()
    const [comment, setComment] = useState()
    const [data, setData] = useState([]);
    const [showDatepicker, setShowDatepicker] = useState(false);

    let [fontsLoad] = useFonts({ 'Medium': require('../assets/fonts/static/Montserrat-Medium.ttf') });
    let rowCount = 0;
    useEffect(() => { fetchDataAsync(); }, []);
    const fetchDataAsync = async () => {
        try {
            const result = await fetchData('contract');
            if (result !== null) { setData(result) }
        } catch (error) {
            console.error(error);
        }
    };
    LogBox.ignoreLogs(['Warning: Failed prop type: Invalid prop `value` of type `date` supplied to `TextInput`, expected `string`'])

    const handleDateShow = () => { setShowDatepicker(true) };
    const headers = ["№", "Adı", "Şirkətin adı", "Tarix", "Növ"];

    if (!fontsLoad) { return null }
    const onChange = (event, selectedDate) => {
        setShowDatepicker(Platform.OS === 'ios');
        if (selectedDate) {
            let formattedDate = selectedDate.toISOString().split('T')[0];
            setDate(formattedDate);
        }
    };

    const sendData = async () => {
        let apiUrl = '/contract'
        const postData = {
            name: name,
            number: isNaN(lastId) ? '1' : lastId,
            date: date,
            type: type,
            company_name: companyName,
            comment: comment
        };

        const result = await sendRequest(apiUrl, postData);

        if (result.success) {
            Alert.alert(result.message);
            fetchDataAsync()
        } else {
            Alert.alert(result.message);
        }
    };

    let id = data.map((item) => item.id);
    let lastId = 1 + id.pop();

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical: 15, marginVertical: 20, marginHorizontal: 10 }}>
            <Text style={{ textAlign: 'center', fontFamily: 'Medium', fontSize: 32 }}> Müqavilə</Text>
            <UserInput
                name="Şirkətin adı"
                value={companyName}
                setValue={setCompanyName}
                autoCompleteType="text"
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
                    <Pressable onPress={handleDateShow}>
                        <Text> <Ionicons name="calendar" size={20} color="#333" /></Text>
                    </Pressable>
                    {showDatepicker && (
                        <DateTimePicker
                            testID="datePicker"
                            value={new Date(date)}
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
                onChangeText={(text) => setType(text)}
            />
            <UserInput
                name="Ad"
                value={name}
                setValue={setName}
                autoCompleteType="text"
                onChangeText={(text) => setName(text)}
            />
            <UserInput
                name="Şərh"
                value={comment}
                setValue={setComment}
                autoCompleteType="text"
                multiline
                onChangeText={(text) => setComment(text)}
            />
            <View style={{ alignItems: 'flex-end', margin: 10 }}>
                <Pressable style={{ ...styles.button, width: 150 }} onPress={sendData}>
                    <Text style={styles.text}>Təsdiq et</Text>
                </Pressable>
            </View>
            <View style={{ marginVertical: 0, }}>
                <Text style={{ marginBottom: 10, textAlign: 'center', fontSize: 24 }}>Müqavilələr</Text>
                <View style={{ ...styles.row }}>
                    {headers.map((header, rowIndex) => (
                        <View style={styles.cell} key={`row_${rowIndex}`}>
                            <Text numberOfLines={1} ellipsizeMode="tail" textBreakStrategy="simple" style={{ fontWeight: 600 }}>{header}</Text>
                        </View>
                    ))}
                </View>

                {
                    data.map((row, rowIndex) => (
                        <View key={`row_${rowIndex}`} onPress={() => handleRowPress(row)}>
                            <View style={[
                                styles.row,
                                // selectedRows.some((selectedRow) => selectedRow.id === row.id) && { backgroundColor: 'lightblue' },
                            ]}>
                                <View style={styles.cell}>
                                    <Text>{++rowCount}</Text>
                                </View>
                                <View style={styles.cell}>
                                    <Text> {data[rowIndex]?.name}</Text>
                                </View>
                                <View style={styles.cell}>
                                    <Text>{data[rowIndex]?.company_name}</Text>
                                </View>
                                <View style={styles.cell}>
                                    <Text>{data[rowIndex]?.date.split('T')[0]}</Text>
                                </View>
                                <View style={styles.cell}>
                                    <Text>{data[rowIndex]?.type}</Text>
                                </View>
                            </View>
                        </View>
                    ))
                }
                {/* <View style={{ margin: 10 }}>
                    <Pressable disabled={selectedRows.length === 0} style={{ ...styles.button, width: 150, display: `${selectedRows.length === 0 ? 'none' : 'block'}`, backgroundColor: 'blue' }} onPress={handelModalOpen}>
                        <Text style={styles.text}>Redaktə et</Text>
                    </Pressable>
                </View> */}

                {/* <Modal visible={isUpdateModalVisible} animationType="slide">
                    <ScrollView contentContainerStyle={{ marginVertical: 10 }} >
                        <View style={{ padding: 5 }}>
                            <Text style={{ textAlign: 'right' }} onPress={closeUpdateModal} ><Ionicons name="close" size={24} color="red" /></Text>
                        </View>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <View style={{ marginVertical: 10 }}>
                                    <View style={{ ...styles.row, marginHorizontal: 10 }}>
                                        {headers.map((header, rowIndex) => (
                                            <View style={styles.cell} key={`row_${rowIndex}`}>
                                                <Text>{header}</Text>
                                            </View>
                                        ))}
                                    </View>
                                    {selectedRows.map((row, rowIndex) => (
                                        <View style={{ ...styles.row, marginHorizontal: 10 }} key={`row_${rowIndex}`}>
                                            <View style={styles.cell}>
                                                <Text>{++rowCount}</Text>
                                            </View>
                                            <View style={styles.cell}>
                                                <TextInput
                                                    placeholder='Ad'
                                                    value={String(selectedRows[rowIndex]?.name)}
                                                    onChangeText={(text) => handleInputChange(rowIndex, 'name', text)}
                                                />
                                            </View>
                                            <View style={styles.cell}>
                                                <TextInput
                                                    placeholder='Əlaqə nömrəsi'
                                                    keyboardType="numeric"
                                                    value={String(selectedRows[rowIndex]?.phone_number)}
                                                    onChangeText={(text) => handleInputChange(rowIndex, 'phone_number', text)}
                                                />
                                            </View>
                                            <View style={styles.cell}>
                                                <TextInput
                                                    placeholder='Vöen'
                                                    value={String(selectedRows[rowIndex]?.tin)}
                                                    onChangeText={(text) => handleInputChange(rowIndex, 'tin', text)}
                                                />
                                            </View>
                                            <View style={styles.cell}>
                                                <TextInput
                                                    placeholder='Ünvan'
                                                    value={String(selectedRows[rowIndex]?.address)}
                                                    onChangeText={(text) => handleInputChange(rowIndex, 'address', text)}
                                                />
                                            </View>
                                            <View style={styles.cell}>
                                                <TextInput
                                                    placeholder='Növü'
                                                    value={String(selectedRows[rowIndex]?.type)}
                                                    onChangeText={(text) => handleInputChange(rowIndex, 'type', text)}
                                                />
                                            </View>
                                        </View>
                                    ))}
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ margin: 10 }}>
                                        <Pressable style={{ ...styles.button, width: 150, backgroundColor: 'red' }} onPress={deleteRow}>
                                            <Text style={styles.text}>Sil</Text>
                                        </Pressable>
                                    </View>
                                    <View style={{ margin: 10 }}>
                                        <Pressable style={{ ...styles.button, width: 150 }} onPress={handleEdit}>
                                            <Text style={styles.text}>Yenilə</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </Modal> */}
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
    table: {
        borderWidth: 1,
        borderColor: '#ddd',
        margin: 5,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    cell: {
        flex: 1,
        padding: 5,
        borderRightWidth: 1,
        borderColor: '#ddd',
    },
});

export default Contracts;
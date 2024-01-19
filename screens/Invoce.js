import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, ScrollView, Pressable, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import axios from 'axios';


const Invoce = () => {
    const [date, setDate] = useState(new Date());
    const [number, setNumber] = useState();
    const [show, setShow] = useState(false);
    const [customer, setCustomer] = useState();
    const [amount, setAmount] = useState()
    const [tableData, setTableData] = useState(data);
    const [rowData, setRowData] = useState([]);
    const [inputData, setData] = useState([]);
    const [data, setResData] = useState([]);

    let [fontsLoad] = useFonts({ 'Medium': require('../assets/fonts/static/Montserrat-Medium.ttf') })

    const headers = ["№", "Malın adı", "Miqdarı", "Qiymət", "Məbləğ"];
    // const data = [
    //     {
    //         "id": 1,
    //         "name": "Computer",
    //         "count": 2,
    //         "price": 2000,
    //     },
    //     {
    //         "id": 2,
    //         "name": "Phone",
    //         "count": 1,
    //         "price": 1800,
    //     },
    //     {
    //         "id": 3,
    //         "name": "Mouse",
    //         "count": 3,
    //         "price": 20,
    //     },
    //     {
    //         "id": 4,
    //         "name": "Monitor",
    //         "count": 5,
    //         "price": 150,
    //     },
    // ];

    useEffect( () => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const response = await axios.get('http://192.168.88.41:3000/api/data')
            setResData(response.data);
        } catch (err) {
            console.log(err);
        }
    }
    const handleInputChange = (text, rowIndex, fieldName) => {
        const updatedRowData = rowData.map((row, index) => {
            if (index === rowIndex) {
                return { ...row, [fieldName]: text };
            }
            return row;
        });

        let updatedPrice = parseFloat(updatedRowData[rowIndex].price);
        let updatedCount = parseFloat(updatedRowData[rowIndex].count);
        let calculatedValue = updatedPrice * updatedCount;
        setAmount(calculatedValue)

        setRowData(updatedRowData);

    };

    const totalPriceArray = 0
    // tableData.map(product => product.price * product.count);
    let tableSum = 0
    // totalPriceArray.reduce((acc, totalPrice) => acc + totalPrice, 0);
    let totalSum = 0 
    // tableSum + amount;

    if (isNaN(totalSum)) { totalSum = tableSum }

    let edv = 0
    // (totalSum * 18) / 100;
    let wholeAmout = 0
    // totalSum + edv;

    const numColumns = 50;

    const addRow = () => {
        const newRow = { name: '', count: '', price: '' };
        setRowData((prevRows) => [...prevRows, newRow]);
    };

    const onChange = (event, selectedDate) => {
        let currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        let formattedDate = `${selectedDate.getDate()}.${selectedDate.getMonth() + 1}.${selectedDate.getFullYear()}`
        setDate(formattedDate)
    };

    const showDatepicker = () => { setShow(true) };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical: 15, marginVertical: 20, }}>
            <Text style={{ textAlign: 'center', fontFamily: 'Medium', fontSize: 32 }}>Qaimələr</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <TextInput
                        style={{ ...styles.input, width: 100 }}
                        placeholder="Gün-Ay-İl"
                        keyboardType="numeric"
                        value={date}
                        onChangeText={setDate}
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
                <TextInput
                    style={{ ...styles.input, width: 50 }}
                    placeholder="№"
                    keyboardType="numeric"
                    value={number}
                    onChangeText={setNumber}
                />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <TextInput
                    placeholder="Müştəri"
                    autoCompleteType="text"
                    keyboardType="text"
                    value={customer}
                    onChangeText={setCustomer}
                    style={{ ...styles.input, width: 300 }}
                />
            </View>
            <View>
                <View style={{ marginVertical: 20, marginHorizontal: 10 }}>
                    <View>
                        <Pressable style={styles.button} onPress={addRow}>
                            <Text style={styles.text}>+</Text>
                        </Pressable>
                    </View>
                </View>
                <View style={styles.table}>
                    <View style={styles.row}>
                        {headers.map((header) => (
                            <View style={styles.cell}>
                                <Text bold center>{header}</Text>
                            </View>
                        ))}
                    </View>
                    <View>
                        {data.map((item, rowIndex) => (
                            <View style={styles.row} key={rowIndex}>
                                <View style={styles.cell}>
                                    <Text>{item.id}</Text>
                                </View>
                                <View style={styles.cell}>
                                    <TextInput
                                        placeholder={item.name}
                                        keyboardType="text"
                                        // value={tableData[rowIndex].name}
                                    />
                                </View>
                                <View style={styles.cell}>
                                    <TextInput
                                        placeholder={String(item.count)}
                                        keyboardType="numeric"
                                        // value={String(tableData[rowIndex].count)}
                                    />
                                </View>
                                <View style={styles.cell}>
                                    <TextInput
                                        placeholder={String(item.price)}
                                        keyboardType="numeric"
                                        // value={String(tableData[rowIndex].price)}
                                    />
                                </View>
                                <View style={styles.cell}>
                                    {/* <Text>{tableData[rowIndex].price * tableData[rowIndex].count}</Text> */}
                                </View>
                            </View>
                        ))}
                    </View>
                    {rowData.map((row, rowIndex) => (
                        <View style={styles.row} key={rowIndex}>
                            <View style={styles.cell}>
                                <Text>{rowIndex + data.length + 1}</Text>
                            </View>
                            <View style={styles.cell}>
                                <TextInput
                                    placeholder='Malın adı'
                                    keyboardType="text"
                                    value={rowData[rowIndex].name}
                                    // onChangeText={(text) => handleInputChange(text, rowIndex, 'name')}
                                />
                            </View>
                            <View style={styles.cell}>
                                <TextInput
                                    placeholder='Miqdar'
                                    keyboardType="numeric"
                                    value={rowData[rowIndex].count}
                                    // onChangeText={(text) => handleInputChange(text, rowIndex, 'count')}
                                />
                            </View>
                            <View style={styles.cell}>
                                <TextInput
                                    placeholder='Qiymət'
                                    keyboardType="numeric"
                                    value={rowData[rowIndex].price}
                                    // onChangeText={(text) => handleInputChange(text, rowIndex, 'price')}
                                />
                            </View>
                            <View style={styles.cell}>
                                <Text>{isNaN(amount) ? 'Məbləğ': amount  }</Text>
                                {/* <Text>{isNaN(amount) ? amount : 'Məbləğ' }</Text> */}
                            </View>
                        </View>
                    ))}
                </View>
            </View>
            <View style={{ alignItems: 'flex-end', margin: 10 }}>
                <Text>Məbləğ: <Text>{isNaN(totalSum) ? tableSum : totalSum}</Text></Text>
                <Text>Ədv:    <Text>{edv}</Text></Text>
                <Text>Toplam: <Text>{wholeAmout}</Text></Text>
            </View>
            <View style={{ alignItems: 'flex-end', margin: 10 }}>
                <Pressable style={{ ...styles.button, width: 150 }} >
                    <Text style={styles.text}>Təsdiq et</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    input: {
        margin: 10,
        borderBottomWidth: 0.5,
        height: 48,
        borderBottomColor: '#8e93a1',
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
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 4,
        backgroundColor: 'green',
        width: 50,
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
export default Invoce;
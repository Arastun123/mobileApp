import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, Modal, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Table from "../components/Table";
import { useFonts } from "expo-font";
import { fetchData } from '../services/Server';
import { Ionicons } from '@expo/vector-icons';
import { addRow, formatDateString } from '../services/Functions';
import { sendRequest, deleteData } from '../services/Server';


const Stack = createNativeStackNavigator();

const Orders = ({ navigation }) => {
    const [resData, setData] = useState([]);
    const [show, setShow] = useState(false);
    const [rowData, setRowData] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [date, setDate] = useState(new Date());
    const [customer, setCustomer] = useState()
    const [formTable, setFormTable] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [edv, setEdv] = useState(0);
    const [wholeAmout, setWholeAmount] = useState(0);
    const [number, setNumber] = useState();

    let [fontsLoad] = useFonts({ 'Medium': require('../assets/fonts/static/Montserrat-Medium.ttf') });
    const headers = ["№", "Malın adı", "Miqdarı", "Qiymət", "Ölçü vahidi", "Məbləğ"];
    const mainHeaders = ["№", "Tarix", "Malın adı", "Miqdarı", "Qiymət", "Ölçü vahidi", "Məbləğ"];
    let rowCount = 0;

    useEffect(() => {
        const fetchDataAsync = async () => {
            try {
                const result = await fetchData('orders');
                if (result !== null) { setData(result) }
            } catch (error) {
                console.error(error);
            }
        };

        fetchDataAsync();
    }, []);
    const extractedData = resData.map((item) => [String(item.id), item.date, item.customer, item.product_name, item.price, item.quantity, item.units]);

    let id = resData.map((item) => String(item.id));
    let lastId = id.pop(); 

    if (!fontsLoad) { return null }

    const handleTableInputChange = (index, field, value) => {
        let updatedFormTable = [...formTable];
        let quantity = parseFloat(updatedFormTable[index]?.quantity) || 0;
        let price = parseFloat(updatedFormTable[index]?.price) || 0;
        let amount = (quantity * price).toFixed(2);

        updatedFormTable[index] = {
            ...updatedFormTable[index],
            [field]: value,
            amount: amount,
        };

        setFormTable((prevFormTable) => {
            return updatedFormTable;
        });
        recalculateTotalAmount(updatedFormTable);
    };

    const recalculateTotalAmount = (table) => {
        let totalAmount = table.reduce((sum, row) => {
            let rowAmount = parseFloat(row.amount) || 0;
            return sum + rowAmount;
        }, 0);

        let edv = (totalAmount * 18) / 100;
        let wholeAmount = edv + totalAmount;

        setTotalAmount(totalAmount.toFixed(2));
        setEdv(edv.toFixed(2));
        setWholeAmount(wholeAmount.toFixed(2));
    };

    const sendData = async () => {
        let apiUrl = '/orders'
        const postData = {
            date: formatDateString(date),
            customer: customer,
            formTable: formTable,
        };
        const result = await sendRequest(apiUrl, postData);

        if (result.success) Alert.alert(result.message);
        else Alert.alert(result.message);

    }

    const onChange = (event, selectedDate) => {
        let currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        let formattedDate = `${selectedDate.getDate()}.${selectedDate.getMonth() + 1}.${selectedDate.getFullYear()}`
        setDate(formattedDate)
    };

    const handleDate = () => { formatDateString(dateStr) }
    const handlePress = () => { setModalVisible(true) }
    const showDatepicker = () => { setShow(true) };
    const handleAddRow = () => { addRow(setRowData) };

    const closeModal = () => {
        setModalVisible(false)
        setDate(new Date())
        setRowData([])
        setFormTable()
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', marginTop: 20 }}>
            <Text style={{ textAlign: 'center', fontFamily: 'Medium', fontSize: 32 }}> Sifarişlər </Text>
            <View style={{ marginVertical: 20, marginHorizontal: 10 }}>
                <Pressable style={{ ...styles.button, width: 250 }} onPress={handlePress}>
                    <Text style={styles.text}>Yeni Sifariş yarat</Text>
                </Pressable>
            </View>
            <Modal visible={isModalVisible} animationType="slide">
                <ScrollView>
                    <View style={{ margin: 10 }} >
                        <View style={{ padding: 5 }}>
                            <Text style={{ textAlign: 'right' }} onPress={closeModal} ><Ionicons name="close" size={24} color="red" /></Text>
                        </View>
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
                                    <Text> <Ionicons name="calendar" size={20} color="#333" /> </Text>
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
                                value={lastId}
                                onChangeText={setNumber}
                            />
                        </View>
                        <TextInput
                            style={{ ...styles.input, }}
                            placeholder="Müştəri"
                            value={customer}
                            onChangeText={(text) => setCustomer(text)}
                        />
                    </View>
                    <View style={{ marginVertical: 20, marginHorizontal: 10 }}>
                        <View>
                            <Pressable style={styles.button} onPress={handleAddRow}>
                                <Text style={styles.text}>+</Text>
                            </Pressable>
                        </View>
                    </View>
                    <View style={{ ...styles.row, marginHorizontal: 10 }}>
                        {headers.map((header, rowIndex) => (
                            <View style={styles.cell} key={`row_${rowIndex}`}>
                                <Text bold center>{header}</Text>
                            </View>
                        ))}
                    </View>
                    {rowData.map((row, rowIndex) => (
                        <View style={{ ...styles.row, marginHorizontal: 10 }} key={`row_${rowIndex}`}>
                            <View style={styles.cell}>
                                <Text>{++rowCount}</Text>
                            </View>
                            <View style={styles.cell}>
                                <TextInput
                                    placeholder='Malın adı'
                                    keyboardType="text"
                                    value={formTable[rowIndex]?.product_name}
                                    onChangeText={(text) => handleTableInputChange(rowIndex, 'product_name', text)}
                                />
                            </View>
                            <View style={styles.cell}>
                                <TextInput
                                    placeholder='Miqdar'
                                    keyboardType="numeric"
                                    value={formTable[rowIndex]?.quantity}
                                    onChangeText={(text) => handleTableInputChange(rowIndex, 'quantity', text)}
                                />
                            </View>
                            <View style={styles.cell}>
                                <TextInput
                                    placeholder='Qiymət'
                                    keyboardType="numeric"
                                    value={formTable[rowIndex]?.price}
                                    onChangeText={(text) => handleTableInputChange(rowIndex, 'price', text)}
                                />
                            </View>
                            <View style={styles.cell}>
                                <TextInput
                                    placeholder='Ölçü vahidi'
                                    value={formTable[rowIndex]?.units}
                                    onChangeText={(text) => handleTableInputChange(rowIndex, 'units', text)}
                                />
                            </View>
                            <View style={styles.cell}>
                                <Text>{
                                    isNaN(!formTable[rowIndex]?.price * formTable[rowIndex]?.quantity) ? '000' : parseFloat(formTable[rowIndex]?.price * formTable[rowIndex]?.quantity)
                                }</Text>
                            </View>
                        </View>
                    ))}
                    <View style={{ alignItems: 'flex-end', margin: 10 }}>
                        <Text style={{ ...styles.text, color: '#333' }}>Məbləğ: <Text>{isNaN(totalAmount) ? '000' : totalAmount}</Text></Text>
                        <Text style={{ ...styles.text, color: '#333' }}>Ədv:    <Text>{isNaN(edv) ? '000' : edv}</Text></Text>
                        <Text style={{ ...styles.text, color: '#333' }}>Toplam: <Text>{isNaN(wholeAmout) ? '000' : wholeAmout}</Text></Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', margin: 10 }}>
                        <Pressable style={{ ...styles.button, width: 150 }} onPress={sendData}>
                            <Text style={styles.text}>Təsdiq et</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </Modal>
            <Table headers={mainHeaders} data={extractedData} />
        </ScrollView >
    )

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
export default Orders;
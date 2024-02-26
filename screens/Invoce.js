import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, ScrollView, Pressable, Text, Alert, Modal, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import UserInput from "../components/UserInput";
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { fetchData } from '../services/Server';
import { addRow, formatDateString, removeLastRow } from '../services/Functions';
import { sendRequest, deleteData, sendEditData, } from '../services/Server';

const Invoce = () => {
    const [number, setNumber] = useState();
    const [data, setResData] = useState([]);
    // const [show, setShow] = useState(false);
    const [customer, setCustomer] = useState();
    const [rowData, setRowData] = useState([]);
    const [date, setDate] = useState(new Date());
    const [tableData, setTableData] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [formTable, setFormTable] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
    const [editTableAmount, setEditTableAmount] = useState(0);
    const [editTableEdv, setEditTableEdv] = useState(0);
    const [editTableAmountAll, setEditTableAmountAll] = useState(0);
    const [isChecked, setChecked] = useState(false)
    const [rowsSameCustomer, setRowsSameCustomer] = useState([]);
    const [showDatepicker, setShowDatepicker] = useState(false);

    let [fontsLoad] = useFonts({ 'Medium': require('../assets/fonts/static/Montserrat-Medium.ttf') })

    let count = 0;
    let rowCount = 0;
    const headers = ["№", "Müştəri", "Miqdar", "Məbləğ"];
    const editHeaders = ["№", "Miqdar", "Məbləğ", 'Malın adı'];
    const createHeaders = ["№", 'Qiymət', "Miqdar", 'Malın adı', "Məbləğ"];
    const handleDateShow = () => { setShowDatepicker(true) };

    const handlePress = () => { setModalVisible(true) }

    useEffect(() => { fetchDataAsync() }, []);

    const fetchDataAsync = async () => {
        try {
            const result = await fetchData('invoice');
            setResData(result);
            setTableData(result);
        } catch (error) {
            console.error(error);
        }
    };

    const handleTableInputChange = (index, field, value) => {
        setFormTable((prevFormTable) => {

            const newData = [...prevFormTable];
            const quantity = parseFloat(newData[index]?.quantity) || 0;
            const price = parseFloat(newData[index]?.price) || 0;

            let total = (price * quantity).toFixed(2);

            let sumAmount = newData.reduce((accumulator, item) => accumulator + (+item.price || 0) * (+item.quantity || 0), 0);

            let edv = (sumAmount * 18) / 100;
            let allAmount = sumAmount + edv;

            setEditTableAmount(sumAmount);
            setEditTableEdv(edv);
            setEditTableAmountAll(allAmount);

            newData[index] = {
                ...newData[index],
                [field]: value,
                // total: total,
            };
            return newData;
        });
    };

    const handleAddRow = () => { addRow(setRowData) };
    const handleRemoveRow = () => { removeLastRow(setRowData) };
    const handleDate = () => { formatDateString(dateStr) }
    const closeUpdateModal = () => { 
        setUpdateModalVisible(false)
        setCustomer()
        setDate(new Date())
        setSelectedRows([])
        fetchDataAsync()
    }

    const sendData = async () => {
        let apiUrl = '/invoice';

        const postData = {
            date: date,
            number: isNaN(lastId) ? '1' : lastId,
            customer: customer,
            formTable: formTable,
        };
        const result = await sendRequest(apiUrl, postData);

        if (result.success) {
            Alert.alert(result.message);
            closeModal()
        } else {
            Alert.alert(result.message);
        }
    };

    const onChange = (event, selectedDate) => {
        setShowDatepicker(Platform.OS === 'ios');
        if (selectedDate) {
            let formattedDate = selectedDate.toISOString().split('T')[0];
            setDate(formattedDate);
        }
    };

    const closeModal = () => {
        setModalVisible(false)
        setCustomer()
        setDate(new Date())
        setFormTable([])
        setRowData([])
        fetchDataAsync()
    };

    const deleteRow = async () => {
        const idsToDelete = selectedRows.map((row) => row.id);
        const tableName = 'invoice';

        try {
            for (const idToDelete of idsToDelete) {
                const result = await deleteData(idToDelete, tableName);
                if (!result.success) {
                    Alert.alert(result.message);
                    return;
                }
            }

            setSelectedRows([]);
            Alert.alert('Məlumatlar silindi');
            setUpdateModalVisible(false)
            fetchDataAsync()
        } catch (error) {
            console.error(error);
        }
    };

    const handleRowPress = (row) => {
        const isSelected = selectedRows.some((selectedRow) => selectedRow.id === row.id);
        setChecked(true);

        if (isSelected) {
            const updatedSelectedRows = selectedRows.filter((selectedRow) => selectedRow.id !== row.id);
            setSelectedRows(updatedSelectedRows);
            setChecked(false);
        } else {
            const { customer, date, number, ...restRow } = row;
            const dateObject = new Date(date);

            setCustomer(customer || '');
            setDate(dateObject || new Date());
            setNumber(number || '');
            const selectedRowWithoutDate = { ...restRow };
            const dateToSend = dateObject.toISOString();
            const rowsWithSameCustomer = data.filter((rowData) => rowData.customer === customer);
            setSelectedRows([selectedRowWithoutDate]);
            setRowsSameCustomer(rowsWithSameCustomer);
            // console.log(rowsWithSameCustomer);
        }
    };

    const handleInputChange = (index, field, value) => {
        let newRowData = [...rowsSameCustomer];

        newRowData[index] = {
            ...newRowData[index],
            [field]: value,
        };

        let sumAmount = newRowData.reduce((accumulator, item) => accumulator + ((+item.price || 0) * (+item.quantity || 0)), 0);

        let edv = (sumAmount * 18) / 100;
        let allAmount = sumAmount + edv;

        setEditTableAmount(sumAmount);
        setEditTableEdv(edv);
        setEditTableAmountAll(allAmount);

        setRowsSameCustomer(newRowData);
    };

    const handleEdit = async () => {
        try {
            const dateObject = new Date(date);
    
            const updatedRows = rowsSameCustomer.map(item => {
                return {
                    id: item.id,
                    quantity: item.quantity || 0,
                    price: item.price || 0,
                    product_name: item.product_name || '',
                };
            });
    
            const endpoint = `http://192.168.88.44:3000/api/invoice`;
    
            const result = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newRows: updatedRows,  
                    date: dateObject.toISOString().split('T')[0],
                    customer,
                    number,
                }),
            });
    
            const resultJson = await result.json();
    
            if (resultJson.success) {
                Alert.alert(resultJson.message);
                setUpdateModalVisible(false);
                setSelectedRows([]);
                fetchDataAsync();
            } else {
                Alert.alert(resultJson.message);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error occurred during update');
        }
    };

    const handleModalOpen = () => {
        setUpdateModalVisible(true)
        let sumAmount = rowsSameCustomer.reduce((accumulator, item) => accumulator + ((+item.price || 0) * (+item.quantity || 0)), 0);
        let edv = (sumAmount * 18) / 100;
        let allAmount = sumAmount + edv;

        setEditTableAmount(sumAmount);
        setEditTableEdv(edv);
        setEditTableAmountAll(allAmount);
    }
    let id = tableData.map((item) => item.id);
    let lastId = 1 + id.pop();

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical: 15, marginVertical: 20, }}>
            <Text style={{ textAlign: 'center', fontFamily: 'Medium', fontSize: 32 }}>Qaimələr</Text>
            <View style={{ marginVertical: 20, marginHorizontal: 10 }}>
                <Pressable style={{ ...styles.button, width: 250, display: `${selectedRows.length === 0 ? 'block' : 'none'}` }} onPress={handlePress}>
                    <Text style={styles.text}>Yeni Qaimə əlavə et</Text>
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
                                <Pressable onPress={handleDateShow}>
                                    <Text> <Ionicons name="calendar" size={20} color="#333" /> </Text>
                                </Pressable>
                                {showDatepicker && (
                                    <DateTimePicker
                                        testID="datePicker"
                                        value={new Date(date)}
                                        mode="date"
                                        is24Hour={true}
                                        display="default"
                                        onChange={onChange}
                                    />
                                )}
                            </View>
                            <TextInput
                                style={{ ...styles.input, width: 50 }}
                                placeholder="№"
                                keyboardType="numeric"
                                value={isNaN(lastId) ? '1' : String(lastId)}
                                onChangeText={setNumber}
                            />
                        </View>
                        <TextInput
                            style={{ ...styles.input, }}
                            placeholder="Müştəri"
                            keyboardType="text"
                            value={customer}
                            onChangeText={(text) => setCustomer(text)}
                        />
                    </View>
                    <View style={{ marginVertical: 20, marginHorizontal: 10, flexDirection: 'row' }}>
                        <View>
                            <Pressable style={{ ...styles.button, marginHorizontal: 5 }} onPress={handleAddRow}>
                                <Text style={styles.text}>+</Text>
                            </Pressable>
                        </View>
                        <View>
                            <Pressable style={styles.button} onPress={handleRemoveRow}>
                                <Text style={styles.text}>-</Text>
                            </Pressable>
                        </View>
                    </View>
                    <View style={{ ...styles.row, marginHorizontal: 10 }}>
                        {createHeaders.map((header) => (
                            <View style={styles.cell}>
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
                                    placeholder='Qiymət'
                                    keyboardType="numeric"
                                    value={formTable[rowIndex]?.price}
                                    onChangeText={(text) => handleTableInputChange(rowIndex, 'price', text)}
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
                                    placeholder='Malın adı'
                                    keyboardType="text"
                                    value={formTable[rowIndex]?.product_name}
                                    onChangeText={(text) => handleTableInputChange(rowIndex, 'product_name', text)}
                                />
                            </View>
                            <View style={styles.cell}>
                                <Text>{
                                    isNaN(formTable[rowIndex]?.price && formTable[rowIndex]?.quantity) ? '000' : parseFloat(formTable[rowIndex]?.price * formTable[rowIndex]?.quantity)
                                }</Text>
                            </View>
                        </View>
                    ))}
                    <View style={{ alignItems: 'flex-end', margin: 10 }}>
                        <Text style={{ ...styles.text, color: '#333' }}>Məbləğ: <Text>{isNaN(editTableAmount) ? '000' : editTableAmount}</Text></Text>
                        <Text style={{ ...styles.text, color: '#333' }}>Ədv:    <Text>{isNaN(editTableEdv) ? '000' : editTableEdv}</Text></Text>
                        <Text style={{ ...styles.text, color: '#333' }}>Toplam: <Text>{isNaN(editTableAmountAll) ? '000' : editTableAmountAll}</Text></Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', margin: 10 }}>
                        <Pressable style={{ ...styles.button, width: 150 }} onPress={sendData}>
                            <Text style={styles.text}>Təsdiq et</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </Modal>
            <View>
                <View style={styles.table}>
                    <View style={styles.row}>
                        {headers.map((header, rowIndex) => (
                            <View style={styles.cell} key={`row_${rowIndex}`}>
                                <Text numberOfLines={1} ellipsizeMode="tail" textBreakStrategy="simple">{header}</Text>
                            </View>
                        ))}
                    </View>
                    <View>
                        {data.map((item, rowIndex) => (
                            <TouchableOpacity key={`row_${rowIndex}`} onPress={() => handleRowPress(item)}>
                                <View
                                    style={[
                                        styles.row,
                                        selectedRows.some((selectedRow) => selectedRow.id === item.id) && { backgroundColor: 'lightblue' },
                                    ]}
                                >
                                    <View style={styles.cell}>
                                        <Text>{++count}</Text>
                                    </View>
                                    <View style={styles.cell}>
                                        <Text numberOfLines={1} ellipsizeMode="tail" textBreakStrategy="simple">{item.customer}</Text>
                                    </View>
                                    <View style={styles.cell}>
                                        <Text>{item.quantity}</Text>
                                    </View>
                                    <View style={styles.cell}>
                                        <Text>{item.price * item.quantity}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <View style={{ margin: 10, display: `${selectedRows.length === 0 ? 'none' : 'block'}`, flexDirection: 'row' }}>
                    <View style={{ margin: 10 }}>
                        <Pressable disabled={selectedRows.length === 0} style={{ ...styles.button, width: 150, backgroundColor: 'blue' }} onPress={handleModalOpen}>
                            <Text style={styles.text}>Redaktə et</Text>
                        </Pressable>
                    </View>

                    <View style={{ margin: 10 }}>
                        <Pressable style={{ ...styles.button, width: 150, backgroundColor: 'red' }} onPress={deleteRow}>
                            <Text style={styles.text}>Sil</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
            <Modal visible={isUpdateModalVisible} animationType="slide">
                <ScrollView contentContainerStyle={{ marginVertical: 10 }} >
                    <View style={{ padding: 5 }}>
                        <Text style={{ textAlign: 'right' }} onPress={closeUpdateModal} ><Ionicons name="close" size={24} color="red" /></Text>
                    </View>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <TextInput
                                        style={{ ...styles.input, width: 100 }}
                                        placeholder="Gün-Ay-İl"
                                        keyboardType="numeric"
                                        value={date}
                                        onChangeText={setDate}
                                    />
                                    <Pressable onPress={handleDateShow}>
                                        <Text> <Ionicons name="calendar" size={20} color="#333" /> </Text>
                                    </Pressable>
                                    {showDatepicker && (
                                        <DateTimePicker
                                            testID="datePicker"
                                            value={new Date(date)}
                                            mode="date"
                                            is24Hour={true}
                                            display="default"
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
                            <TextInput
                                style={{ ...styles.input, }}
                                placeholder="Müştəri"
                                keyboardType="text"
                                value={customer}
                                onChangeText={setCustomer}
                            />
                            <View style={{ marginVertical: 10 }}>
                                <View style={{ ...styles.row, marginHorizontal: 10 }}>
                                    {createHeaders.map((header) => (
                                        <View style={styles.cell}>
                                            <Text>{header}</Text>
                                        </View>
                                    ))}
                                </View>
                                {rowsSameCustomer.map((row, rowIndex) => (
                                    <View style={{ ...styles.row, marginHorizontal: 10 }} key={`row_${rowIndex}`}>
                                        <View style={styles.cell}>
                                            <Text>{++rowCount}</Text>
                                        </View>
                                        <View style={styles.cell}>
                                            <TextInput
                                                placeholder='Qiymət'
                                                keyboardType="numeric"
                                                value={String(rowsSameCustomer[rowIndex]?.price)}
                                                onChangeText={(text) => handleInputChange(rowIndex, 'price', text)}
                                            />
                                        </View>
                                        <View style={styles.cell}>
                                            <TextInput
                                                placeholder='Miqdar'
                                                keyboardType="numeric"
                                                value={String(rowsSameCustomer[rowIndex]?.quantity)}
                                                onChangeText={(text) => handleInputChange(rowIndex, 'quantity', text)}
                                            />
                                        </View>
                                        <View style={styles.cell}>
                                            <TextInput
                                                placeholder='Malın adı'
                                                keyboardType="text"
                                                value={String(rowsSameCustomer[rowIndex]?.product_name)}
                                                onChangeText={(text) => handleInputChange(rowIndex, 'product_name', text)}
                                            />
                                        </View>
                                        <View style={styles.cell}>
                                            <Text>
                                                {
                                                    isNaN(rowsSameCustomer[rowIndex]?.price && rowsSameCustomer[rowIndex]?.quantity) ? '000' : rowsSameCustomer[rowIndex]?.price * rowsSameCustomer[rowIndex]?.quantity
                                                }
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                            <View style={{ alignItems: 'flex-end', margin: 10 }}>
                                <Text style={{ ...styles.text, color: '#333' }}>Məbləğ: <Text>{isNaN(editTableAmount) ? '000' : editTableAmount}</Text></Text>
                                <Text style={{ ...styles.text, color: '#333' }}>Ədv:    <Text>{isNaN(editTableEdv) ? '000' : editTableEdv}</Text></Text>
                                <Text style={{ ...styles.text, color: '#333' }}>Toplam: <Text>{isNaN(editTableAmountAll) ? '000' : editTableAmountAll}</Text></Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                <View style={{ margin: 10 }}>
                                    <Pressable style={{ ...styles.button, width: 150 }} onPress={handleEdit}>
                                        <Text style={styles.text}>Yenilə</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </Modal>
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
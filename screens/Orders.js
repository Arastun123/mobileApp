import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, Modal, TextInput, Pressable, StyleSheet, Alert, TouchableOpacity, DevSettings, LogBox } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFonts } from "expo-font";
import { fetchData } from '../services/Server';
import { Ionicons } from '@expo/vector-icons';
import { addRow, removeLastRow } from '../services/Functions';
import { sendRequest, deleteData, sendEditData } from '../services/Server';


const Orders = () => {
    const [resData, setData] = useState([]);
    const [rowData, setRowData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [date, setDate] = useState(new Date());
    const [customer, setCustomer] = useState();
    const [formTable, setFormTable] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [edv, setEdv] = useState(0);
    const [wholeAmout, setWholeAmount] = useState(0);
    const [number, setNumber] = useState();
    const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
    const [showDatepicker, setShowDatepicker] = useState(false);

    let [fontsLoad] = useFonts({ 'Medium': require('../assets/fonts/static/Montserrat-Medium.ttf') });
    const headers = ["№", "Malın adı", "Miqdarı", "Qiymət", "Ölçü vahidi", "Məbləğ"];
    const mainHeaders = ["№", "Malın adı", "Miqdarı", "Məbləğ"];
    const editHeaders = ["№", "Qiymət", "Miqdarı", "Malın adı", "Ölçü vahidi", "Məbləğ"];

    LogBox.ignoreLogs(['Warning: Failed prop type: Invalid prop `value` of type `date` supplied to `TextInput`, expected `string`'])

    useEffect(() => { fetchDataAsync() }, []);
    const fetchDataAsync = async () => {
        try {
            const result = await fetchData('orders', 'true');
            if (result !== null) { setData(result) }
        } catch (error) {
            console.error(error);
        }
    };

    let id = resData.map((item) => item.id);
    let lastId = 1 + id.pop();

    if (!fontsLoad) { return null }
    const handlePress = () => { setModalVisible(true); handleAddRow() }
    const handleDateShow = () => { setShowDatepicker(true) };
    const handleAddRow = () => { addRow(setRowData) };
    const handleRemoveRow = () => { removeLastRow(setRowData) };
    const closeUpdateModal = () => { setUpdateModalVisible(false) }
    const handelModalOpen = () => { setUpdateModalVisible(true); }

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
            date: date,
            customer: customer,
            formTable: formTable,
        };
        const result = await sendRequest(apiUrl, postData);

        if (result.success) {
            Alert.alert(result.message)
            closeModal()
        }
        else Alert.alert(result.message);

    }

    const onChange = (event, selectedDate) => {
        setShowDatepicker(Platform.OS === 'ios');
        if (selectedDate) {
            let formattedDate = selectedDate.toISOString().split('T')[0];
            setDate(formattedDate);
        }
    };

    const deleteRow = async () => {
        const idsToDelete = selectedRows.map((row) => row.id);
        const tableName = 'orders';

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

    const closeModal = () => {
        setModalVisible(false)
        setDate(new Date())
        setRowData([])
        setFormTable()
        fetchDataAsync()
    }

    const handleInputChange = (index, field, value) => {
        let updatedSelectedRows = [...selectedRows];

        updatedSelectedRows = updatedSelectedRows.map((row, rowIndex) => {
            if (rowIndex === index) {
                return {
                    ...row,
                    [field]: value,
                };
            }
            return row;
        });
        setSelectedRows(updatedSelectedRows);
    };

    const handleEdit = async () => {
        let tableName = 'orders';
        try {
            const result = await sendEditData(selectedRows, tableName);
            if (result.success) {
                Alert.alert(result.message);
                setUpdateModalVisible(false);
                setSelectedRows([]);
                fetchDataAsync();
            } else {
                setSelectedRows([]);
                Alert.alert(result.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleRowPress = (row) => {
        const isSelected = selectedRows.some((selectedRow) => selectedRow.id === row.id);
        if (isSelected) {
            const updatedSelectedRows = selectedRows.filter((selectedRow) => selectedRow.id !== row.id);
            setSelectedRows(updatedSelectedRows);
        } else {
            setSelectedRows([...selectedRows, row]);
        }

    };
    DevSettings.disableYellowBox = true;

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
                            {/* <TextInput
                                style={{ ...styles.input, width: 50 }}
                                placeholder="№"
                                keyboardType="numeric"
                                value={isNaN(lastId) ? '1' : String(lastId)}
                                onChangeText={setNumber}
                            /> */}
                        </View>
                        <TextInput
                            style={{ ...styles.input, }}
                            placeholder="Müştəri"
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
                        {headers.map((header, rowIndex) => (
                            <View style={styles.cell} key={`row_${rowIndex}`}>
                                <Text bold center>{header}</Text>
                            </View>
                        ))}
                    </View>
                    {rowData.map((row, rowIndex) => (
                        <View style={{ ...styles.row, marginHorizontal: 10 }} key={`row_${rowIndex}`}>
                            <View style={styles.cell}>
                                <Text>{++rowIndex}</Text>
                            </View>
                            <View style={styles.cell}>
                                <TextInput
                                    placeholder='Malın adı'
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
            <View style={{ ...styles.row }}>
                {mainHeaders.map((header, rowIndex) => (
                    <View style={styles.cell} key={`row_${rowIndex}`}>
                        <Text numberOfLines={1} ellipsizeMode="tail" textBreakStrategy="simple" style={{ fontWeight: 600 }}>{header}</Text>
                    </View>
                ))}
            </View>

            {resData.map((row, rowIndex) => (
                <TouchableOpacity key={`row_${rowIndex}`} onPress={() => handleRowPress(row)}>
                    <View style={[
                        styles.row,
                        selectedRows.some((selectedRow) => selectedRow.id === row.id) && { backgroundColor: 'lightblue' },
                    ]}>
                        <View style={styles.cell}>
                            <Text>{++rowIndex}</Text>
                        </View>
                        <View style={styles.cell}>
                            <Text numberOfLines={1} ellipsizeMode="tail" textBreakStrategy="simple">{resData[rowIndex]?.product_name}</Text>
                        </View>
                        <View style={styles.cell}>
                            <Text>{resData[rowIndex]?.quantity}</Text>
                        </View>
                        <View style={styles.cell}>
                            <Text>{resData[rowIndex]?.price * resData[rowIndex]?.quantity}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
            <View style={{ margin: 10 }}>
                <Pressable disabled={selectedRows.length === 0} style={{ ...styles.button, width: 150, display: `${selectedRows.length === 0 ? 'none' : 'block'}`, backgroundColor: 'blue' }} onPress={handelModalOpen}>
                    <Text style={styles.text}>Redaktə et</Text>
                </Pressable>
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
                                        value={new Date(date)}
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
                                value={customer}
                                onChangeText={setCustomer}
                            />
                            <View style={{ marginVertical: 10 }}>
                                <View style={{ ...styles.row, marginHorizontal: 10 }}>
                                    {editHeaders.map((header, rowIndex) => (
                                        <View style={styles.cell} key={`row_${rowIndex}`}>
                                            <Text>{header}</Text>
                                        </View>
                                    ))}
                                </View>
                                {selectedRows.map((row, rowIndex) => (
                                    <View style={{ ...styles.row, marginHorizontal: 10 }} key={`row_${rowIndex}`}>
                                        <View style={styles.cell}>
                                            <Text>{++rowIndex}</Text>
                                        </View>
                                        <View style={styles.cell}>
                                            <TextInput
                                                placeholder='Qiymət'
                                                keyboardType="numeric"
                                                value={String(selectedRows[rowIndex]?.price)}
                                                onChangeText={(text) => handleInputChange(rowIndex, 'price', text)}
                                            />
                                        </View>
                                        <View style={styles.cell}>
                                            <TextInput
                                                placeholder='Miqdar'
                                                keyboardType="numeric"
                                                value={String(selectedRows[rowIndex]?.quantity)}
                                                onChangeText={(text) => handleInputChange(rowIndex, 'quantity', text)}
                                            />
                                        </View>
                                        <View style={styles.cell}>
                                            <TextInput
                                                placeholder='Malın adı'
                                                value={String(selectedRows[rowIndex]?.product_name)}
                                                onChangeText={(text) => handleInputChange(rowIndex, 'product_name', text)}
                                            />
                                        </View>
                                        <View style={styles.cell}>
                                            <TextInput
                                                placeholder='Ölçü vahidi'
                                                value={String(selectedRows[rowIndex]?.units)}
                                                onChangeText={(text) => handleInputChange(rowIndex, 'units', text)}
                                            />
                                        </View>
                                        <View style={styles.cell}>
                                            <Text>
                                                {
                                                    isNaN(selectedRows[rowIndex]?.price && selectedRows[rowIndex]?.quantity) ? '000' : selectedRows[rowIndex]?.price * selectedRows[rowIndex]?.quantity
                                                }
                                            </Text>
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
            </Modal>
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
import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, ScrollView, Pressable, Text, Alert, Modal, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import UserInput from "../components/UserInput";
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { fetchData } from '../services/Server';
import { addRow, formatDateString } from '../services/Functions';
import { sendRequest, deleteData, editData } from '../services/Server';

const Invoce = () => {
    const [number, setNumber] = useState();
    const [data, setResData] = useState([]);
    const [show, setShow] = useState(false);
    const [customer, setCustomer] = useState();
    const [rowData, setRowData] = useState([]);
    const [date, setDate] = useState(new Date());
    const [tableData, setTableData] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [formTable, setFormTable] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [edv, setEdv] = useState(0);
    const [wholeAmout, setWholeAmount] = useState(0);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
    const [updateData, setUpdateData] = useState({
        product_name: '',
        quantity: '',
        price: '',
        units: '',
        customer: ''
        // wholeAmout: ''
    });

    let [fontsLoad] = useFonts({ 'Medium': require('../assets/fonts/static/Montserrat-Medium.ttf') })

    let count = 0;
    let rowCount = 0;
    const headers = ["№", "Malın adı", "Miqdar", "Qiymət", "Ölçü vahidi", "Məbləğ"];
    const showDatepicker = () => { setShow(true) };
    const handlePress = () => { setModalVisible(true) }

    useEffect(() => {
        const fetchDataAsync = async () => {
            try {
                const result = await fetchData('invoice');
                setResData(result);
                setTableData(result);
            } catch (error) {
                console.error(error);
            }
        };

        fetchDataAsync();
    }, []);

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

    const handleAddRow = () => { addRow(setRowData) };
    const handleDate = () => { formatDateString(dateStr) }
    const closeUpdateModal = () => { setUpdateModalVisible(false) }

    const sendData = async () => {
        let apiUrl = '/invoice'
        const postData = {
            date: formatDateString(date),
            number: lastId,
            customer: customer,
            formTable: formTable,
        };
        const result = await sendRequest(apiUrl, postData);

        if (result.success) {
            Alert.alert(result.message);
            setModalVisible(false);
        }
        else Alert.alert(result.message);
    }

    const onChange = (event, selectedDate) => {
        let currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        let formattedDate = `${selectedDate.getDate()}.${selectedDate.getMonth() + 1}.${selectedDate.getFullYear()}`
        setDate(formattedDate)
    };

    const closeModal = () => {
        setModalVisible(false)
        setCustomer()
        setDate(new Date())
        setFormTable([])
        setRowData([])
    }

    const deleteRow = async () => {
        let id = updateData.id
        let tableName = 'invoice';
        const result = await deleteData(id, tableName)
        if (result.success) {
            Alert.alert(result.message);
            setUpdateModalVisible(false)
        }
        else Alert.alert(result.message);
    }

    const handleRowPress = (row) => {
        // setselectedRows(row);
        // setUpdateData({
        //     id: row.id,
        //     product_name: row.product_name,
        //     quantity: row.quantity,
        //     price: row.price.toString(),
        //     units: row.units,
        //     customer: row.customer,
        // });
        // setUpdateModalVisible(true);

        const isSelected = selectedRows.some((selectedRow) => selectedRow.id === row.id);

        if (isSelected) {
            const updatedSelectedRows = selectedRows.filter((selectedRow) => selectedRow.id !== row.id);
            setSelectedRows(updatedSelectedRows);
            // setButtonDisable(false)
        } else {
            setSelectedRows([...selectedRows, row]);
        }
    };

    const handleUpdate = async () => {
        let id = updateData.id
        let tableName = 'invoice'

        const result = await editData(id, updateData, tableName)
        if (result.success) {
            Alert.alert(result.message);
            setUpdateModalVisible(false)
        }
        else Alert.alert(result.message);
    }

    const handleInputChange = (field, value) => {
        setUpdateData((prevUpdateData) => ({
            ...prevUpdateData,
            [field]: value,
        }));
    };

    const handelModalOpen = () => { setUpdateModalVisible(true) }
    let id = tableData.map((item) => item.id);
    let lastId = 1 + id.pop();

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical: 15, marginVertical: 20, }}>
            <Text style={{ textAlign: 'center', fontFamily: 'Medium', fontSize: 32 }}>Qaimələr</Text>
            <View style={{ marginVertical: 20, marginHorizontal: 10 }}>
                <Pressable style={{ ...styles.button, width: 250 }} onPress={handlePress}>
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
                                value={String(lastId)}
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
                    <View style={{ marginVertical: 20, marginHorizontal: 10 }}>
                        <View>
                            <Pressable style={styles.button} onPress={handleAddRow}>
                                <Text style={styles.text}>+</Text>
                            </Pressable>
                        </View>
                    </View>
                    <View style={{ ...styles.row, marginHorizontal: 10 }}>
                        {headers.map((header) => (
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
                                    keyboardType="text"
                                    value={formTable[rowIndex]?.units}
                                    onChangeText={(text) => handleTableInputChange(rowIndex, 'units', text)}
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
                                        <Text numberOfLines={1} ellipsizeMode="tail" textBreakStrategy="simple">{item.product_name}</Text>
                                    </View>
                                    <View style={styles.cell}>
                                        <Text>{item.quantity}</Text>
                                    </View>
                                    <View style={styles.cell}>
                                        <Text>{item.price}</Text>
                                    </View>
                                    <View style={styles.cell}>
                                        <Text>{item.units}</Text>
                                    </View>
                                    <View style={styles.cell}>
                                        <Text>{item.price * item.quantity}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <View style={{ margin: 10 }}>
                    <Pressable disabled={selectedRows.length === 0} style={{ ...styles.button, width: 150, display: `${selectedRows.length === 0 ? 'none' : 'block'}`, backgroundColor: 'blue' }} onPress={handelModalOpen}>
                        <Text style={styles.text}>Redaktə et</Text>
                    </Pressable>
                </View>
            </View>
            <Modal visible={isUpdateModalVisible} animationType="slide">
                <ScrollView contentContainerStyle={{ marginVertical: 10 }} >
                    <View style={{ padding: 5 }}>
                        <Text style={{ textAlign: 'right' }} onPress={closeUpdateModal} ><Ionicons name="close" size={24} color="red" /></Text>
                    </View>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={{ display: 'none' }}>{updateData.id}</Text>
                            {/* <UserInput
                                name={'Malın adı'}
                                style={styles.input}
                                placeholder='Malın adı'
                                keyboardType="text"
                                value={updateData.product_name}
                                autoCompleteType="text"
                                setValue={(text) => handleInputChange('product_name', text)}
                            />
                            <UserInput
                                name={'Müştəri'}
                                style={styles.input}
                                placeholder='Müştəri'
                                keyboardType="text"
                                value={updateData.customer}
                                autoCompleteType="text"
                                setValue={(text) => handleInputChange('customer', text)}
                            />
                            <UserInput
                                name={'Miqdarı'}
                                style={styles.input}
                                placeholder='Miqdarı'
                                keyboardType="text"
                                value={updateData.quantity.toString()}
                                autoCompleteType="text"
                                setValue={(text) => handleInputChange('quantity', text)}
                            />
                            <UserInput
                                name={'Ölçü vahidi'}
                                style={styles.input}
                                placeholder='Ölçü vahidi'
                                keyboardType="text"
                                value={updateData.units}
                                autoCompleteType="text"
                                setValue={(text) => handleInputChange('units', text)}
                            />
                            <UserInput
                                name={'Qiymət'}
                                style={styles.input}
                                placeholder='Qiymət'
                                keyboardType="numeric"
                                value={updateData.price}
                                autoCompleteType="numeric"
                                setValue={(text) => handleInputChange('price', text)}
                            /> */}
                            <View style={{ ...styles.row, marginHorizontal: 10 }}>
                                {headers.map((header) => (
                                    <View style={styles.cell}>
                                        <Text bold center>{header}</Text>
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
                                            placeholder='Malın adı'
                                            keyboardType="text"
                                            value={selectedRows[rowIndex]?.product_name}
                                            onChangeText={(text) => handleTableInputChange(rowIndex, 'product_name', text)}
                                        />
                                    </View>
                                    <View style={styles.cell}>
                                        <TextInput
                                            placeholder='Miqdar'
                                            keyboardType="numeric"
                                            value={String(selectedRows[rowIndex]?.quantity)}
                                            onChangeText={(text) => handleTableInputChange(rowIndex, 'quantity', text)}
                                        />
                                    </View>
                                    <View style={styles.cell}>
                                        <TextInput
                                            placeholder='Qiymət'
                                            keyboardType="numeric"
                                            value={String(selectedRows[rowIndex]?.price)}
                                            onChangeText={(text) => handleTableInputChange(rowIndex, 'price', text)}
                                        />
                                    </View>
                                    <View style={styles.cell}>
                                        <TextInput
                                            placeholder='Ölçü vahidi'
                                            keyboardType="text"
                                            value={selectedRows[rowIndex]?.units}
                                            onChangeText={(text) => handleTableInputChange(rowIndex, 'units', text)}
                                        />
                                    </View>
                                    <View style={styles.cell}>
                                        <Text>{
                                            isNaN(selectedRows[rowIndex]?.price && selectedRows[rowIndex]?.quantity) ? '000' : parseFloat(selectedRows[rowIndex]?.price * selectedRows[rowIndex]?.quantity)
                                        }</Text>
                                    </View>
                                </View>
                            ))}
                            <View style={{ alignItems: 'flex-end', margin: 10 }}>
                                <Text style={{ ...styles.text, color: '#333' }}>Məbləğ: <Text>{isNaN(totalAmount) ? '000' : totalAmount}</Text></Text>
                                <Text style={{ ...styles.text, color: '#333' }}>Ədv:    <Text>{isNaN(edv) ? '000' : edv}</Text></Text>
                                <Text style={{ ...styles.text, color: '#333' }}>Toplam: <Text>{isNaN(wholeAmout) ? '000' : wholeAmout}</Text></Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ margin: 10 }}>
                                    <Pressable style={{ ...styles.button, width: 150, backgroundColor: 'red' }} onPress={deleteRow}>
                                        <Text style={styles.text}>Sil</Text>
                                    </Pressable>
                                </View>
                                <View style={{ margin: 10 }}>
                                    <Pressable style={{ ...styles.button, width: 150 }} onPress={handleUpdate}>
                                        <Text style={styles.text}>Yenilə</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </Modal>

            {/* <View style={{ alignItems: 'flex-end', margin: 10 }}>
                <Text>Məbləğ: <Text>{isNaN(totalSum) ? tableSum : totalSum}</Text></Text>
                <Text>Ədv:    <Text>{edv}</Text></Text>
                <Text>Toplam: <Text>{wholeAmout}</Text></Text>
            </View> */}
            {/* <View style={{ alignItems: 'flex-end', margin: 10 }}>
                <Pressable style={{ ...styles.button, width: 150 }} >
                    <Text style={styles.text}>Təsdiq et</Text>
                </Pressable>
            </View> */}
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
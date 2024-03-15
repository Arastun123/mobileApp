import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, ScrollView, Text, Modal, TextInput, Pressable, StyleSheet, Alert, TouchableOpacity, LogBox } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFonts } from "expo-font";
import { Ionicons } from '@expo/vector-icons';
import { addRow, removeLastRow } from '../services/Functions';
import { fetchData, sendRequest, deleteData, sendEditData, autoFill } from '../services/Server';
import { SwipeListView } from 'react-native-swipe-list-view';


const Orders = () => {
    const [resData, setData] = useState([]);
    const [rowData, setRowData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [date, setDate] = useState(new Date());
    const [number, setNumber] = useState();
    const [customer, setCustomer] = useState();
    const [formTable, setFormTable] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [edv, setEdv] = useState(0);
    const [wholeAmout, setWholeAmount] = useState(0);
    const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
    const [showDatepicker, setShowDatepicker] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [activeInputIndex, setActiveInputIndex] = useState(null);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [isPressed, setIsPressed] = useState(false);
    const secondInput = useRef();
    const inputRefs = useRef([]);
    const [rowsSameCustomer, setRowsSameCustomer] = useState([]);
    const [selectedRowData, setSelectedRowData] = useState(null);


    let [fontsLoad] = useFonts({ 'Medium': require('../assets/fonts/static/Montserrat-Medium.ttf') });
    const headers = ["№", "Malın adı", "Miqdarı", "Qiymət", "Ölçü vahidi", "Məbləğ"];
    const mainHeaders = ["№", "Nömrəsi", "Müştəri", "Tarix", "Məbləğ"];
    const editHeaders = ["№", "Qiymət", "Miqdarı", "Malın adı", "Ölçü vahidi", "Məbləğ"];
    let rowCount = 0;
    let inputCount = 0;
    LogBox.ignoreLogs(['Warning: Failed prop type: Invalid prop `value` of type `date` supplied to `TextInput`, expected `string`'])

    useEffect(() => {
        fetchDataAsync();
    }, []);

    useEffect(() => {
        formTable.forEach((item, index) => {
            let name = item.product_name;
            if (name && name.length > 0) {
                searchProduct(name, index);
            } else {
                setSearchResults((prevResults) => {
                    const updatedResults = [...prevResults];
                    updatedResults[index] = null;
                    return updatedResults;
                });
            }
        });
    }, [formTable, searchProduct, setSearchResults]);

    const fetchDataAsync = async () => {
        try {
            const result = await fetchData('orders', 'true');
            if (result !== null) { setData(result) }
        } catch (error) {
            console.error(error);
        }
    };

    const searchProduct = useCallback(async (query, index) => {
        let tableName = 'nomenklatura';
        try {
            const response = await autoFill(tableName, query);
            if (response) {
                setSearchResults((prevResults) => {
                    const updatedResults = [...prevResults];
                    updatedResults[index] = response;
                    return updatedResults;
                });
            } else {
                console.error("Undefined");
            }
        } catch (error) {
            console.error(error);
        }
    }, [setSearchResults]);


    let id = resData.map((item) => item.id);
    let lastId = 1 + id.pop();

    if (!fontsLoad) { return null }
    const handleDateShow = () => { setShowDatepicker(true) };

    const handleAddRow = () => {
        addRow(setRowData)
    };

    const handleRemoveRow = () => {
        removeLastRow(setRowData);
        setSearchResults([])
    };

    const handlePress = () => {
        setModalVisible(true);
        handleAddRow();
        let today = new Date();
        let formattedToday = today.toISOString().split('T')[0];
        setDate(formattedToday);
    }

    const closeUpdateModal = () => {
        setUpdateModalVisible(false);
        setCustomer();
        setDate(new Date());
    }

    const handleModalOpen = () => {
        setUpdateModalVisible(true);
        if (selectedRows.length === 1) {
            let customer = selectedRows.map(item => item.customer)
            setCustomer(customer[0]);
            let date = selectedRows.map(item => item.date)
            setDate(date[0])
        }
    }

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
        let apiUrl = '/orders';

        if (
            !date ||
            !customer ||
            formTable.length === 0 ||
            formTable.some(entry => !entry.quantity || !entry.price || !entry.product_name || !entry.units)
        ) {
            Alert.alert('Məlumatları daxil edin!');
            return;
        }

        const postData = {
            date: date,
            number: isNaN(lastId) ? '1' : lastId,
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

    const deleteRow = async (id, check) => {
        const idsToDelete = rowsSameCustomer.map((row) => row.id);
        const tableName = 'orders';
        if (check === true) {
            try {
                const result = await deleteData(id, tableName);
                const updatedSelectedRows = rowsSameCustomer.filter((selectedRow) => selectedRow.id !== id);
                setRowsSameCustomer(updatedSelectedRows);
                fetchDataAsync();
                if (updatedSelectedRows.length === 0) {
                    Alert.alert('Məlumatlar silindi');
                    setUpdateModalVisible(false)
                    setSelectedRows([]);
                    setSelectedRowId(null);
                }
            } catch (error) {
                console.error(error);
            }
        }
        else {
            try {
                for (const idToDelete of idsToDelete) {
                    const result = await deleteData(idsToDelete, tableName);
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
        }

    };

    const closeModal = () => {
        setModalVisible(false)
        setDate(new Date())
        setRowData([])
        setFormTable([])
        fetchDataAsync()
        setSearchResults([])
    }

    const handleInputChange = (index, field, value) => {
        let newRowData = [...rowsSameCustomer];

        newRowData[index] = {
            ...newRowData[index],
            [field]: value,
        };

        setRowsSameCustomer(newRowData);
    };

    const handleEdit = async () => {
        let tableName = 'orders';
        const dateObject = new Date(date);

        const updatedRows = rowsSameCustomer.map(item => {
            return {
                id: item.id,
                quantity: item.quantity || 0,
                price: item.price || 0,
                product_name: item.product_name || '',
                units: item.units || '',
            };
        });
        let newData = {
            date: dateObject.toISOString().split('T')[0],
            customer,
            number,
            newUpdatedRows: updatedRows,
        }
        try {
            const result = await sendEditData(newData, tableName);
            if (result.success) {
                Alert.alert(result.message);
                setUpdateModalVisible(false);
                setRowsSameCustomer([]);
                fetchDataAsync();
                setSelectedRowId(null);
            } else {
                setSelectedRows([]);
                Alert.alert(result.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleRowPress = (row) => {
        const isSelected = selectedRowId === row.id;

        if (isSelected) {
            setSelectedRowId(null);
            setSelectedRowData(null);
        } else {
            setSelectedRowId(row.id);

            let selectedRow = resData.filter((item) => item.number === row.number);
            let customer = selectedRow.map((item) => item.customer)[0] || '';
            setCustomer(customer);

            let date = selectedRow.map((item) => item.date)[0] || '';
            setDate(date);

            let number = selectedRow.map((item) => item.number)[0] || '';
            setNumber(number);

            setRowsSameCustomer(selectedRow);
            setSelectedRowData(selectedRow);
        }
    };

    const handleAutoFill = (rowIndex, selectedResult, inputNumber) => {
        const updatedFormTable = [...formTable];
        updatedFormTable[rowIndex].product_name = selectedResult.name;
        setFormTable(updatedFormTable);

        setSearchResults((prevResults) => {
            const updatedResults = [...prevResults];
            updatedResults[rowIndex] = [];
            return updatedResults;
        });

        setActiveInputIndex(null);

        if (selectedResult.name !== formTable[rowIndex]?.product_name) {
            searchProduct(selectedResult.name);
        }
        setIsPressed(!isPressed);
        setSearchResults([]);

        // const nextInputIndex = rowIndex * 4 + 1;
        if (inputRefs.current[inputNumber]) {
            inputRefs.current[inputNumber].focus();
        }
    };


    const focusInputRefs = (index) => {
        const rowIndex = Math.floor(index / 4);
        const columnIndex = index % 4;

        let nextIndex = -1;

        if (columnIndex === 3) {
            nextIndex = (rowIndex + 1) * 4;
        } else {
            nextIndex = index + 1;
        }

        if (inputRefs.current[nextIndex]) {
            inputRefs.current[nextIndex].focus();
        }
    };

    const groupedRows = {};

    resData.forEach((item) => {
        const number = item.number;

        if (!groupedRows[number]) groupedRows[number] = {
            customer: item.customer,
            sum: 0,
            number: item.number,
            date: item.date,
            id: item.id,
            rows: []
        };
        groupedRows[number].sum += item.price * item.quantity;
        groupedRows[number].rows.push(item);
    });

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
                                    value={date.toString()}
                                    onChangeText={setDate}
                                    editable={false}
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
                        <View key={`row_${rowIndex}`}>
                            <View style={{ ...styles.row, marginHorizontal: 10 }}>
                                <View style={styles.cell}>
                                    <Text>{++rowCount}</Text>
                                </View>
                                <View style={styles.cell}>
                                    <TextInput
                                        placeholder='Malın adı'
                                        value={formTable[rowIndex]?.product_name}
                                        onChangeText={(text) => {
                                            handleTableInputChange(rowIndex, 'product_name', text);
                                            setActiveInputIndex(rowIndex, rowCount + 2);
                                        }}
                                        ref={(ref) => (inputRefs.current[rowCount + 1] = ref)}
                                        onSubmitEditing={() => focusInputRefs(rowCount + 1)}
                                    />
                                </View>
                                <View style={styles.cell}>
                                    <TextInput
                                        placeholder='Miqdar'
                                        keyboardType="numeric"
                                        value={formTable[rowIndex]?.quantity}
                                        onChangeText={(text) => handleTableInputChange(rowIndex, 'quantity', text)}
                                        ref={(ref) => (inputRefs.current[rowCount + 2] = ref)}
                                        onSubmitEditing={() => focusInputRefs(rowCount + 2)}
                                    />
                                </View>
                                <View style={styles.cell}>
                                    <TextInput
                                        placeholder='Qiymət'
                                        keyboardType="numeric"
                                        value={formTable[rowIndex]?.price}
                                        onChangeText={(text) => handleTableInputChange(rowIndex, 'price', text)}
                                        ref={(ref) => (inputRefs.current[rowCount + 3] = ref)}
                                        onSubmitEditing={() => focusInputRefs(rowCount + 3)}
                                    />
                                </View>
                                <View style={styles.cell}>
                                    <TextInput
                                        placeholder='Ölçü vahidi'
                                        value={formTable[rowIndex]?.units}
                                        onChangeText={(text) => handleTableInputChange(rowIndex, 'units', text)}
                                        ref={(ref) => (inputRefs.current[rowCount + 4] = ref)}
                                        onSubmitEditing={() => focusInputRefs(rowCount)}
                                    />
                                </View>
                                <View style={styles.cell}>
                                    <Text>
                                        {isNaN(formTable[rowIndex]?.price * formTable[rowIndex]?.quantity) ? '000' : parseFloat(formTable[rowIndex]?.price * formTable[rowIndex]?.quantity)}
                                    </Text>
                                </View>
                            </View>
                            <View style={{
                                ...styles.box,
                                backgroundColor: '#f0f0f0',
                                borderStyle: 'dotted',
                                shadowColor: '#aaa',
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.5,
                                shadowRadius: 3,
                                elevation: 2,
                            }}>
                                {(searchResults[rowIndex]?.length > 0 && activeInputIndex === rowIndex) && (
                                    searchResults[rowIndex].map((result, index) => (
                                        <TouchableOpacity
                                            style={{
                                                ...styles.text,
                                                borderStyle: 'dotted',
                                                // borderBottomWidth: 1,
                                                backgroundColor: index % 2 === 0 ? '#f0f0f0' : 'white',
                                            }}
                                            key={result.id}
                                            onPress={() => handleAutoFill(rowIndex, result)}
                                        >
                                            <Text style={{ padding: 5, }}>
                                                {result.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))
                                )}
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
            </Modal >

            <View style={{ ...styles.row }}>
                {mainHeaders.map((header, rowIndex) => (
                    <View style={styles.cell} key={`row_${rowIndex}`}>
                        <Text numberOfLines={1} ellipsizeMode="tail" textBreakStrategy="simple" style={{ fontWeight: 600 }}>{header}</Text>
                    </View>
                ))}
            </View>

            {Object.keys(groupedRows).map((number, index) => (
                <TouchableOpacity key={`row_${number}`} onPress={() => handleRowPress(groupedRows[number])}
                    style={[
                        styles.row,
                        selectedRowId === groupedRows[number].id && { backgroundColor: 'lightblue' },
                    ]}
                >
                    <View style={styles.cell}>
                        <Text>{++rowCount}</Text>
                    </View>
                    <View style={styles.cell}>
                        <Text>{groupedRows[number].number}</Text>
                    </View>
                    <View style={styles.cell}>
                        <Text>{groupedRows[number].customer}</Text>
                    </View>
                    <View style={styles.cell}>
                        <Text>{groupedRows[number].date}</Text>
                    </View>
                    <View style={styles.cell}>
                        <Text>{groupedRows[number].sum}</Text>
                    </View>
                </TouchableOpacity>
            ))}

            <View style={{ margin: 10, display: `${selectedRowId ? 'flex' : 'none'}`, flexDirection: 'row' }}>
                <Pressable style={{ ...styles.button, width: 150, backgroundColor: 'blue' }} onPress={handleModalOpen}>
                    <Text style={styles.text}>Redaktə et</Text>
                </Pressable>
            </View>

            <Modal visible={isUpdateModalVisible} animationType="slide">
                <ScrollView contentContainerStyle={{ marginVertical: 10 }} >
                    <View style={{ padding: 5 }}>
                        <Text style={{ textAlign: 'right' }} onPress={closeUpdateModal} ><Ionicons name="close" size={24} color="red" /></Text>
                    </View>
                    <View style={styles.modalContent}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <TextInput
                                    style={{ ...styles.input, width: 100 }}
                                    placeholder="Gün-Ay-İl"
                                    keyboardType="numeric"
                                    value={new Date(date).toDateString()}
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
                                value={String(number)}
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
                            <SwipeListView
                                data={rowsSameCustomer}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={{ ...styles.row, marginHorizontal: 10, backgroundColor: '#fff' }} key={`row_${index}`}>
                                        <View style={styles.cell}>
                                            <Text>{++rowCount}</Text>
                                        </View>
                                        <View style={styles.cell}>
                                            <TextInput
                                                placeholder='Qiymət'
                                                keyboardType="numeric"
                                                value={String(item.price)}
                                                onChangeText={(text) => handleInputChange(index, 'price', text)}
                                                ref={(ref) => (inputRefs.current[rowCount + 1] = ref)}
                                                onSubmitEditing={() => focusInputRefs(rowCount + 1)}
                                            />
                                        </View>
                                        <View style={styles.cell}>
                                            <TextInput
                                                placeholder='Miqdar'
                                                keyboardType="numeric"
                                                value={String(item.quantity)}
                                                onChangeText={(text) => handleInputChange(index, 'quantity', text)}
                                                ref={(ref) => (inputRefs.current[rowCount + 2] = ref)}
                                                onSubmitEditing={() => focusInputRefs(rowCount + 2)}
                                            />
                                        </View>
                                        <View style={styles.cell}>
                                            <TextInput
                                                placeholder='Malın adı'
                                                value={item.product_name}
                                                onChangeText={(text) => handleInputChange(index, 'product_name', text)}
                                                ref={(ref) => (inputRefs.current[rowCount + 3] = ref)}
                                                onSubmitEditing={() => focusInputRefs(rowCount + 3)}
                                            />
                                        </View>
                                        <View style={styles.cell}>
                                            <TextInput
                                                placeholder='Ölçü vahidi'
                                                value={item.units}
                                                onChangeText={(text) => handleInputChange(index, 'units', text)}
                                                ref={(ref) => (inputRefs.current[rowCount + 4] = ref)}
                                                onSubmitEditing={() => focusInputRefs(rowCount)}
                                            />
                                        </View>
                                        <View style={styles.cell}>
                                            <Text> {isNaN(item.price && item.quantity) ? '000' : item.price * item.quantity} </Text>
                                        </View>
                                    </View>
                                )}
                                renderHiddenItem={({ item, index }) => (
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <TouchableOpacity style={{ backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', width: 75 }} onPress={() => deleteRow(item.id, true)}>
                                            <Text style={{ color: 'white' }}>Sil</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                                leftOpenValue={70}
                                rightOpenValue={0}
                            />
                        </View>
                        {/* <View style={{ alignItems: 'flex-end', margin: 10 }}>
                            <Text style={{ ...styles.text, color: '#333' }}>Məbləğ: <Text>{isNaN(editTableAmount) ? '000' : editTableAmount}</Text></Text>
                            <Text style={{ ...styles.text, color: '#333' }}>Ədv:    <Text>{isNaN(editTableEdv) ? '000' : editTableEdv}</Text></Text>
                            <Text style={{ ...styles.text, color: '#333' }}>Toplam: <Text>{isNaN(editTableAmountAll) ? '000' : editTableAmountAll}</Text></Text>
                        </View> */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ margin: 10 }}>
                                <Pressable style={{ ...styles.button, width: 150 }} onPress={handleEdit}>
                                    <Text style={styles.text}>Yenilə</Text>
                                </Pressable>
                            </View>
                            <View style={{ margin: 10, textAlign: 'right' }}>
                                <Pressable style={{ ...styles.button, width: 150, backgroundColor: 'red' }} onPress={deleteRow}>
                                    <Text style={styles.text}>Sil</Text>
                                </Pressable>
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
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'Medium'
    },
    box: { marginHorizontal: 10 }
});
export default Orders;
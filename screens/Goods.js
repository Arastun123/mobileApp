import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, ScrollView, Pressable, Text, Alert, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { fetchData } from '../services/Server';
import { addRow, removeLastRow } from '../services/Functions';
import { sendRequest, deleteData, sendEditData } from '../services/Server';

const Goods = () => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [resData, setResData] = useState([]);
    const [rowData, setRowData] = useState([]);
    const [formTable, setFormTable] = useState([]);
    const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);

    let [fontsLoad] = useFonts({ 'Medium': require('../assets/fonts/static/Montserrat-Medium.ttf') })
    let count = 0;
    let rowCount = 0;
    const headers = ["№", "Məhsulun adı"];
    const handlePress = () => { setModalVisible(true); handleAddRow() }
    const handleAddRow = () => { addRow(setRowData) };
    const handleModalOpen = () => { setUpdateModalVisible(true); }
    const closeUpdateModal = () => { setUpdateModalVisible(false) }
    const handleRemoveRow = () => { removeLastRow(setRowData) };

    useEffect(() => { fetchDataAsync() }, []);

    const fetchDataAsync = async () => {
        try {
            const result = await fetchData('products');
            setResData(result);
        } catch (error) {
            console.error(error);
        }
    };

    const handleTableInputChange = (index, field, value) => {
        let newData = [...formTable];
        newData[index] = {
            ...newData[index],
            [field]: value,
        };

        setFormTable((prevFormTable) => {
            return newData;
        });
    };

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

    const sendData = async () => {
        let apiUrl = '/products'

        if (
            formTable.length === 0 ||
            formTable.some(entry => !entry.name )
        ) {
            Alert.alert('Məlumatları daxil edin!');
            return;
        }

        const postData = {
            formTable: formTable,
        };
        const result = await sendRequest(apiUrl, postData);
        if (result.success) {
            Alert.alert(result.message);
            setModalVisible(false);
            setRowData([])
            setFormTable([])
            fetchDataAsync()
        }
        else Alert.alert(result.message);
    };

    const closeModal = () => {
        setModalVisible(false);
        setRowData([]);
        setFormTable([]);
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

    const handleEdit = async () => {
        let selectedRowData = selectedRows.map((item) => ({ id: item.id, name: item.name }))
        let tableName = 'products';
        try {
            const result = await sendEditData(selectedRowData, tableName);
            if (result.success) {
                Alert.alert(result.message);
                setUpdateModalVisible(false);
                setSelectedRows([]);
                fetchDataAsync();
                closeModal()
            } else {
                setSelectedRows([]);
                Alert.alert(result.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const deleteRow = async () => {
        const idsToDelete = selectedRows.map((row) => row.id);
        const tableName = 'products';

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
            fetchDataAsync();
            setUpdateModalVisible(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical: 15, marginVertical: 20, }}>
            <Text style={{ textAlign: 'center', fontFamily: 'Medium', fontSize: 32 }}>Məhsullar</Text>
            <View style={{ marginVertical: 20, marginHorizontal: 10 }}>
                <Pressable style={{ ...styles.button, width: 250, }} onPress={handlePress}>
                    <Text style={styles.text}>Yeni Məhsul əlavə et</Text>
                </Pressable>
            </View>
            <Modal visible={isModalVisible} animationType="slide">
                <ScrollView>
                    <View style={{ margin: 10 }} >
                        <View style={{ padding: 5 }}>
                            <Text style={{ textAlign: 'right' }} onPress={closeModal} ><Ionicons name="close" size={24} color="red" /></Text>
                        </View>
                    </View>
                    <View style={{ marginVertical: 20, marginHorizontal: 10, flexDirection: 'row' }}>
                        <View>
                            <Pressable style={styles.button} onPress={handleAddRow}>
                                <Text style={styles.text}>+</Text>
                            </Pressable>
                        </View>
                        <View style={{ marginHorizontal:10 }} >
                            <Pressable style={styles.button} onPress={handleRemoveRow}>
                                <Text style={styles.text}>-</Text>
                            </Pressable>
                        </View>
                    </View>
                    <View style={{ ...styles.row, marginHorizontal: 10 }}>
                        {headers.map((header, rowIndex) => (
                            <View style={styles.cell} key={`row_${rowIndex}`}>
                                <Text>{header}</Text>
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
                                    placeholder='Məhsulun adı'
                                    value={formTable[rowIndex]?.name}
                                    onChangeText={(text) => handleTableInputChange(rowIndex, 'name', text)}
                                />
                            </View>
                        </View>
                    ))}
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
                                <Text style={{ fontWeight: 600, textAlign: 'center', }}>{header}</Text>
                            </View>
                        ))}
                    </View>
                    <View>
                        {resData.map((item, rowIndex) => (
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
                                        <Text>{item.name}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <View style={{ margin: 10 }}>
                    <Pressable disabled={selectedRows.length === 0} style={{ ...styles.button, width: 150, display: `${selectedRows.length === 0 ? 'none' : 'block'}`, backgroundColor: 'blue' }} onPress={handleModalOpen}>
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
                                            placeholder='Məhsulun adı'
                                            value={selectedRows[rowIndex]?.name}
                                            onChangeText={(text) => handleInputChange(rowIndex, 'name', text)}
                                        />
                                    </View>
                                </View>
                            ))}
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
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
        fontFamily: 'Medium'
    },
});
export default Goods;
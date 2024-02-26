import React, { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet, Pressable, Text, TouchableOpacity, Modal, TextInput, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import Physical from "../components/Physical";
import Legal from "../components/Legal";
import { useFonts } from "expo-font";
import { fetchData, deleteData, sendEditData } from '../services/Server';

const Kontragent = ({ selectedLocation }) => {
    const [selectedType, setSelectedType] = useState(null);
    const [resData, setData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);

    let [fontsLoad] = useFonts({ 'Medium': require('../assets/fonts/static/Montserrat-Medium.ttf') });

    useEffect(() => { fetchDataAsync() }, []);

    const fetchDataAsync = async () => {
        try {
            const result = await fetchData('kontragent');
            if (result !== null) setData(result);
        } catch (error) {
            console.error(error);
        }
    };
    fetchDataAsync();

    const handlePress = (type) => { setSelectedType(type) };
    const handleRefresh = () => { fetchDataAsync() };
    const closeUpdateModal = () => { setUpdateModalVisible(false) }

    const headers = ["№", "Adı", "Əlaqə nömrəsi", "Vöen", "Ünvan", "Növü"];
    let rowCount = 0;

    if (!fontsLoad) { return null }

    const handelModalOpen = () => { setUpdateModalVisible(true); }

    const deleteRow = async () => {
        const idsToDelete = selectedRows.map((row) => row.id);
        const tableName = 'kontragent';

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
        // console.log(updatedSelectedRows);
        setSelectedRows(updatedSelectedRows);
    };

    const handleEdit = async () => {
        let tableName = 'kontragent';
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

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'start', paddingVertical: 35, marginVertical: 20, marginHorizontal: 10 }}>
            <Text style={{ marginBottom: 10, textAlign: 'center', fontFamily: 'Medium', fontSize: 32 }}>Kontragent</Text>
            <TouchableOpacity onPress={handleRefresh}>
                <View>
                    <Text style={{ textAlign: "right", fontWeight: "bold" }}> <Ionicons name="reload" size={16} color="#333" />  </Text>
                </View>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
                <Pressable style={{ ...styles.button, width: 150 }} onPress={() => handlePress('fiziki')}>
                    <Text style={styles.text}>Fiziki şəxs</Text>
                </Pressable>

                <Pressable style={{ ...styles.button, width: 150 }} onPress={() => handlePress('huquqi')}>
                    <Text style={styles.text}>Hüquqi şəxs</Text>
                </Pressable>
            </View>

            {selectedType === 'fiziki' && <Physical selectedLocation={selectedLocation} />}
            {selectedType === 'huquqi' && <Legal selectedLocation={selectedLocation} />}

            <View style={{ marginVertical: 10 }}>
                <Text style={{ marginBottom: 10, textAlign: 'center', fontSize: 24 }}>Müqavilələr</Text>
                <View style={{ ...styles.row }}>
                    {headers.map((header, rowIndex) => (
                        <View style={styles.cell} key={`row_${rowIndex}`}>
                            <Text numberOfLines={1} ellipsizeMode="tail" textBreakStrategy="simple">{header}</Text>
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
                                <Text>{++rowCount}</Text>
                            </View>
                            <View style={styles.cell}>
                                <Text> {resData[rowIndex]?.name}</Text>
                            </View>
                            <View style={styles.cell}>
                                <Text numberOfLines={1} ellipsizeMode="tail" textBreakStrategy="simple">{resData[rowIndex]?.phone_number}</Text>
                            </View>
                            <View style={styles.cell}>
                                <Text>{resData[rowIndex]?.tin}</Text>
                            </View>
                            <View style={styles.cell}>
                                <Text>{resData[rowIndex]?.address}</Text>
                            </View>
                            <View style={styles.cell}>
                                <Text>{resData[rowIndex]?.type}</Text>
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
                                    {/* <TextInput
                                        style={{ ...styles.input, width: 50 }}
                                        placeholder="№"
                                        keyboardType="numeric"
                                        value={number}
                                        onChangeText={setNumber}
                                    /> */}
                                </View>
                                {/* <TextInput
                                    style={{ ...styles.input, }}
                                    placeholder="Müştəri"
                                    keyboardType="text"
                                    value={customer}
                                    onChangeText={setCustomer}
                                /> */}
                                <View style={{ marginVertical: 10 }}>
                                    <View style={{ ...styles.row, marginHorizontal: 10 }}>
                                        {headers.map((header) => (
                                            <View style={styles.cell}>
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
                                                    keyboardType="text"
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
                                                    keyboardType="text"
                                                    value={String(selectedRows[rowIndex]?.tin)}
                                                    onChangeText={(text) => handleInputChange(rowIndex, 'tin', text)}
                                                />
                                            </View>
                                            <View style={styles.cell}>
                                                <TextInput
                                                    placeholder='Ünvan'
                                                    keyboardType="text"
                                                    value={String(selectedRows[rowIndex]?.address)}
                                                    onChangeText={(text) => handleInputChange(rowIndex, 'address', text)}
                                                />
                                            </View>
                                            <View style={styles.cell}>
                                                <TextInput
                                                    placeholder='Növü'
                                                    keyboardType="text"
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
                </Modal>
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
        backgroundColor: '#3498db',
        marginHorizontal: 10,
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

export default Kontragent;
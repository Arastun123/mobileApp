import React, { useEffect, useState, useRef } from "react";
import { View, ScrollView, StyleSheet, Pressable, Text, Modal, Alert, TouchableOpacity, TextInput, LogBox } from "react-native";
import { useFonts } from "expo-font";
import { Ionicons } from '@expo/vector-icons';
import { fetchData, sendRequest, sendEditData, deleteData, autoFill } from '../services/Server';


const Nomenklatura = () => {
    const [name, setName] = useState('');
    const [kind, setKind] = useState();
    const [category, setCategory] = useState();
    const [brand, setBrand] = useState();
    const [price, setPrice] = useState();
    const [invoiceNumber, setInvoiceNumber] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [resNomenklatura, setNomenklatura] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [updateData, setUpdateData] = useState({
        name: '',
        kind: '',
        category: '',
        brand: '',
        price: '',
        customer: '',
    });
    const inputRefs = useRef([]);

    let [fontsLoad] = useFonts({ 'Medium': require('../assets/fonts/static/Montserrat-Medium.ttf') })
    const headers = ["№", "Ad", "Növ", 'Qiymət', 'Qaimə nömrəsi'];
    const editHeaders = ["№", "Ad", "Növ", 'Kateqoriya', 'Brend', 'Qiymət', 'Qaimə nömrəsi'];
    let rowCount = 0;
    LogBox.ignoreAllLogs()

    useEffect(() => { fetchDataAsync() }, []);
    useEffect(() => { if (name.length > 0) { searchProduct(name) } }, [name]);

    const fetchDataAsync = async () => {
        try {
            const nomenklatura = await fetchData('nomenklatura');
            if (nomenklatura !== null) {
                setNomenklatura(nomenklatura)
                const invoice = await fetchData('invoice');

                let number = invoice.map(item => item.number);
                setInvoiceNumber(number);
            };
        } catch (error) {
            console.error(error);
        }
    };

    if (!fontsLoad) return null

    const handlePress = () => { setModalVisible(true); }
    const closeUpdateModal = () => { setUpdateModalVisible(false) }

    const searchProduct = async (query) => {
        let tableName = 'products'
        try {
            const response = await autoFill(tableName, query);
            setSearchResults(response);
        } catch (error) {
            console.error('Error searching products:', error);
        }
    };

    const closeModal = () => {
        setModalVisible(false)
        setName('')
        setCategory()
        setBrand()
        setPrice()
        setKind()
        setSearchResults([])

    }

    const sendData = async () => {
        let apiUrl = '/nomenklatura';
        
        if (
            !name ||
            !category ||
            !brand ||
            !price ||
            !kind 
        ) {
            Alert.alert('Məlumatları daxil edin!');
            return;
        }

        const postData = {
            name: name,
            category: category,
            brand: brand,
            price: price,
            kind: kind,
        };

        const result = await sendRequest(apiUrl, postData);

        if (result.success) {
            Alert.alert(result.message);
            setModalVisible(false)
            fetchDataAsync()
            closeModal()
        }
        else Alert.alert(result.message);
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

    const handleEdit = async () => {
        let tableName = 'nomenklatura';
        try {
            const result = await sendEditData(selectedRows, tableName);
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

    const handleRowPress = (row) => {
        const isSelected = selectedRows.some((selectedRow) => selectedRow.id === row.id);
        if (isSelected) {
            const updatedSelectedRows = selectedRows.filter((selectedRow) => selectedRow.id !== row.id);
            setSelectedRows(updatedSelectedRows);
        } else {
            setSelectedRows([...selectedRows, row]);
        }

    };

    const deleteRow = async () => {
        const idsToDelete = selectedRows.map((row) => row.id);
        const tableName = 'nomenklatura';

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
    const handelModalOpen = () => { setUpdateModalVisible(true) }

    const groupedRows = {};

    resNomenklatura.forEach((item) => {
        const number = item.number;

        if (!groupedRows[number]) groupedRows[number] = { customer: item.customer, sum: 0, number: item.number, date: item.date, id: item.id, rows: [] };
        groupedRows[number].sum += item.price * item.quantity;
        groupedRows[number].rows.push(item);
    });

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
    

    return (
        <ScrollView contentContainerStyle={{ paddingVertical: 35, marginVertical: 20, marginHorizontal: 10 }}>
            <Text style={{ marginBottom: 10, textAlign: 'center', fontFamily: 'Medium', fontSize: 32 }}> Nomenklatura </Text>
            <View style={{ marginVertical: 20, marginHorizontal: 10 }}>
                <Pressable style={{ ...styles.button, width: 250 }} onPress={handlePress}>
                    <Text style={styles.text}>Yeni Nomenklatura əlavə et</Text>
                </Pressable>
            </View>

            <Modal visible={isModalVisible} animationType="slide">
                <ScrollView contentContainerStyle={{ marginVertical: 10 }} >
                    <View style={{ padding: 5 }}>
                        <Text style={{ textAlign: 'right' }} onPress={closeModal} ><Ionicons name="close" size={24} color="red" /></Text>
                    </View>
                    <TextInput
                        placeholder="Ad"
                        value={name}
                        onChangeText={(text) => setName(text)}
                        style = {styles.input}
                        ref={(ref) => (inputRefs.current[1] = ref)}
                        onSubmitEditing={() => inputRefs.current[2].focus()}
                    />
                    <View style={{ padding: 15 }}>
                        {searchResults.map((result) => (
                            <Text key={result.id} style={{ padding: 3 }} onPress={() => setName(result.name)}>
                                {result.name}
                            </Text>
                        ))}
                    </View>
                    <TextInput
                        placeholder="Növ"
                        value={kind}
                        onChangeText={(text) => setKind(text)}
                        style = {styles.input}
                        ref={(ref) => (inputRefs.current[2] = ref)}
                        onSubmitEditing={() => inputRefs.current[3].focus()}
                    />
                    <TextInput
                        placeholder="Kateqoriya"
                        value={category}
                        onChangeText={(text) =>  setCategory(text)}
                        style = {styles.input}
                        ref={(ref) => (inputRefs.current[3] = ref)}
                        onSubmitEditing={() => inputRefs.current[4].focus()}
                    />
                    <TextInput
                        placeholder="Brend"
                        value={brand}
                        onChangeText={(text) => setBrand(text)}
                        style = {styles.input}
                        ref={(ref) => (inputRefs.current[4] = ref)}
                        onSubmitEditing={() => inputRefs.current[5].focus()}
                    />
                    <TextInput
                        placeholder="Qiymət"
                        value={price}
                        onChangeText={(text) => setPrice(text)}
                        style = {styles.input}
                        ref={(ref) => (inputRefs.current[5] = ref)}
                        keyboardType="numeric"
                    />
                    {/*<View style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <DropDown items={priceSelect} placeholder={'Qiymet'} />
                        <DropDown items={nomenklatura} placeholder={'Nomenklatura'} />
                        <DropDown items={priceSelect} placeholder={'Kontragent'} />
                    </View>*/}
                </ScrollView>
                <View style={{ alignItems: 'flex-end', margin: 10 }}>
                    <Pressable style={{ ...styles.button, width: 150 }} onPress={sendData}>
                        <Text style={styles.text}>Təsdiq et</Text>
                    </Pressable>
                </View>
            </Modal>

            <View style={{ ...styles.row }}>
                {headers.map((header, rowIndex) => (
                    <View style={styles.cell} key={`row_${rowIndex}`}>
                        <Text numberOfLines={1} ellipsizeMode="tail" textBreakStrategy="simple" style={{ fontWeight: 600 }}>{header}</Text>
                    </View>
                ))}
            </View>

            {resNomenklatura.map((row, rowIndex) => (
                <TouchableOpacity key={`row_${rowIndex}`} onPress={() => handleRowPress(row)}
                    style={[
                        styles.row,
                        selectedRows.some((selectedRow) => selectedRow.id === row.id) && { backgroundColor: 'lightblue' },
                    ]}>
                    <View style={styles.cell}>
                        <Text>{++rowCount}</Text>
                    </View>
                    <View style={styles.cell}>
                        <Text> {resNomenklatura[rowIndex]?.name}</Text>
                    </View>
                    <View style={styles.cell}>
                        <Text>{resNomenklatura[rowIndex]?.kind}</Text>
                    </View>
                    <View style={styles.cell}>
                        <Text>{resNomenklatura[rowIndex]?.price}</Text>
                    </View>
                    <View style={styles.cell}>
                        <Text>{invoiceNumber[rowIndex]}</Text>
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
                            <Text style={{ display: 'none' }}>{updateData.id}</Text>
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
                                        <Text>{++rowCount}</Text>
                                    </View>
                                    <View style={styles.cell}>
                                        <TextInput
                                            placeholder='Malın adı'
                                            value={selectedRows[rowIndex]?.name}
                                            onChangeText={(text) => handleInputChange(rowIndex, 'name', text)}
                                            ref={(ref) => (inputRefs.current[rowCount + 1] = ref)}
                                            onSubmitEditing={() => focusInputRefs(rowCount + 1)}
                                        />
                                    </View>
                                    <View style={styles.cell}>
                                        <TextInput
                                            placeholder='Növ'
                                            value={selectedRows[rowIndex]?.kind}
                                            onChangeText={(text) => handleInputChange(rowIndex, 'kind', text)}
                                            ref={(ref) => (inputRefs.current[rowCount + 2] = ref)}
                                            onSubmitEditing={() => focusInputRefs(rowCount + 2)}
                                        />
                                    </View>
                                    <View style={styles.cell}>
                                        <TextInput
                                            placeholder='Kateqoriya'
                                            value={String(selectedRows[rowIndex]?.category)}
                                            onChangeText={(text) => handleInputChange(rowIndex, 'category', text)}
                                            ref={(ref) => (inputRefs.current[rowCount + 3] = ref)}
                                            onSubmitEditing={() => focusInputRefs(rowCount + 3)}
                                        />
                                    </View>
                                    <View style={styles.cell}>
                                        <TextInput
                                            placeholder='Brend'
                                            value={String(selectedRows[rowIndex]?.brand)}
                                            onChangeText={(text) => handleInputChange(rowIndex, 'brand', text)}
                                            ref={(ref) => (inputRefs.current[rowCount + 4] = ref)}
                                            onSubmitEditing={() => focusInputRefs(rowCount + 4)}
                                        />
                                    </View>
                                    <View style={styles.cell}>
                                        <TextInput
                                            placeholder='Qiymət'
                                            keyboardType="numeric"
                                            value={String(selectedRows[rowIndex]?.price)}
                                            onChangeText={(text) => handleInputChange(rowIndex, 'price', text)}
                                            ref={(ref) => (inputRefs.current[rowCount + 5] = ref)}
                                            onSubmitEditing={() => focusInputRefs(rowCount)}
                                        />
                                    </View>
                                    <View style={styles.cell}>
                                        <Text>{String(invoiceNumber[rowIndex])}</Text>
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
            <View style={styles.table}>
                <View style={styles.row}>
                    <View style={styles.cell}>
                        <Text style={{ textAlign: 'center', fontSize: 20 }}>Qalıqlar</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.cell} >
                        <Text style={{ textAlign: 'center' }}>Baş anbar</Text>
                    </View>
                    <View style={styles.cell} >
                        <Text style={{ textAlign: 'center' }}>3</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.cell}>
                        <Text style={{ textAlign: 'center' }}>Anbar</Text>
                    </View>
                    <View style={styles.cell}>
                        <Text style={{ textAlign: 'center' }}>5</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
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
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
        fontFamily: 'Medium'
    },
    input: {
        borderBottomWidth: 0.5,
        height: 48,
        borderBottomColor: '#8e93a1',
        marginBottom: 30,
    }
});

export default Nomenklatura;
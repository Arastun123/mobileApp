import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Pressable, Text, Modal, Alert, TextInput, TouchableOpacity } from "react-native";
import { useFonts } from "expo-font";
import { Ionicons } from '@expo/vector-icons';
import UserInput from "../components/UserInput";
import Table from "../components/Table";
import DropDown from "../components/DropDown";
import { fetchData } from '../services/Server';
import { sendRequest } from '../services/Server';


const Nomenklatura = () => {
    const [name, setName] = useState();
    const [kind, setKind] = useState();
    const [category, setCategory] = useState([]);
    const [brand, setBrand] = useState();
    const [price, setPrice] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [resNomenklatura, setNomenklatura] = useState([]);
    const [formTable, setFormTable] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);

    let [fontsLoad] = useFonts({ 'Medium': require('../assets/fonts/static/Montserrat-Medium.ttf') })
    const headers = ["№", "Ad", "Növ", 'Kateqoriya', 'Brend', 'Qiymət'];
    let rowCount = 0;

    useEffect(() => {
        const fetchDataAsync = async () => {
            try {
                const nomenklatura = await fetchData('nomenklatura');
                if (nomenklatura !== null) {
                    setNomenklatura(nomenklatura);
                }
                // const optionCategory = await fetchData('category');
                // if (optionCategory !== null) {
                //     setCategory(optionCategory);
                // }

                // const price = await fetchData('price');
                // if (price !== null) {
                //     setPrice(price);
                // }
            } catch (error) {
                console.error(error);
            }
        };

        fetchDataAsync();
    }, []);

    if (!fontsLoad) { return null }

    const handlePress = () => { setModalVisible(true) }
    const closeModal = () => {
        setModalVisible(false)
        setName()
        setCategory()
        setBrand()
        setPrice()
        setKind()
    }

    let extractedData = resNomenklatura.map((item) => [String(item.id), item.name, item.kind, item.brand, item.category, item.price]);

    const sendData = async () => {
        let apiUrl = '/nomenklatura'
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
        } else {
            Alert.alert(result.message);
        }
    };

    const handleTableInputChange = (index, field, value) => {
        let updatedFormTable = [...formTable];
        updatedFormTable[index] = {
            ...updatedFormTable[index],
            [field]: value,
        };

        setFormTable((prevFormTable) => {
            return updatedFormTable;
        });
    };

    const handleRowPress = (row) => {
        setSelectedRow(row);
        setModalVisible(true);
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
                    <UserInput
                        name="Ad"
                        value={name}
                        setValue={setName}
                        autoCompleteType="text"
                        keyboardType="text"
                    />
                    <UserInput
                        name="Növ"
                        value={kind}
                        setValue={setKind}
                        autoCompleteType="text"
                        keyboardType="text"
                    />
                    <UserInput
                        name="Kateqoriya"
                        value={category}
                        setValue={setCategory}
                        autoCompleteType="text"
                        keyboardType="text"
                    />
                    <UserInput
                        name="Brend"
                        value={brand}
                        setValue={setBrand}
                        autoCompleteType="text"
                        keyboardType="text"
                    />
                    <UserInput
                        name="Qiymət"
                        value={price}
                        setValue={setPrice}
                        autoCompleteType="numeric"
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
            {/* <Table headers={headers} data={extractedData} /> */}
            <View style={{ ...styles.row, marginHorizontal: 10 }}>
                {headers.map((header) => (
                    <View style={styles.cell}>
                        <Text bold center>{header}</Text>
                    </View>
                ))}
            </View>

            {resNomenklatura.map((row, rowIndex) => (
                <TouchableOpacity key={rowIndex} onPress={() => handleRowPress(row)}>

                    <View style={{ ...styles.row, marginHorizontal: 10 }} key={rowIndex}>
                        <View style={styles.cell}>
                            <Text>{++rowCount}</Text>
                        </View>
                        <View style={styles.cell}>
                            <TextInput
                                placeholder='Malın adı'
                                keyboardType="text"
                                value={resNomenklatura[rowIndex]?.name}
                                onChangeText={(text) => handleTableInputChange(rowIndex, 'name', text)}
                            />
                        </View>
                        <View style={styles.cell}>
                            <TextInput
                                placeholder='Miqdar'
                                keyboardType="numeric"
                                value={resNomenklatura[rowIndex]?.kind}
                                onChangeText={(text) => handleTableInputChange(rowIndex, 'kind', text)}
                            />
                        </View>
                        <View style={styles.cell}>
                            <TextInput
                                placeholder='Kateqoriyası'
                                keyboardType="numeric"
                                value={resNomenklatura[rowIndex]?.category}
                                onChangeText={(text) => handleTableInputChange(rowIndex, 'category', text)}
                            />
                        </View>
                        <View style={styles.cell}>
                            <TextInput
                                placeholder='Brendi'
                                keyboardType="text"
                                value={resNomenklatura[rowIndex]?.brand}
                                onChangeText={(text) => handleTableInputChange(rowIndex, 'brand', text)}
                            />
                        </View>
                        <View style={styles.cell}>
                            <TextInput
                                placeholder='Qiymət'
                                keyboardType="numeric"
                                value={resNomenklatura[rowIndex]?.price}
                                onChangeText={(text) => handleTableInputChange(rowIndex, 'price', text)}
                            />
                        </View>
                        {/* <TouchableOpacity onPress={() => handleUpdate(row)}>
                        <View style={styles.updateButton}>
                            <Text>Update</Text>
                        </View>
                    </TouchableOpacity> */}
                    </View>
                </TouchableOpacity>
            ))}

            {/* <Modal visible={isModalVisible} transparent animationType="slide">
                <ScrollView contentContainerStyle={{ marginVertical: 10 }} >
                    <View style={{ padding: 5 }}>
                        <Text style={{ textAlign: 'right' }} onPress={closeModal} ><Ionicons name="close" size={24} color="red" /></Text>
                    </View>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>

                            <TextInput
                                placeholder='Malın adı'
                                keyboardType="text"
                                value={selectedRow?.name}
                                onChangeText={(text) => handleTableInputChange(selectedRow, 'name', text)}
                            />
                            <Button title="Update" onPress={handleUpdate} />
                            <Button title="Close" onPress={handleModalClose} />
                        </View>
                    </View>
                </ScrollView>
            </Modal> */}

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
});

export default Nomenklatura;
import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Pressable, Text, Modal, Alert } from "react-native";
import { useFonts } from "expo-font";
import { Ionicons } from '@expo/vector-icons';
import UserInput from "../components/UserInput";
import Table from "../components/Table";
import DropDown from "../components/DropDown";
import { fetchData } from '../services/Server';


const Nomenklatura = () => {
    const [name, setName] = useState();
    const [kind, setKind] = useState();
    const [category, setCategory] = useState([]);
    const [brand, setBrand] = useState();
    const [price, setPrice] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [resNomenklatura, setNomenklatura] = useState([]);
    let [fontsLoad] = useFonts({ 'Medium': require('../assets/fonts/static/Montserrat-Medium.ttf') })

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

    const headers = ["№", "Ad", "Növ", 'Kateqoriya', 'Brend', 'Qiymət'];

    let extractedData = resNomenklatura.map((item) => [String(item.id), item.name, item.kind, item.brand, item.category, item.price]);

    const sendData = async () => {
        const apiUrl = 'http://192.168.88.44:3000/api/nomenklatura';
        try {
            const postData = {
                name: name,
                category: category,
                brand: brand,
                price: price,
                kind: kind, 
            };
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (response.status === 200)  Alert.alert('Məlumatlar göndərildi!');
            else Alert.alert('Uğursuz cəht!');
        } catch (error) {
            console.error(error)
        }
    }

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
            <Table headers={headers} data={extractedData} />
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
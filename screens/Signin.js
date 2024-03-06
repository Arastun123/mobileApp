import React, { useState } from "react";
import { View, Text } from 'react-native';
import UserInput from "../components/UserInput";
import SubmitButton from "../components/SubmitButton";
import axios from "axios";
import Logo from "../components/Logo";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useFonts } from "expo-font";


const Signin = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    let [fontsLoad] = useFonts({'Medium': require('../assets/fonts/static/Montserrat-Medium.ttf') });

    const handleSubmit = async () => {
        setLoading(true);
        if (!email || !password) {
            alert("All fields are required");
            setLoading(false);
            return;
        }
        try {
            const { data } = await axios.post('http://localhost:8000/api/signup', {
                email,
                password
            });
            setLoading(false);
            console.log('Sign in Success', data);
            alert("Sign in successful")
        }
        catch (err) {
            console.log(err);
            setLoading(false)
        }
    }

    if (!fontsLoad) {  return null }

    return (
        <KeyboardAwareScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>
            <View style={{ marginVertical: 100 }}>
                <Logo />
                <Text style={{ textAlign: 'center', fontFamily: 'Medium', fontSize: 32}}>Daxil ol</Text>

                <UserInput
                    name="Email"
                    value={email}
                    setValue={setEmail}
                    autoCompleteType="email"
                    keyboardType="email-address"
                />
                <UserInput
                    name="Parol"
                    value={password}
                    setValue={setPassword}
                    secureTextEntry={true}
                    autoCompleteType="password"
                />

                <SubmitButton title="Təsdiq et" handleSubmit={handleSubmit} loading={loading} />

                <Text style={{ marginTop: 10, textAlign: 'center', fontFamily: 'Medium', color: 'red' }}>
                    Şifrəni unutmusunuz?
                </Text>
            </View>
        </KeyboardAwareScrollView>
    )
}

export default Signin;
import React, { useState } from "react";
import { View } from 'react-native';
import Text from "@kaloraat/react-native-text"
import UserInput from "../components/UserInput";
import SubmitButton from "../components/SubmitButton";
import axios from "axios";
import Logo from "../components/Logo";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


const Signup = ({navigation}) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        if (!name || !email || !password) {
            alert("All fields are required");
            setLoading(false);
            return;
        }
        try {
            const { data } = await axios.post('http://localhost:8000/api/signup', {
                name,
                email,
                password
            });
            setLoading(false);
            console.log('Sign in Success', data);
            alert("Sign up successful")
        }
        catch (err) {
            console.log(err);
            setLoading(false)
        }
    }

    return (
        <KeyboardAwareScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>
            <View style={{marginVertical:100}}>
                <Logo />
                <Text title center>Sing Up</Text>
                <UserInput
                    name="Name"
                    value={name}
                    setValue={setName}
                    autoCapitalize="words"
                    autoCorrect={false}
                />
                <UserInput
                    name="Email"
                    value={email}
                    setValue={setEmail}
                    autoCompleteType="email"
                    keyboardType="email-address"
                />
                <UserInput
                    name="Password"
                    value={password}
                    setValue={setPassword}
                    secureTextEntry={true}
                    autoCompleteType="password"
                />

                <SubmitButton title="Sign Up" handleSubmit={handleSubmit} loading={loading} />

                <Text small center>
                    Already Joined?  <Text onPress={() => navigation.navigate('Singin')} color="#ff2222"> Sing In </Text>
                </Text>
            </View>
        </KeyboardAwareScrollView>
    )
}

export default Signup;
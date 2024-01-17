import React, { useState } from "react";
import { View } from 'react-native';
import Text from "@kaloraat/react-native-text"
import UserInput from "../components/UserInput";
import SubmitButton from "../components/SubmitButton";
import axios from "axios";
import Logo from "../components/Logo";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const Signin = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
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

    return (
        <KeyboardAwareScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>
            <View style={{marginVertical:100}}>
                <Logo />
                <Text title center>Sing In</Text>

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

                <SubmitButton title="Sign in" handleSubmit={handleSubmit} loading={loading}/>

                {/* <Text> {JSON.stringify({ email, password }, null, 4)} </Text> */}
                
                {/* <Text small center>
                    Not Yet?   <Text onPress={() => navigation.navigate('Singup')} color="#ff2222">Sing Up </Text>
                </Text> */}
                <Text small center color="red" style={ { marginTop:10 } }>
                    Forgot Password?
                </Text>
            </View>
        </KeyboardAwareScrollView>
    )
}

export default Signin;
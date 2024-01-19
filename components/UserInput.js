import React from "react";
import { View, TextInput } from 'react-native';
import Text from "@kaloraat/react-native-text";

const UserInput = ({
    name,
    value,
    setValue,
    autoCapitalize = "none",
    secureTextEntry = false,
    keyboardType = "default",
}) => {
    return (
        <View style={{ marginHorizontal: 24 }}>
            <Text bold color="#333">{name}</Text>
            <TextInput
                autoCorrect={false}
                autoCapitalize={autoCapitalize}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                style={{
                    borderBottomWidth: 0.5,
                    height: 48,
                    borderBottomColor: '#8e93a1',
                    marginBottom: 30,
                }}
                value={value}
                onChangeText={(text) => setValue(text)}
            />

        </View>
    )
}

export default UserInput;
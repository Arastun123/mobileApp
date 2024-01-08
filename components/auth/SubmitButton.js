import React from "react";
import { TouchableOpacity } from 'react-native';
import Text from "@kaloraat/react-native-text"

const SubmitButton = ({title, handleSubmit, loading}) => {
    return (
        <TouchableOpacity
            onPress={handleSubmit}
            style={{
                backgroundColor: "#ff9900",
                height: 50,
                marginBottom: 20,
                justifyContent: "center",
                marginHorizontal: 20,
                borderRadius: 24,
            }}
        >
            <Text bold medium center>
                {loading ? "Please wait..." : title}
            </Text>
        </TouchableOpacity>
    );
};

export default SubmitButton;

import React from "react";
import { View, Image } from "react-native";

const Logo = () => {
    return(
        <View style= {{ justifyContent:'center', alignItems:'center'}}>
            <Image source={require("../../assets/logo.png")} style={{ width:300, height:200, marginVertical:50}}/>
        </View>
    );
}

export default Logo;

import React from "react";
import { View, Image } from "react-native";

const Logo = () => {
    return(
        <View style= {{ justifyContent:'center', alignItems:'center'}}>
            <Image source={require("../assets/imgs/logo.png")} style={{ width:150, height:150, margin:50}}/>
        </View>
    );
}

export default Logo;

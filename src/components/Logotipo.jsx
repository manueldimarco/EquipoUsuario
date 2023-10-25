import react from "react";
import {View,Image,StyleSheet} from "react-native";
import { Dimensions } from "react-native";

const Logotipo=()=>{
    return <Image style={style.logotipo} source={require("../../assets/peopleDelivery.png")}/>
}

const style=StyleSheet.create({
    logotipo:{
        resizeMode: 'contain',
        width:Dimensions.get("window").width-60,
        padding:0,
        marginTop:-45,
        marginBottom:-50
    }
})

export default Logotipo
import React from "react";
import { View,StyleSheet,Text,Dimensions } from "react-native";

const Encabezado=(props)=>{
    return(
        <View style={style.encabezado}>
            <Text style={style.texto}>
                {props.texto}
            </Text>
        </View>
    )
}

const style=StyleSheet.create({
    encabezado:{
        alignItems:"center",
        justifyContent:"center",
        borderColor:"black",
        borderWidth:2,
        width:Dimensions.get("window").width+5,
        marginTop:-10,
        marginBottom:7
    },
    texto:{
        color:"black",
        fontWeight:"bold",
        fontSize:24,
    }
})

export default Encabezado;
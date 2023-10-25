import React from "react";
import { Text,View,StyleSheet,Image,Dimensions,TouchableOpacity } from "react-native";


const BotonConfiguracion=(props)=>{
    return(
        <TouchableOpacity onPress={props.onPress}>
            <View style={style.boton}>
                <Image style={style.imagen} source={props.imagen}/>
                <Text style={style.texto}>
                    {props.texto}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const style=StyleSheet.create({
    boton:{
        justifyContent:"center",
        alignItems:"center",
        marginHorizontal:10,
        marginVertical:5,
        padding:10,
        width:((Dimensions.get("window").width)/2)-25,
        height:((Dimensions.get("window").width)/2)-25,
        backgroundColor:"#CAD1F9",
        borderColor:"#2858FF",
        borderWidth:2,
        borderRadius:30
    },
    texto:{
        fontSize:15,
        fontWeight:"700",
        color:"black",
        textAlign:"center"
    },
    imagen:{
        resizeMode:"contain",
        margin:5
    }
})

export default BotonConfiguracion
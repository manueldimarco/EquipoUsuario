import React,{useState} from "react";
import { Text,View,TouchableOpacity,Image,Dimensions,StyleSheet } from "react-native";
import editar from "../../assets/editar.png";

const ItemPerfil=(props)=>{
    return(
        <View style={style.itemPerfil}>
            <View>
                <Text style={style.titulo}>{props.titulo}</Text>
                <Text style={style.valor}>{props.valor}</Text>
            </View>
            <TouchableOpacity onPress={props.onPress}>
                <Image source={require("../../assets/editar.png")}/>
            </TouchableOpacity>
        </View>    
    )
}

const style=StyleSheet.create({
    itemPerfil:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        backgroundColor:"white",
        width:Dimensions.get("window").width-35,
        marginVertical:3
    },
    titulo:{
        fontWeight:"bold",
        fontSize:18,
        textAlign:"left"
    },
    valor:{
        fontWeight:"500",
        fontSize:16,
        textAlign:"left",
        width: Dimensions.get("window").width-80,
        fontStyle:"italic"
    }
})

export default ItemPerfil
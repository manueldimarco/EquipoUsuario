import React from "react";
import {View,Image,StyleSheet,TouchableOpacity} from "react-native";
import { Dimensions } from "react-native";

const MainButton=({navigation,token})=>{

    const toHistorial = () => {
        navigation.navigate('Historial', {
          token:token
        })}

    const toOrigen = () => {
        navigation.navigate('Origen', {
            token:token
        })}

    const toConfiguracion = () => {
        navigation.navigate('Configuracion', {
            token:token
        })}

    return (
        <View style={style.view}>
            <TouchableOpacity onPress={toHistorial}>
                <Image source={require("../../assets/HISTORIAL_.png")}/>
            </TouchableOpacity>

            <TouchableOpacity onPress={toOrigen}>
                <Image source={require("../../assets/MAPA.png")}/>
            </TouchableOpacity>

            <TouchableOpacity onPress={toConfiguracion}>
                <Image source={require("../../assets/CONFIGURACION.png")}/>
            </TouchableOpacity>
        </View>
    )
}

const style = StyleSheet.create({
    view: {
        flexDirection:"row",
        justifyContent: "space-around",
        alignContent:"center",
        width: Dimensions.get("window").width-30,
        padding: 5,
        marginTop:5,
        marginBottom:-30,
        backgroundColor:'white',
        borderRadius:45,
        borderColor:'black',
        borderWidth:3
    },
    
})

export default MainButton
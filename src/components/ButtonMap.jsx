import React from "react";
import {Text,View,TouchableOpacity,StyleSheet} from 'react-native';
import { Dimensions } from "react-native";

const ButtonMap=(props)=>{

    const backgroundTheme = props.theme === "dark" ? style.darkBackground : style.lightBackground;
    const textTheme = props.theme === "dark" ? style.whiteText : style.blackText;

    return (
        <TouchableOpacity disabled={!props.habilitado} onPress={props.onPress}>
            <View style={props.habilitado ? [style.buttonStyle, backgroundTheme] : [style.disabled,style.buttonStyle, backgroundTheme]}>
                <Text style={[style.textStyle,textTheme]}>{props.text}</Text>
            </View>
        </TouchableOpacity>
    );
};

const style=StyleSheet.create({
    lightBackground:{
        backgroundColor:"#6372ff",
    },
    darkBackground:{
        backgroundColor:"black",
    },
    disabled:{
        opacity:0.5,
    },
    buttonStyle:{
        resizeMode:"contain",
        alignItems:"center",
        justifyContent:"center",
        borderRadius:30,
        borderColor:"black",
        borderWidth:3,
        padding:5,
        height:50,
        width:50,
        marginVertical:5
    },

    blackText:{
        color:"black",
    },
    whiteText:{
        color:"white",
    },
    textStyle:{
        fontWeight:"bold",
        fontSize:20
    },
})

export default ButtonMap
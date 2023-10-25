import React,{useState,useEffect} from "react";
import { View,Text,TouchableOpacity,Dimensions,StyleSheet,Image } from "react-native";

const ItemTarjeta=(props)=>{
    const [isSelected, setIsSelected] = useState(false);

    useEffect(() => {
        setIsSelected(props.tarjetaSeleccionada === props.numero);
    }, [props.tarjetaSeleccionada, props.numero]);

    const seleccionarTarjeta=(numero)=>{
        setIsSelected(true);
        props.actualizarTarjeta(numero)
    }

    return(
        <View style={style.container}>
            <View style={style.datos}>
                <Text style={style.operadora}>{props.operadora}</Text>
                <Text style={style.texto}>{props.numero}</Text>
            </View>
            {isSelected ?(
                <Image style={style.imagen} source={require("../../assets/seleccionado.png")}/>
            ):(
                <TouchableOpacity onPress={() => seleccionarTarjeta(props.numero)}>
                    <Image style={style.imagen} source={require("../../assets/noSeleccionado.png")}/>
                </TouchableOpacity>
            )}
        </View>
    )
}

const style=StyleSheet.create({
    container:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        backgroundColor:"white",
        marginVertical:-20
    },
    datos:{
        alignItems:"flex-start",
        width:Dimensions.get("window").width-100,
    },
    texto:{
        fontStyle:"italic",
        fontSize:16,
        fontWeight:"bold",
        padding:4,
        color:"black",
        paddingRight:5
    },
    operadora:{
        fontSize:18,
        fontWeight:"bold",
        padding:4,
        color:"black",
        paddingRight:5
    },
    imagen:{
        resizeMode:"contain",
        margin:3
    }

    

})

export default ItemTarjeta
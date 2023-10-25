import React,{useState} from "react";
import { View,Text,TouchableOpacity,Dimensions,StyleSheet,Image } from "react-native";

const ItemHistorial=(props)=>{
    const [isOpen, setIsOpen] = useState(false);

    return(
        isOpen ? (
        <View style={style.container}>
            <View style={style.renglon}>
                <View style={style.presentacion}>
                    <Text style={style.titulo}>{props.destino}</Text>
                    <Text style={style.subtitulo}>{props.fecha}</Text>
                </View>
                <TouchableOpacity onPress={()=>setIsOpen(false)}>
                    <Image style={style.imagen} source={require("../../assets/Cerrar.png")}/>
                </TouchableOpacity>
            </View>
            <View style={style.renglon}>
                <Image style={style.imagen} source={require("../../assets/Origen.png")}/>
                <Text style={style.texto}>{props.origen}</Text>
            </View>
            <View style={style.renglon}>
                <Image style={style.imagen} source={require("../../assets/Destino.png")}/>
                <Text style={style.texto}>{props.destino}</Text>
            </View>
            <View style={style.renglon}>
                <Image style={style.imagen} source={require("../../assets/Moneda.png")}/>
                <Text style={style.texto}>{props.metodo}</Text>
            </View>
            <View style={style.renglon}>
                <Image style={style.imagen} source={require("../../assets/Volante.png")}/>
                <Text style={style.texto}>{props.chofer}</Text>
            </View>
        </View>
    ) : (
        <View style={style.container}>
            <View style={style.renglon}>
                <View style={style.presentacion}>
                    <Text style={style.titulo}>{props.destino}</Text>
                    <Text style={style.subtitulo}>{props.fecha}</Text>
                </View>
                <TouchableOpacity onPress={()=>setIsOpen(true)}>
                    <Image style={style.imagen} source={require("../../assets/Abrir.png")}/>
                </TouchableOpacity>
            </View>
        </View>
    ))
 
}

const style=StyleSheet.create({
    container:{
        margin:7,
        width:Dimensions.get("window").width-30,
        justifyContent:"space-around",
        alignItems:"flex-start",
        backgroundColor:"#CAD1F9",
        borderColor:"#2858FF",
        borderWidth:2,
        borderRadius:30,
        paddingHorizontal:20,
        paddingVertical:10
    },
    imagen:{
        resizeMode:"contain",
        marginVertical:3
    },
    presentacion:{
        width:Dimensions.get("window").width-100,
        paddingRight:20
    },
    titulo:{
        fontWeight:"bold",
        fontSize:20,
        textAlign:"left"
    },
    subtitulo:{
        fontSize:20,
        textAlign:"left",
        fontStyle:"italic"
    },
    renglon:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
        paddingVertical:5,
        marginRight:30
    },
    texto:{
        paddingLeft:15,
        textAlign:"left",
        fontSize:18
    }
})

export default ItemHistorial
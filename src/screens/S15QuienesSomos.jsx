import React from "react";
import { View, Text, StyleSheet, Dimensions,Image} from "react-native";
import Constants from 'expo-constants';
import MainButton from "../components/MainButton";
import Logotipo from "../components/Logotipo";
import Encabezado from "../components/Encabezado";

const S15QuienesSomos = ({navigation}) => {
    return (
      <View style={style.screen}>
        <Logotipo/>
        <Encabezado texto="¿QUIÉNES SOMOS?"/>
        <View style={style.container}>
          <Image style={style.fotoPersonas} source={require("../../assets/personas.png")}/>
          <Text style={style.titulo}>
            ¿QUIÉNES SOMOS?
          </Text>
          <Text style={style.cuerpo}>
          People Delivery es un proyecto llevado a cabo por alumnos de la carrera Ingeniería en Informática de la 
          Universidad Argentina de la Empresa.{'\n'}
          Nuestro objetivo es desarrollar una solución tecnológica que permita solicitar viajes, de una manera sencilla 
          y sin costos extras por la complejidad de la aplicación.
          </Text>
        </View>
        <MainButton navigation={navigation}/>
      </View>
    )
}

const style = StyleSheet.create({
  screen: {
    justifyContent: "space-between",
    flexGrow: 1,
    backgroundColor: 'white',
    alignItems: "center",
    marginTop: Constants.statusBarHeight,
    paddingBottom:Constants.statusBarHeight*2
  },
  container:{
    justifyContent:"space-around",
    alignItems:"center",
    width:Dimensions.get("window").width-30,
    backgroundColor:"#D3D3FE",
    borderColor:"#5986EB",
    borderWidth:2,
    borderRadius:30
  },
  fotoPersonas:{
    resizeMode:"contain"
  },
  titulo:{
    fontSize:24,
    fontWeight:"bold",
    textAlign:"center",
    color:"#6372FF"
  },
  cuerpo:{
    fontSize:15,
    fontWeight:"700",
    marginBottom:2,
    textAlign:"justify",
    color:"#6372FF",
    padding:15
  }
  })

export default S15QuienesSomos
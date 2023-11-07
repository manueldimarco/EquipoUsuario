import React from "react";
import { View, Text, StyleSheet, TouchableOpacity} from "react-native";
import Constants from 'expo-constants';
import MainButton from "../components/MainButton";
import Logotipo from "../components/Logotipo";
import Encabezado from "../components/Encabezado";
import BotonConfiguracion from "../components/BotonConfiguracion";
import perfilImage from "../../assets/Perfil.png";
import casaImage from "../../assets/DireccionPorDefecto.png";
import tarjetaImage from "../../assets/Tarjeta.png";
import reclamoImage from "../../assets/Reclamos.png";
import quienesSomosImage from "../../assets/QuienesSomos.png";
import cerrarSesionImage from "../../assets/CerrarSesion.png";

const S10Configuracion = ({navigation,cerrarSesion}) => {    

    return (
      <View style={style.screen}>
        <View style={style.container}>
          <Logotipo/>
          <Encabezado texto="CONFIGURACIÓN"/>  
        </View>
        <View style={style.fila}>
          <BotonConfiguracion imagen={perfilImage} texto="EDITAR PERFIL" onPress={() => navigation.navigate('Perfil')}/>
          <BotonConfiguracion imagen={casaImage} texto="DIRECCIÓN POR DEFECTO" onPress={() => navigation.navigate('Direccion Por Defecto')}/>
        </View>
        <View style={style.fila}>
          <BotonConfiguracion imagen={tarjetaImage} texto="CONFIGURAR TARJETAS" onPress={() => navigation.navigate('Tarjetas')}/>
          <BotonConfiguracion imagen={reclamoImage} texto="RECLAMOS" onPress={() => navigation.navigate('Reclamos')}/>
        </View>
        <View style={style.fila}>
          <BotonConfiguracion imagen={quienesSomosImage} texto="QUIÉNES SOMOS" onPress={() => navigation.navigate('Quienes Somos')}/>
          <BotonConfiguracion imagen={cerrarSesionImage} texto="CERRAR SESIÓN" onPress={cerrarSesion()}/>
        </View>
        <MainButton navigation={navigation}/>
      </View>
    )
}

const style = StyleSheet.create({
  screen: {
      justifyContent:"space-between",
      flexGrow: 1,
      backgroundColor: 'white',
      alignItems: "center",
      marginTop: Constants.statusBarHeight,
      paddingBottom:Constants.statusBarHeight*2
  },
  container:{
    justifyContent:"flex-start",
    alignItems:"center"
  },
  fila:{
    flexDirection:"row",
    justifyContent:"space-around",
    alignItems:"center"
  }
})

export default S10Configuracion
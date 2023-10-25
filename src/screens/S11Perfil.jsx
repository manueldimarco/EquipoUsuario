import React,{useState,useEffect} from "react";
import { View,ScrollView, Text, StyleSheet, TouchableOpacity,Dimensions,Image} from "react-native";
import Constants from 'expo-constants';
import Logotipo from "../components/Logotipo";
import MainButton from '../components/MainButton';
import Encabezado from "../components/Encabezado";
import Button from "../components/Button";
import host from '../../host';
import * as SecureStore from 'expo-secure-store';

const S11Perfil = ({ navigation}) => {
    
  const [token, setToken] = useState('');
  SecureStore.getItemAsync("token").then((token) => setToken(token));
  console.log(token);
  const [nombre, setNombre] = useState('Nombre');
    const [apellido, setApellido] = useState('Apellido');
    const [mailUsuario, setMailUsuario] = useState('usuario@gmail.com');
    const [direccion, setDireccion] = useState('Av San Martín 99');
    
    /*useEffect(() => {
      obtenerDatosUsuario();
    }, []);*/

    const obtenerDatosUsuario = async () => {
      try {
        const response = await fetch(host+'/user-int/v1/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setNombre(data.name);
          setApellido(data.lastName);
          setMailUsuario(data.email);
          setDireccion(data.adress);
        } else {
          console.error('Error al obtener datos del usuario');
          alert('Error al obtener datos del usuario');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    return (
        <ScrollView contentContainerStyle={style.screen}>
            <Logotipo/>
            <Encabezado texto="PERFIL"/>
            <View style={style.container}>
                <Image style={style.iconoPerfil} source={require("../../assets/iconoPerfil.png")}/>
                <Text style={style.nombreUsuario}>{nombre} {apellido}</Text>
                <Text style={style.mailUsuario}>{mailUsuario}</Text>
            </View>
            <View style={style.itemPerfil}>
                <Text style={style.titulo}>DIRECCIÓN POR DEFECTO</Text>
                <Text style={style.valor}>{direccion}</Text>
                <Button habilitado={true} theme="light" text="MODIFICAR" onPress={() => navigation.navigate('Direccion Por Defecto')}/>
            </View>
            <MainButton navigation={navigation}/>
        </ScrollView>
    )
}

const style = StyleSheet.create({
    screen: {
        justifyContent: "space-between",
        flexGrow: 1,
        backgroundColor: 'white',
        alignItems: "center",
        marginTop: Constants.statusBarHeight,
        paddingBottom:Constants.statusBarHeight*2,
    },
    container:{
        justifyContent:"center",
        alignItems:"center"
    },
    iconoPerfil:{
        resizeMode:"contain",
        margin:3
    },
    nombreUsuario:{
        fontWeight:"bold",
        fontSize:24,
        textAlign:"center"
    },
    mailUsuario:{
        fontWeight:"600",
        fontSize:20,
        textAlign:"center",
        marginBottom:25
    },
    itemPerfil:{
      justifyContent:"center",
      alignItems:"center",
      backgroundColor:"white",
      width:Dimensions.get("window").width-35,
      marginBottom:40
    },
    titulo:{
        fontWeight:"bold",
        fontSize:20,
        textAlign:"center"
    },
    valor:{
        fontWeight:"500",
        fontSize:19,
        textAlign:"center",
        width: Dimensions.get("window").width-80,
        fontStyle:"italic"
    }
    
})

export default S11Perfil
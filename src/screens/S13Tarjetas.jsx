import React,{useState,useEffect} from "react";
import { View,ScrollView, Text, StyleSheet, TouchableOpacity,Image,Dimensions} from "react-native";
import Constants from 'expo-constants';
import Logotipo from "../components/Logotipo";
import Button from "../components/Button";
import Encabezado from "../components/Encabezado";
import ItemTarjeta from "../components/ItemTarjeta";
import host from '../../host';
import * as SecureStore from 'expo-secure-store';

const S13Tarjetas = ({navigation,actualizarTarjeta,tarjetaSeleccionada}) => {
  
  const [token, setToken] = useState('');
  SecureStore.getItemAsync("token").then((token) => setToken(token));
  console.log(token);
  const [tarjetas, setTarjetas] = useState([]);

  useEffect(() => {
    obtenerTarjetas();
  }, []);
  
  const obtenerTarjetas = async () => {
      try {
        const response = await fetch(host+"/user-int/cards", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setTarjetas(data);
        } else {
          console.error("Error fetching tarjetas");
          alert("No pudimos obtener las tarjetas disponibles")
        }
      } catch (error) {
        console.error("Error fetching tarjetas", error);
      }
    };

  return (
    <View style={style.screen}>
      <Logotipo/>
      <Encabezado texto="TARJETAS"/>
      <ScrollView contentContainerStyle={style.scroll}>
        <View style={style.info}>
          <View style={style.tituloInfo}>
            <Image source={require("../../assets/info.png")}/>
            <Text style={style.textoTitulo}>TARJETA SELECCIONADA</Text>
          </View>
          <Text style={style.cuerpo}>
            La tarjeta seleccionada es la que será utilizada al realizar un pago con el método “TARJETA”. {'\n'}
            Para modificarla, toca el círculo correspondiente a la tarjeta deseada.
          </Text>
        </View>
        <ItemTarjeta operadora="VISA" numero="1234" 
        tarjetaSeleccionada={tarjetaSeleccionada} actualizarTarjeta={actualizarTarjeta}/>
        <ItemTarjeta operadora="MAESTRO" numero="1456" 
        tarjetaSeleccionada={tarjetaSeleccionada} actualizarTarjeta={actualizarTarjeta}/>
        {tarjetas.map(tarjeta => (
          <ItemTarjeta
            key={tarjeta.cardNumber}
            operadora={tarjeta.cardOperator}
            numero={tarjeta.cardNumber}
            tarjetaSeleccionada={tarjetaSeleccionada}
            actualizarTarjeta={actualizarTarjeta}
          />
        ))}
      </ScrollView>
      <View style={style.buttonContainer}>
        <Button habilitado={true} theme="light" text="AGREGAR TARJETA" onPress={() => navigation.navigate('Agregar Tarjeta')}/>
        <Button habilitado={true} theme="dark" text="VOLVER" onPress={() => navigation.goBack()}/>
      </View>
    </View>
  )
}

const style = StyleSheet.create({
    screen:{
      justifyContent:"space-between",
      flex:1,
      flexGrow:1,
      backgroundColor: 'white',
      alignItems:"center",
      marginTop: Constants.statusBarHeight,
      paddingBottom:Constants.statusBarHeight*2
    },
    scroll:{
      justifyContent:"space-around",
      backgroundColor: 'white',
      alignItems:"center",
      margin:10,
      paddingBottom:10,
      width:Dimensions.get('window').width-20,
      height:Dimensions.get('window').height/1.5,
    },
    info:{
      width:Dimensions.get('window').width-24,
      backgroundColor:"#D3D3FE",
      justifyContent:"space-around",
      alignItems:"center",
      borderColor:"#5986EB",
      borderRadius:30,
      borderWidth:2,
      padding:8,
      marginVertical:-20
    },
    tituloInfo:{
      flexDirection:"row",
      justifyContent:"flex-start",
      alignItems:"center",
      paddingBottom:3
    },
    textoTitulo:{
      fontSize:20,
      fontWeight:"bold",
      color:'#6372FF',
      paddingLeft:4
    },
    cuerpo:{
      fontSize:15,
      fontWeight:"bold",
      textAlign:"justify",
      color:'#6372FF'
    },
    buttonContainer:{
      marginBottom:-40,
      paddingTop:15
    }
  })

export default S13Tarjetas
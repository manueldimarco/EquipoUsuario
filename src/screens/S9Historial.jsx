import React,{useState,useEffect} from "react";
import { ScrollView,View, Text,StyleSheet,Dimensions} from "react-native";
import MainButton from "../components/MainButton";
import Logotipo from "../components/Logotipo";
import ItemHistorial from "../components/ItemHistorial";
import Constants from 'expo-constants';
import Encabezado from "../components/Encabezado";
import * as SecureStore from 'expo-secure-store';

const S9Historial = ({navigation}) => {
    
  const [token, setToken] = useState('');
  SecureStore.getItemAsync("token").then((token) => setToken(token));
  console.log(token);
  const [historialData, setHistorialData] = useState([]);

    /*useEffect(() => {
      fetch('URL BACKEND', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`,
          },
        })
          .then(response => response.json())
          .then(data => setHistorialData(data))
          .catch(error => console.error('Error al obtener datos del backend:', error));
      }, []);*/



    return (
      <View style={style.screen}>
        <Logotipo/>
        <Encabezado texto="HISTORIAL"/>
        <ScrollView>
          <ItemHistorial fecha="4/10/2022" origen="Brandsen 805" destino="Corrientes 99" metodo="Tarjeta" chofer="Braulio Pérez" />
          <ItemHistorial fecha="9/10/2022" origen="Junin 70" destino="Luna 99" metodo="Tarjeta" chofer="Braulio Pérez" />
          <ItemHistorial fecha="4/10/2022" origen="Brandsen 805" destino="Villa 100" metodo="Tarjeta" chofer="Braulio Pérez" />
          {/*{historialData.map((viaje, index) => (
            <ItemHistorial
              key={index} 
              fecha={viaje.fecha}
              origen={viaje.origen}
              destino={viaje.destino}
              metodo={viaje.metodoPago}
              chofer={viaje.chofer}
            />
          ))}*/}
        </ScrollView>
        <View>
          <MainButton navigation={navigation}/>
        </View>
      </View>
    )
}

const style=StyleSheet.create({
  screen: {
    justifyContent: "space-between",
    flex:1,
    flexGrow: 1,
    backgroundColor: 'white',
    alignItems: "center",
    marginTop: Constants.statusBarHeight,
    paddingBottom:Constants.statusBarHeight*2
  }
})

export default S9Historial
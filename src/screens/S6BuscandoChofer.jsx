import React,{useState} from "react";
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import Constants from 'expo-constants';
import Button from "../components/Button";
import Modal from 'react-native-modal';
import Logotipo from "../components/Logotipo";
import host from '../../host';
import * as SecureStore from 'expo-secure-store';

const S6BuscandoChofer = ({ route, navigation }) => {

  const [token, setToken] = useState('');
  SecureStore.getItemAsync("token").then((token) => setToken(token));
  console.log(token);
  const {codigoViaje,origin, destination ,precio,distancia,movilidadReducida,metodoDePago,nroTarjeta} = route.params;
  console.log(codigoViaje);
  const [IsModalVisible, setIsModalVisible] = useState(false);

  const mostrarModal = () => {
    setIsModalVisible(true);
  };

  const cerrarModal = () => {
      setIsModalVisible(false);
      navigation.navigate('Origen');
  };

  const toResumen = () => {
    navigation.navigate('Resumen', {
      codigoViaje:codigoViaje,
      origin: origin,
      destination: destination,
      precio:precio,
      distancia:distancia,
      movilidadReducida:movilidadReducida,
      metodoDePago: metodoDePago,
      nroTarjeta:nroTarjeta,
    })
  }

  const enviarViajeAlServidor = async () => {
    
        try {
          const response = await fetch(host+'/user-int/trips/cancel/'+codigoViaje+'/trip/CANCELADO_SIN_CHOFER/status', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          });
    
          if (response.ok) {
            const data = await response.json();
            mostrarModal();
            console.log('Solicitud exitosa');
          } else {
            alert('No se pudo cancelar el viaje');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

  return (
    <View style={style.screen}>
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={style.text}>Buscando Chofer...</Text>
      </View>
      <View>
        <Button habilitado={true} theme="light" text="AVANZAR" onPress={() => toResumen()} />
        <Button habilitado={true} theme="dark" text="CANCELAR" onPress={() => toResumen()} />
      </View>
      <Modal style={{alignItems:'center'}} isVisible={IsModalVisible} onBackdropPress={cerrarModal}>
          <View style={style.modalContainer}>
              <Logotipo/>
              <Text style={style.modalText}>¡Viaje cancelado!</Text>
          </View>
      </Modal>  
    </View>
  );

}

const style = StyleSheet.create({
  screen: {
    justifyContent: "center",
    flexGrow: 1,
    backgroundColor: 'white',
    alignItems: "center",
    marginTop: Constants.statusBarHeight,
    marginBottom: Constants.statusBarHeight
  },
  text: {
    fontSize: 26,
    fontWeight:"bold",
    marginTop: 20,
    marginBottom: 20,
  },
  modalText: {
    color:'#6372ff',
    fontSize:20,
    textAlign:"center",
    marginVertical:20,
    marginHorizontal:-15,
    fontWeight:"bold"
  },
  modalContainer:{
      padding:15,
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor:'white',
      borderColor:'#6372ff',
      borderWidth:5,
      borderRadius:30
  }
})

export default S6BuscandoChofer


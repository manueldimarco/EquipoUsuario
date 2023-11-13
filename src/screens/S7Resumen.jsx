import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, Image, ScrollView } from 'react-native';
import Logotipo from "../components/Logotipo";
import Button from "../components/Button";
import Constants from 'expo-constants';
import Modal from 'react-native-modal';
import host from '../../host';
import * as SecureStore from 'expo-secure-store';

const S7Resumen = ({ route, navigation }) => {

  //Parámetros recibidos
  const { codigoViaje, origin, destination, precio, distancia, movilidadReducida, metodoDePago, nroTarjeta, chofer } = route.params;
  const [IsModalVisible, setIsModalVisible] = useState(false);
  const [token, setToken] = useState('');

  SecureStore.getItemAsync("token").then((token) => setToken(token));

  console.log(codigoViaje);
  /*   const chofer = {
      nombre: 'Braulio',
      apellido:'Pérez',
      vehiculo: 'Peugeot 207 negro',
      patente: 'AB123CD'
    } */

  const mostrarModal = () => {
    setIsModalVisible(true);
  };

  const cerrarModal = () => {
    setIsModalVisible(false);
    navigation.navigate('Origen');
  };

  const toViajeFinalizado = () => {
    navigation.navigate('ViajeFinalizado', {
      codigoViaje: codigoViaje,
      origin: origin,
      destination: destination,
      precio: precio,
      distancia: distancia,
      movilidadReducida: movilidadReducida,
      metodoDePago: metodoDePago,
      nroTarjeta: nroTarjeta,
      chofer: chofer
    })
  }

  const enviarViajeAlServidor = async () => {

    try {
      const response = await fetch(host + '/user-int/trips/cancel/' + codigoViaje + '/trip/CANCELADO_CON_CHOFER/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        mostrarModal();
      } else {
        alert('No se pudo cancelar el viaje');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <View style={style.screen}>
      <Logotipo />
      <View style={style.cartel}>
        <Text style={style.big}>¡VIAJE CONFIRMADO!</Text>
        <Text style={style.subtitulo}>{chofer.nombre} está en camino...</Text>
      </View>

      <ScrollView contentContainerStyle={style.scroll}>
        <View style={style.container}>
          <View style={style.texto}>
            <Text style={style.titulo}>Viajás con...</Text>
            <Text style={style.info}>{chofer.nombre} {chofer.apellido}</Text>
          </View>
          <Image source={require("../../assets/perfilChofer.png")} />
        </View>
        <View style={style.container}>
          <View style={style.texto}>
            <Text style={style.titulo}>Vehículo</Text>
            <Text style={style.info}>{chofer.vehiculo}</Text>
          </View>
          <Image source={require("../../assets/autito.png")} />
        </View>
        <View style={style.container}>
          <View style={style.texto}>
            <Text style={style.titulo}>Patente</Text>
            <Text style={style.info}>{chofer.patente}</Text>
          </View>
          <Image source={require("../../assets/patente.png")} />
        </View>
        <View style={style.container}>
          <View style={style.texto}>
            <Text style={style.titulo}>Llegada estimada</Text>
            <Text style={style.info}>11:30 - 11:45</Text>
          </View>
          <Image source={require("../../assets/reloj.png")} />
        </View>
        <View style={style.container}>
          <View style={style.texto}>
            <Text style={style.titulo}>Pagás con...</Text>
            <Text style={style.info}>{metodoDePago}</Text>
          </View>
          <Image source={require("../../assets/acuerdo.png")} />
        </View>
      </ScrollView>

      <View style={{ marginBottom: -30 }}>
        <Button habilitado={true} text="SIMULAR VIAJE" onPress={() => toViajeFinalizado()} />
        <Button habilitado={true} text="CANCELAR VIAJE" theme="dark" onPress={enviarViajeAlServidor} />
      </View>
      <Modal style={{ alignItems: 'center' }} isVisible={IsModalVisible} onBackdropPress={cerrarModal}>
        <View style={style.modalContainer}>
          <Logotipo />
          <Text style={style.modalText}>¡Viaje cancelado!</Text>
        </View>
      </Modal>
    </View>
  );
}

const style = StyleSheet.create({
  screen: {
    justifyContent: "space-between",
    flexGrow: 1,
    flex: 1,
    backgroundColor: 'white',
    alignItems: "center",
    marginTop: Constants.statusBarHeight,
    paddingBottom: Constants.statusBarHeight * 2,
  },
  cartel: {
    backgroundColor: '#A8B0FF',
    borderColor: '#6372FF',
    width: Dimensions.get('window').width - 50,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 2,
    padding: 10,
    borderRadius: 30
  },
  big: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  subtitulo: {
    fontStyle: "italic",
    fontSize: 22,
    textAlign: 'left',
  },
  scroll: {
    margin: 10,
    justifyContent: "space-around"
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5
  },
  texto: {
    width: Dimensions.get('window').width - 120,
    alignItems: "flex-start",
    justifyContent: "center"
  },
  titulo: {
    fontWeight: "bold",
    fontSize: 20
  },
  info: {
    fontStyle: "italic",
    fontSize: 17,
  },
  modalText: {
    color: '#6372ff',
    fontSize: 20,
    textAlign: "center",
    marginVertical: 20,
    marginHorizontal: -15,
    fontWeight: "bold"
  },
  modalContainer: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: '#6372ff',
    borderWidth: 5,
    borderRadius: 30
  }


});

export default S7Resumen
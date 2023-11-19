import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import Constants from 'expo-constants';
import Button from "../components/Button";
import Modal from 'react-native-modal';
import Logotipo from "../components/Logotipo";
import host from '../../host';
import * as SecureStore from 'expo-secure-store';
import { Client } from '@stomp/stompjs';
import 'text-encoding-polyfill'

const S6BuscandoChofer = ({ route, navigation }) => {

  const [token, setToken] = useState('');
  SecureStore.getItemAsync("token").then((token) => setToken(token));

  const { codigoViaje, origin, destination, precio, distancia, movilidadReducida, metodoDePago, nroTarjeta } = route.params;
  console.log(codigoViaje);
  const [IsModalVisible, setIsModalVisible] = useState(false);

  const [chofer, setChofer] = useState(null);

  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const socket = new WebSocket('wss://people-delivery-back-production.up.railway.app/user-int/ws');

    const stomp = new Client({
      forceBinaryWSFrames: true,
      appendMissingNULLonIncoming: true,
      webSocketFactory: () => socket,
      onConnect: (frame) => {
        console.log('Conectado al servidor de WebSocket');
        stomp.subscribe('/topic/update', (message) => {
          const payload = JSON.parse(message.body);
          const choferData = payload.chofer;
          console.log("chofer: "+choferData)
          setChofer(choferData);
        });
      },
      onDisconnect: (frame) => {
        console.log('Desconectado del servidor de WebSocket');
      },
      debug: (str) => {
        console.log(str);
      },
    });

    setStompClient(stomp);
    stomp.activate();

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, []);

  const mostrarModal = () => {
    setIsModalVisible(true);
  };

  const cerrarModal = () => {
    setIsModalVisible(false);
    navigation.navigate('Origen');
  };

  const toResumen = () => {
    navigation.navigate('Resumen', {
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
      const response = await fetch(host + '/user-int/trips/cancel/' + codigoViaje + '/trip/CANCELADO_SIN_CHOFER/status', {
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
      <View>
      {chofer ? (
          toResumen()
        ) : (
          <>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={style.text}>Buscando Chofer...</Text>
          </>
        )}
      </View>
      <View>
        <Button habilitado={true} theme="light" text="AVANZAR" onPress={() => toResumen()} />
        <Button habilitado={true} theme="dark" text="CANCELAR" onPress={() => enviarViajeAlServidor()} />
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
    justifyContent: "center",
    flexGrow: 1,
    backgroundColor: 'white',
    alignItems: "center",
    marginTop: Constants.statusBarHeight,
    marginBottom: Constants.statusBarHeight
  },
  text: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
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
})

export default S6BuscandoChofer


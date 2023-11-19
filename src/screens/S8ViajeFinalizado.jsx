import React, {useState} from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Logotipo from "../components/Logotipo";
import Button from "../components/Button";
import Icon from 'react-native-vector-icons/FontAwesome';
import Constants from 'expo-constants';
import Modal from 'react-native-modal';
import * as SecureStore from 'expo-secure-store';

const S8ViajeFinalizado = ({ route, navigation }) => {

  const [token, setToken] = useState('');
  SecureStore.getItemAsync("token").then((token) => setToken(token));
  
  //Parámetros recibidos
  const { codigoViaje,origin, destination,precio,distancia,movilidadReducida,metodoDePago,nroTarjeta,chofer } = route.params;
  const [IsModalVisible, setIsModalVisible] = useState(false);
  const [defaultRating, setDefaultRating] = useState(2)
  const [maxRating, setMaxRating] = useState([1,2,3,4,5])
  const starImgFilled = 'https://github.com/tranhonghan/images/blob/main/star_filled.png?raw=true'
  const starImageCorner = 'https://github.com/tranhonghan/images/blob/main/star_corner.png?raw=true'

  const mostrarModal = () => {
    setIsModalVisible(true);
  };

  const cerrarModal = () => {
    setIsModalVisible(false);
    navigation.navigate('Origen');
  };

  const CustomRatingBar = () => {
    return (
      <View style={style.customRatingBar}>
        {
          maxRating.map((item, key) => {
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                key={item}
                onPress={() => setDefaultRating(item)}
              >
                <Image
                  style={style.starImg}
                  source={
                    item <= defaultRating
                      ? {uri: starImgFilled}
                      : {uri: starImageCorner}
                  }
                />
              </TouchableOpacity>
            )
          })

        }
      </View>
    )
  }

  const confirmRating = () => {
    alert('Gracias, valoramos tu opinión ('+defaultRating+')')
  }

  const toCrearReclamo = () => {
    navigation.navigate('Crear Reclamo', {
      tipo:"de viaje",
      codigoViaje:codigoViaje,
      origin: origin,
      destination: destination,
      distancia:distancia,
      chofer: chofer
    })}

    const enviarCalificacion = async () => {
      const datos = {
        tripCode: codigoViaje,
        rating: defaultRating,
        driverId: chofer.idChofer
      };
  
      try {
        const response = await fetch(host+'/user-int/v1/reviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(datos),
        });
  
        if (response.ok) {
          const data = await response.json();
          mostrarModal();
        } else {
          Alert('No se pudo enviar calificacion. Intente nuevamente');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

  return (
    <View style={style.screen}>
      <Logotipo />
      <View style={style.container}>
        <Text style={style.titulo}>¡VIAJE FINALIZADO!</Text>
        <Icon name="flag-checkered" size={120} color="black"/>
      </View>
      <View style={[style.container,{marginBottom:-10}]}>
        <Text style={style.subtitulo}>Evalúa a {chofer.nombre}</Text>
        <CustomRatingBar/>
        <TouchableOpacity onPress={() => toCrearReclamo()}>
          <View style={style.reclamo}>
            <Image source={require("../../assets/reclama.png")}/>
            <Text style={style.texto}>Emite un reclamo</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={[style.container,style.buttonContainer]}>
        <Button habilitado={true} text="CONFIRMAR" theme="light" onPress={enviarCalificacion} />
        <Button habilitado={true} text="NO EVALUAR" theme="dark" onPress={mostrarModal} />
      </View>      
      <Modal style={{alignItems:'center'}} isVisible={IsModalVisible} onBackdropPress={cerrarModal}>
          <View style={style.modalContainer}>
              <Logotipo/>
              <Text style={style.modalText}>¡Gracias por viajar {'\n'}con nosotros!</Text>
          </View>
      </Modal>  
    </View>
  );
}

const style = StyleSheet.create({
  screen:{
    justifyContent:"space-between",
    flexGrow:1,
    flex:1,
    backgroundColor: 'white',
    alignItems:"center",
    marginTop: Constants.statusBarHeight,
    paddingBottom:Constants.statusBarHeight*2,
  },
  container: {
    margin:10,
    paddingVertical:5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  logo: {
    width: 100,
    height: 100,
  },
  titulo: {
    fontSize: 29,
    fontWeight: 'bold'
  },
  subtitulo: {
    fontSize: 22
  },
  buttonContainer:{
    marginBottom:-35,
    paddingTop:15
  },
  icono: {
    marginRight: 10, // Espacio entre el ícono y el texto
  },
  customRatingBar: {
    justifyContent: 'center',
    flexDirection: 'row',
    margin:10
  },
  starImg: {
    width: 40,
    height: 40,
    marginHorizontal:2,
    resizeMode: 'cover',
  },
  reclamo: {
    flexDirection:"row",
    alignItems:"center",
    marginTop: 5
  },
  texto:{
    fontStyle:"italic",
    fontSize:18,
    marginLeft:10
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

export default S8ViajeFinalizado
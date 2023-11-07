import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import * as Location from 'expo-location';
import { Icon } from 'react-native-elements'
import Searchbar from '../components/Searchbar';
import Button from "../components/Button";
import MainButton from '../components/MainButton';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import Modal from 'react-native-modal';
import Logotipo from '../components/Logotipo';
import host from '../../host';

//Token de aceeso a Mapbox
Mapbox.setAccessToken('pk.eyJ1IjoidmVyY2UiLCJhIjoiY2xtZmcxdmhiMDBtdzNyc2VnMDM0NWx4NiJ9.CUQzx8BsTEkrATJeiMZ4VA');

const S4aMapaOrigen = ({navigation}) => {
  const [IsModalVisible, setIsModalVisible] = useState(false);
  
  const [token, setToken] = useState('');
  
  SecureStore.getItemAsync("token").then((token) => setToken(token));
  console.log(token);

  const [existHome, setExistHome] = useState(false);

  const handleExistsHome=()=>{
    if(existHome){
      handleHomePress();
    } else{
      setIsModalVisible(true);
    }
  }
  const obtenerDireccion = async () => {
    try {
      const response = await fetch(host + '/user-int/v1/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHomeAddress(data.adress);
      } else {
        console.error('Error al obtener datos del usuario');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  //Coordenadas CABA para la proximidad
  const coordsCABA = '-34.61315,-58.37723';

  const [homeAddress, setHomeAddress] = useState('');
  const [homeLong, setHomeLong] = useState(0);
  const [homeLat, setHomeLat] = useState(0);

  //Ubicación inicial (obtenida del dispositivo)
  const [location, setLocation] = useState(null);

  //Latitud y longitud de las ubicaciones seleccionadas
  const [latOrigin, setLatOrigin] = useState(0);
  const [longOrigin, setLongOrigin] = useState(0);

  const [showOrigin, setShowOrigin] = useState(false);

  const [searchOrigin, setSearchOrigin] = useState('');

  const camera = useRef(null);

  //Obtener localización del dispositivo
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }
      /*       const currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation.coords); */
      try {
        const currentLocation = await getCurrentLocation();
        setLocation(currentLocation.coords);
      } catch (error) {
        console.error('Error al obtener la ubicación:', error);
      }

    })();
  }, []);

  function getCurrentLocation() {
    const timeout = 10000;
    return new Promise(async (resolve, reject) => {
      setTimeout(() => { reject(new Error(`Error getting gps location after ${(timeout * 2) / 1000} s`)) }, timeout * 2);
      setTimeout(async () => { resolve(await Location.getLastKnownPositionAsync()) }, timeout);
      resolve(await Location.getCurrentPositionAsync());
    });
  }

  //Movimiento de cámara
  const moveCamera = (lon, lat) => {
    camera.current?.setCamera({
      centerCoordinate: [lon, lat],
      zoomLevel: 12,
      animationMode: "flyTo",
      animationDuration: 2000,
    });
  }

  //Actualizar posición de cámara basada en el punto de origen
  useEffect(() => {
    if (latOrigin !== 0 && longOrigin !== 0) {
      moveCamera(longOrigin, latOrigin);
    }
  }, [latOrigin, longOrigin]);

  //Obtener coordenadas a partir del texto (origen)
  const geocoding = async () => {
    try {
      const response = await fetch(
        'https://api.mapbox.com/geocoding/v5/mapbox.places/' + searchOrigin +
        '.json?proximity=' + coordsCABA +
        '&access_token=pk.eyJ1IjoidmVyY2UiLCJhIjoiY2xtZmcxdmhiMDBtdzNyc2VnMDM0NWx4NiJ9.CUQzx8BsTEkrATJeiMZ4VA',
      );
      const json = await response.json();

      setLatOrigin(json.features[0].center[1]);
      setLongOrigin(json.features[0].center[0]);
      setShowOrigin(true);

      return json;
    } catch (error) {
      if (searchOrigin === '') {
        alert('Ingrese un punto de origen');
      }
    }
  };

  const geocodingAddress = async () => {
    try {
      const response = await fetch(
        'https://api.mapbox.com/geocoding/v5/mapbox.places/' + homeAddress +
        '.json?proximity=-34.61315,-58.37723&' +
        'access_token=pk.eyJ1IjoidmVyY2UiLCJhIjoiY2xtZmcxdmhiMDBtdzNyc2VnMDM0NWx4NiJ9.CUQzx8BsTEkrATJeiMZ4VA',
      );
      const json = await response.json();

      setHomeLat(json.features[0].center[1]);
      setHomeLong(json.features[0].center[0]);

      return json;
    } catch (error) {
      if (homeAddress === '') {
        alert('No se tiene guardada una dirección por defecto');
      }
    }
  };

/*   geocodingAddress(); */

  const goHome=()=>{
    navigation.navigate('Direccion Por Defecto');
    setIsModalVisible(false);
  }

  //Obtener punto de interés (nombre) a partir de las coordenadas
  const reverseGeocoding = async (lat, long) => {
    try {
      const response = await fetch(
        'https://api.mapbox.com/geocoding/v5/mapbox.places/' + long + ',' + lat +
        '.json?types=poi&access_token=pk.eyJ1IjoidmVyY2UiLCJhIjoiY2xtZmcxdmhiMDBtdzNyc2VnMDM0NWx4NiJ9.CUQzx8BsTEkrATJeiMZ4VA'
      );
      const json = await response.json();

      const placeName = JSON.stringify(json.features[0].place_name);

      setSearchOrigin(placeName);

    } catch (error) {
      console.error(error);
    }
  }

  obtenerDireccion()
  .then(() => {
    geocodingAddress();
  })

  //Navegación con parámetros
  const toMapaDestino = () => {
    if (latOrigin === 0) {
      alert('Ingrese un punto de partida')
    } else {
      navigation.navigate('Destino', {
        originText: searchOrigin,
        latOrigin: latOrigin,
        longOrigin: longOrigin,
        homeLat: homeLat,
        homeLong: homeLong,
      })
    }
  }

  //Actualización del destino cuando se toca en el mapa
  const handleMapPress = (event) => {
    setLatOrigin(event.geometry.coordinates[1]);
    setLongOrigin(event.geometry.coordinates[0]);
    setShowOrigin(true);
    reverseGeocoding(event.geometry.coordinates[1], event.geometry.coordinates[0]);
  }

  const handleMyLocationPress = () => {
    if (homeLat == 0 && homeLong && 0) {
      alert('No se ingresó una dirección por defecto, seleccione una a continuación')
    } else {
      moveCamera(location.longitude, location.latitude);
      setLatOrigin(location.latitude);
      setLongOrigin(location.longitude);
      setSearchOrigin("Tu ubicación");
      setShowOrigin(true);
    }
  }

  const handleHomePress = () => {
    moveCamera(homeLong, homeLat);
    setLatOrigin(homeLat);
    setLongOrigin(homeLong);
    setSearchOrigin("Casa");
    setShowOrigin(true);
  }

  return (
    <View style={styles.page}>
      <View style={styles.overlayContainer1}>
        <Searchbar
          actualizarCampo={setSearchOrigin}
          instructivo="Origen"
          searchOrigin={searchOrigin}
        />
        <Icon name="arrow-circle-up" type='font-awesome' size={50} color='green' onPress={() => geocoding()} />
      </View>
      <View style={styles.overlayContainer2}>
        <Icon name="my-location" type='material-icons' size={40} color='black' onPress={() => handleMyLocationPress()} />
        <Text style={styles.text} >Utilizar mi ubicación actual</Text>
      </View>
      <View style={styles.overlayContainer3}>
        <Icon name="home" type='font-awesome' size={40} color='black' onPress={() => handleExistsHome()} />
        <Text style={styles.text} >Utilizar mi ubicación guardada</Text>
      </View>
      {location && (
        <Mapbox.MapView
          title='map'
          style={styles.map}
          onPress={handleMapPress}
        >
          <Mapbox.Camera
            zoomLevel={12}
            centerCoordinate={[location.longitude, location.latitude]}
            animationMode="flyTo"
            animationDuration={2000}
            ref={camera}
          />
          <Mapbox.PointAnnotation
            id='currentLocation'
            coordinate={[location.longitude, location.latitude]}
          >
            <View>
              <Icon name="my-location" type='material-icons' size={30} color='blue' />
            </View>
          </Mapbox.PointAnnotation>
          <Mapbox.PointAnnotation
            id='home'
            coordinate={[homeLong, homeLat]}
          >
            <View>
              <Icon name="home" type='font-awesome' size={30} color='blue' />
            </View>
          </Mapbox.PointAnnotation>
          {showOrigin && (
            <Mapbox.PointAnnotation
              id='origin'
              coordinate={[longOrigin, latOrigin]}
            >
              <View>
                <Icon name="arrow-circle-up" type='font-awesome' size={30} color='green' />
              </View>
            </Mapbox.PointAnnotation>
          )}
        </Mapbox.MapView>
      )}
      <View style={styles.navContainer}>
        <Button title='Confirmar' text='CONFIRMAR ORIGEN' habilitado={true} onPress={() => toMapaDestino()} />
        <MainButton navigation={navigation}/>
      </View>
      <Modal style={{alignItems:'center'}} isVisible={IsModalVisible} onBackdropPress={()=>setIsModalVisible(false)}>
          <View style={styles.modalContainer}>
              <Logotipo/>
              <Text style={styles.modalText}>No tienes una ubicación por defecto guardada. ¿Quieres establecer una ubicación por defecto?</Text>
              <View style={styles.botonesModal}>
                <TouchableOpacity onPress={()=>goHome()}>
                  <View style={[styles.boton,{backgroundColor:"#6372ff"}]}>
                    <Text style={{color:'black',fontSize:18}}>SI</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>setIsModalVisible(false)}>
                  <View style={[styles.boton,{backgroundColor:"black"}]}>
                    <Text style={{color:'white',fontSize:18}}>NO</Text>
                  </View>
                </TouchableOpacity>
              </View>
          </View>
      </Modal>  
    </View>
  );
}

export default S4aMapaOrigen;

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    marginTop: Constants.statusBarHeight,
  },
  map: {
    flexGrow: 1,
    zIndex: 0,
  },
  overlayContainer1: {
    position: 'absolute',
    top: Constants.statusBarHeight,
    left: 0,
    right: 0,
    zIndex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  overlayContainer2: {
    position: 'absolute',
    top: Constants.statusBarHeight * 3.5,
    left: 0,
    right: 0,
    zIndex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: Constants.statusBarHeight / 2,
    backgroundColor: 'rgba(52, 52, 52, 0.15)',
  },
  overlayContainer3: {
    position: 'absolute',
    top: Constants.statusBarHeight * 5.25,
    left: 0,
    right: 0,
    zIndex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: Constants.statusBarHeight / 2,
    backgroundColor: 'rgba(52, 52, 52, 0.15)',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  navContainer: {
    position: 'absolute',
    top: Constants.statusBarHeight * 20,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
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
    },
    botonesModal:{
      flexDirection:"row",
      alignItems:"center",
      justifyContent:"space-around",
      marginHorizontal:10    
    },
    boton:{
      borderRadius:40,
      borderColor:'black',
      borderWidth:2,
      paddingVertical:10,
      paddingHorizontal:25,
      margin:5
    }
});
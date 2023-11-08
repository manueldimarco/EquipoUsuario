import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Constants from 'expo-constants';
import Searchbar from '../components/Searchbar';
import Mapbox from '@rnmapbox/maps';
import { Icon } from 'react-native-elements'
import * as Location from 'expo-location';
import Button from '../components/Button';
import Modal from 'react-native-modal';
import host from '../../host';
import Logotipo from '../components/Logotipo';
import * as SecureStore from 'expo-secure-store';

const S12DireccionPorDefecto = ({ navigation }) => {
    
    const [token, setToken] = useState('');
    SecureStore.getItemAsync("token").then((token) => setToken(token));
    
    const [IsModalVisible, setIsModalVisible] = useState(false);

    //Coordenadas CABA para la proximidad
    const coordsCABA = '-34.61315,-58.37723';

    //Ubicación inicial (obtenida del dispositivo)
    const [location, setLocation] = useState(null);

    //Latitud y longitud de las ubicaciones seleccionadas
    const [latDestination, setLatDestination] = useState(0);
    const [longDestination, setLongDestination] = useState(0);

    const [homeName, setHomeName] = useState('');
    const [showHome, setShowHome] = useState(false);

    const [confirmEnabled, setConfirmEnabled] = useState(false);

    const [search, setSearch] = useState('');

    const camera = useRef(null);

    const mostrarModal = () => {
        setIsModalVisible(true);
    };

    const cerrarModal = () => {
        setIsModalVisible(false);
        navigation.navigate('Configuracion');
    };

    //Obtener localización del dispositivo
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                console.error('Permission to access location was denied');
                return;
            }
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

    const moveCamera = (lon, lat) => {
        camera.current?.setCamera({
          centerCoordinate: [lon, lat],
          zoomLevel: 12,
          animationMode: "flyTo",
          animationDuration: 2000,
        });
      }

    const geocoding = async () => {
        try {
            const response = await fetch(
                'https://api.mapbox.com/geocoding/v5/mapbox.places/' + search +
                '.json?proximity=' + coordsCABA +
                '&access_token=pk.eyJ1IjoidmVyY2UiLCJhIjoiY2xtZmcxdmhiMDBtdzNyc2VnMDM0NWx4NiJ9.CUQzx8BsTEkrATJeiMZ4VA',
            );
            const json = await response.json();

            setLatDestination(json.features[0].center[1]);
            setLongDestination(json.features[0].center[0]);
            setShowHome(true);
            setHomeName(reverseGeocoding(json.features[0].center[1], json.features[0].center[0]));
            moveCamera(json.features[0].center[0], json.features[0].center[1]);
            setConfirmEnabled(true);

            return json;
        } catch (error) {
            if (search === '') {
                alert('Ingrese un punto en el mapa');
            }
        }
    };

    //Obtener punto de interés (nombre) a partir de las coordenadas
    const reverseGeocoding = async (lat, long) => {
        try {
            const response = await fetch(
                'https://api.mapbox.com/geocoding/v5/mapbox.places/' + long + ',' + lat +
                '.json?types=poi&access_token=pk.eyJ1IjoidmVyY2UiLCJhIjoiY2xtZmcxdmhiMDBtdzNyc2VnMDM0NWx4NiJ9.CUQzx8BsTEkrATJeiMZ4VA'
            );
            const json = await response.json();
            const placeName = JSON.stringify(json.features[0].place_name);
            setHomeName(placeName);
            setShowHome(true);
            setConfirmEnabled(true);
            setSearch(placeName);
            moveCamera(long, lat);
        } catch (error) {
            /* console.error(error); */
            alert('El punto ingresado no es válido');
            setConfirmEnabled(false);
        }
    }

    const handleMapPress = (event) => {
        setLatDestination(event.geometry.coordinates[1]);
        setLongDestination(event.geometry.coordinates[0]);
        reverseGeocoding(event.geometry.coordinates[1], event.geometry.coordinates[0]);
        setConfirmEnabled(true);
    }

    const handleMyLocationPress = () => {
        moveCamera(location.longitude, location.latitude);
        setLatDestination(location.latitude);
        setLongDestination(location.longitude);
        setSearch('Tu ubicación');
        setConfirmEnabled(true);
        setShowHome(true);
      }

    const actualizarDireccion = async () => {
        const datos = {
          adress:homeName
        };
    
        try {
          const response = await fetch(host+'/user-int/v1/users', {
            method: 'PATCH',
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
            Alert('No se pudo actualizar dirección. Intente nuevamente');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

    return (
        <View style={styles.screen}>
            <View style={styles.overlayContainer1}>
                <Searchbar
                    actualizarCampo={setSearch}
                    instructivo="Dirección por defecto"
                    searchOrigin={search}
                    onSubmitEditing={() => geocoding()}
                />
                <Icon name="home" type='font-awesome' size={50} color='red' onPress={() => geocoding()} />
            </View>
            <View style={styles.overlayContainer2}>
                <Icon name="my-location" type='material-icons' size={40} color='black' onPress={() => handleMyLocationPress()} />
                <Text style={styles.text} >Utilizar mi ubicación actual</Text>
            </View>
            {location && (
                <Mapbox.MapView title='map' style={styles.map} onPress={handleMapPress}>
                    <Mapbox.Camera
                        zoomLevel={10}
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
                            <Icon name="my-location" type='material-icons' color='blue' />
                        </View>
                    </Mapbox.PointAnnotation>
                    {showHome && (
                        <Mapbox.PointAnnotation
                            id='destination'
                            coordinate={[longDestination, latDestination]}
                        >
                            <View>
                                <Icon name="home" type='material' color='red' />
                            </View>
                        </Mapbox.PointAnnotation>
                    )}
                </Mapbox.MapView>
            )}
            <View style={styles.confirmContainer}>
                <Button title='Confirmar' text='CONFIRMAR' habilitado={confirmEnabled} onPress={() => actualizarDireccion()} />
                <Button title='Volver' theme='dark' text='VOLVER' habilitado={true} onPress={() => navigation.goBack()}/>
            </View>
            <Modal style={{alignItems:'center'}} isVisible={IsModalVisible} onBackdropPress={cerrarModal}>
                <View style={styles.modalContainer}>
                    <Logotipo/>
                    <Text style={styles.modalText}>¡Dirección actualizada!</Text>
                </View>
            </Modal>  
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flexGrow: 1,
        marginTop: Constants.statusBarHeight,
    },
    container: {
        height: '100%',
        width: '100%',
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
    confirmContainer: {
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
    }
})

export default S12DireccionPorDefecto
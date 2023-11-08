import React,{useState} from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import S1bienvenida from '../src/screens/S1bienvenida';
import S2registro from '../src/screens/S2registro';
import S3recupero from '../src/screens/S3recupero';
import S4aMapaOrigen from '../src/screens/S4aMapaOrigen';
import S4bMapaDestino from '../src/screens/S4bMapaDestino';
import S5OpcionesViaje from '../src/screens/S5OpcionesViaje';
import S6BuscandoChofer from '../src/screens/S6BuscandoChofer';
import S7Resumen from '../src/screens/S7Resumen';
import S8ViajeFinalizado from '../src/screens/S8ViajeFinalizado';
import S9Historial from '../src/screens/S9Historial';
import S10Configuracion from '../src/screens/S10Configuracion';
import S11Perfil from '../src/screens/S11Perfil';
import S13Tarjetas from '../src/screens/S13Tarjetas';
import S14Reclamos from '../src/screens/S14Reclamos';
import S15QuienesSomos from '../src/screens/S15QuienesSomos';
import S12DireccionPorDefecto from '../src/screens/S12DireccionPorDefecto';
import S16CrearReclamo from '../src/screens/S16CrearReclamo';
import S17AgregarTarjeta from '../src/screens/S17AgregarTarjeta';
import { guardarToken,obtenerToken, borrarToken } from '../secureStore';

const Stack = createNativeStackNavigator()

const MainStack = (props) => {
    const [isLogged, setIsLogged] = useState(false);
    const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState('');

    const iniciarSesion = async (token) => {
        setIsLogged(true);
        await guardarToken(token); 
    };

    const cerrarSesion = async () => {
        setIsLogged(false);
        await borrarToken();
    };
 
    const actualizarTarjeta=(numero)=>{
        setTarjetaSeleccionada(numero)
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown:false}}>
                {isLogged ? (
                    <>
                        <Stack.Screen name='Origen'>
                            {(props) => <S4aMapaOrigen {...props}/>}
                        </Stack.Screen>
                        <Stack.Screen name = 'Destino' component = {S4bMapaDestino}/>
                        <Stack.Screen name = 'OpcionesViaje'>
                            {(props) => <S5OpcionesViaje {...props} tarjetaSeleccionada={tarjetaSeleccionada}/>}
                        </Stack.Screen>
                        <Stack.Screen name = 'BuscandoChofer' component = {S6BuscandoChofer}/>
                        <Stack.Screen name='Resumen' component={S7Resumen}/>
                        <Stack.Screen name = 'ViajeFinalizado' component = {S8ViajeFinalizado}/>
                        <Stack.Screen name = 'Historial' component = {S9Historial}  />
                        <Stack.Screen name='Configuracion'>
                            {(props) => <S10Configuracion {...props} cerrarSesion={cerrarSesion}/>}
                        </Stack.Screen>
                        <Stack.Screen name='Perfil'>
                            {(props) => <S11Perfil {...props} />}
                        </Stack.Screen>
                        <Stack.Screen name='Direccion Por Defecto'>
                            {(props) => <S12DireccionPorDefecto {...props} />}
                        </Stack.Screen>
                        <Stack.Screen name='Tarjetas'>
                            {(props) => <S13Tarjetas {...props} actualizarTarjeta={actualizarTarjeta} tarjetaSeleccionada={tarjetaSeleccionada} />}
                        </Stack.Screen>
                        <Stack.Screen name = 'Reclamos' component = {S14Reclamos} />
                        <Stack.Screen name = 'Quienes Somos' component = {S15QuienesSomos} />
                        <Stack.Screen name = 'Crear Reclamo' component = {S16CrearReclamo} />
                        <Stack.Screen name = 'Agregar Tarjeta' component = {S17AgregarTarjeta} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name='Bienvenida'>
                            {(props) => <S1bienvenida {...props} iniciarSesion={iniciarSesion}/>}
                        </Stack.Screen>
                        <Stack.Screen name = 'Registro' component = {S2registro} />
                        <Stack.Screen name = 'Recupero' component = {S3recupero}/>
                    </>
                )}    
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default MainStack
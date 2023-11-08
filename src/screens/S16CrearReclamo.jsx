import React,{useState,useEffect} from "react";
import { Text,View,ScrollView,Dimensions,StyleSheet,TextInput} from "react-native";
import Logotipo from "../components/Logotipo";
import Button from "../components/Button";
import Constants from 'expo-constants';
import Input from "../components/Input";
import Encabezado from "../components/Encabezado";
import Modal from 'react-native-modal';
import host from '../../host';
import * as SecureStore from 'expo-secure-store';

const S16CrearReclamo=({route,navigation})=>{
    
    const [token, setToken] = useState('');
    SecureStore.getItemAsync("token").then((token) => setToken(token));

    const { tipo,codigoViaje,origin,destination,distancia,chofer } = route.params;
    const [nombre,setNombre]=useState("");
    const [descripcion,setDescripcion]=useState("");
    const [habilitado, setHabilitado] = useState(false); 
    const [IsModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        setHabilitado(nombre.length>1 && descripcion.length>1);
    }, [nombre,descripcion]);

    const mostrarModal = () => {
      setIsModalVisible(true);
    };
    
    const cerrarModal = () => {
        setIsModalVisible(false);
        navigation.goBack();
    };

    const enviarReclamoAlServidor = async () => {
        const datos = {
          type:tipo,
          tripCode:codigoViaje,
          title: nombre,
          description: descripcion,
          driverCode: chofer.nombre+' '+chofer.apellido
        };
    
        try {
          const response = await fetch(host+'/user-int/claims/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(datos),
          });
    
          if (response.ok) {
            const data = await response.json();
            mostrarModal();
          } else {
            console.error('Error al cargar reclamo');
            Alert('Error al cargar reclamo.Intente nuevamente');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

    return(
        <ScrollView contentContainerStyle={style.screen}>
            <Logotipo/>
            <Encabezado texto="CREAR RECLAMO"/>
            <View style={style.formulario}>
                <Text style={style.texto}>Nombre del reclamo</Text>
                <Input actualizarCampo={setNombre} instructivo="Nombre del reclamo..." />
                <Text style={style.texto}>Descripción</Text>
                <TextInput  style={style.input} multiline placeholder="Contanos que sucedió..." value={descripcion} 
                numberOfLines={10} placeholderTextColor="gray" onChangeText={(descripcion) => setDescripcion(descripcion)}
                />
            </View>
            <View>
                <Button habilitado={habilitado} theme="light" text="ENVIAR RECLAMO" onPress={enviarReclamoAlServidor}/>
                <Button habilitado={true} theme="dark" text="VOLVER SIN GUARDAR" onPress={() => navigation.goBack()}/>
            </View>
            
            <Modal style={{alignItems:'center'}} isVisible={IsModalVisible} onBackdropPress={cerrarModal}>
                <View style={style.modalContainer}>
                    <Logotipo/>
                    <Text style={style.modalText}>¡Reclamo enviado!</Text>
                </View>
            </Modal>    
        </ScrollView>
    )
    
}

const style=StyleSheet.create({
    screen:{
        justifyContent:"space-between",
        flexGrow:1,
        backgroundColor: 'white',
        alignItems:"center",
        marginTop: Constants.statusBarHeight,
        paddingBottom:Constants.statusBarHeight*2
    },
    formulario:{
        margin:10,
        justifyContent:"space-around"
    },
    input:{
        alignItems:"center",
        width:Dimensions.get('window').width-60,
        fontSize:17,
        borderColor: "black",
        borderWidth: 2,
        borderRadius:30,
        paddingLeft: 15,
        paddingRight: 10,
        paddingVertical:10,
        marginVertical:5,
    },
    texto:{
        fontWeight:"bold",
        fontSize:18,
        marginTop:5
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

export default S16CrearReclamo
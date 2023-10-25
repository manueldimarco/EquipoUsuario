import React,{useState,useEffect} from "react";
import { Text,View,ScrollView,Dimensions,StyleSheet} from "react-native";
import Logotipo from "../components/Logotipo";
import Button from "../components/Button";
import Constants from 'expo-constants';
import Input from "../components/Input";
import Encabezado from "../components/Encabezado";
import Modal from 'react-native-modal';
import host from '../../host';
import * as SecureStore from 'expo-secure-store';

const S17AgregarTarjeta=({navigation})=>{

    const [token, setToken] = useState('');
    SecureStore.getItemAsync("token").then((token) => setToken(token));
    console.log(token);

    const [operadora,setOperadora]=useState("");
    const [numero,setNumero]=useState("");
    const [mesVencimiento,setMesVencimiento]=useState("");
    const [anoVencimiento,setAnoVencimiento]=useState("");
    const [codigo,setCodigo]=useState("");
    const [habilitado, setHabilitado] = useState(false); 
    const [IsModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        const operadoraValida = operadora.length>0;
        const numeroValido = validarTarjeta(numero);
        const mesValido = validarVencimiento(mesVencimiento);
        const anoValido = validarVencimiento(anoVencimiento);
        const codigoValido = validarCodigo(codigo);
        setHabilitado(operadoraValida && numeroValido && mesValido && anoValido && codigoValido);
    }, [operadora,numero,mesVencimiento,anoVencimiento,codigo]);

    function validarTarjeta(numero) {
      const expresionRegular = /^\d{16}$/;
      return expresionRegular.test(numero);
    } 

    function validarVencimiento(cadena) {
        const expresionRegular = /^\d{2}$/;
        return expresionRegular.test(cadena);
    }

    function validarCodigo(cadena) {
        const expresionRegular = /^\d{3}$/;
        return expresionRegular.test(cadena);
    }

    const mostrarModal = () => {
      setIsModalVisible(true);
    };
    
    const cerrarModal = () => {
        setIsModalVisible(false);
        navigation.navigate('Tarjetas');
    };

    const enviarTarjetaAlServidor = async () => {
        const datos = {
          cardNumber: numero,
          cardOperator: operadora,
          cardExpirationDate: mesVencimiento + "/" + anoVencimiento,
          cardCVV: codigo,
        };
    
        try {
          const response = await fetch(host+'/user-int/cards/create', {
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
            console.log('Solicitud exitosa');
          } else {
            console.error('No se pudo registrar la tarjeta');
            console.log(token);
            Alert('No se pudo registrar la tarjeta');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

    return(
        <ScrollView contentContainerStyle={style.screen}>
            <Logotipo/>
            <Encabezado texto="AGREGAR TARJETA"/>
            <View style={style.formulario}>
                <Text style={style.texto}>OPERADORA</Text>
                <Input actualizarCampo={setOperadora} instructivo="Operadora..." />
                <Text style={style.texto}>NÚMERO DE TARJETA</Text>
                <Input actualizarCampo={setNumero} instructivo="Escriba sin espacios" />
                <Text style={style.texto}>MES DE VENCIMIENTO (MM)</Text>
                <Input actualizarCampo={setMesVencimiento} instructivo="MM" />
                <Text style={style.texto}>AÑO DE VENCIMIENTO (YY)</Text>
                <Input actualizarCampo={setAnoVencimiento} instructivo="YY" />
                <Text style={style.texto}>CÓDIGO DE SEGURIDAD</Text>
                <Input actualizarCampo={setCodigo} instructivo="Ver 3 dígitos al dorso" />
            </View>
            <View>
                {/*<Button habilitado={habilitado} theme="light" text="AÑADIR TARJETA" onPress={enviarTarjetaAlServidor}/>*/}
                <Button habilitado={habilitado} theme="light" text="AÑADIR TARJETA" onPress={() => navigation.goBack()}/>
                <Button habilitado={true} theme="dark" text="VOLVER SIN GUARDAR" onPress={() => navigation.goBack()}/>
            </View>
            
            <Modal style={{alignItems:'center'}} isVisible={IsModalVisible} onBackdropPress={cerrarModal}>
                <View style={style.modalContainer}>
                    <Logotipo/>
                    <Text style={style.modalText}>La tarjeta se ha añadido a tu lista de tarjetas</Text>
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

export default S17AgregarTarjeta
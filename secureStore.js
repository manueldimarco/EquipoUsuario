import * as SecureStore from 'expo-secure-store';

export const guardarToken = async (token) => {
  try {
    await SecureStore.setItemAsync('token', token);
  } catch (error) {
    console.error('Error al guardar en SecureStore:', error);
  }
};

export const obtenerToken = async () => {
  try {
    const valor = await SecureStore.getItemAsync('token');
    return valor;
  } catch (error) {
    console.error('Error al obtener de SecureStore:', error);
  }
};

export const borrarToken = async () => {
  try {
    await SecureStore.deleteItemAsync('token');
  } catch (error) {
    console.error('Error al borrar de SecureStore:', error);
  }
};

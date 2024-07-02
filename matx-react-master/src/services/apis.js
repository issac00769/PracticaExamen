import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5298"
});

export const obtenerUsuarios = async () => {
  try {
    const response = await api.get("/Usuarios");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const buscarUsuariosPorNombre = async (nombre) => {
  try {
    const response = await api.get(`/Usuarios/search/${nombre}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const eliminarUsuario = async (id) => {
  try {
    await api.delete(`/Usuarios/${id}`);
  } catch (error) {
    throw error;
  }
};

export const actualizarUsuario = async (id, usuario) => {
  try {
    await api.put(`/Usuarios/${id}`, usuario);
  } catch (error) {
    throw error;
  }
};

export const crearUsuario = async (usuario) => {
  try {
    const response = await api.post("/Usuarios", usuario);
    return response.data;
  } catch (error) {
    throw error;
  }
};

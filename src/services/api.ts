import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.0.103:3333' //endereço ip da minha maquina
});

export default api;
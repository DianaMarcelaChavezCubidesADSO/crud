import { URL } from "./config.js";
const solicitud = async (url) => {
    let solicitud = await fetch(`${URL}/${url}`);
    let data = await solicitud.json();
    return data;
};

const enviar = async (endpoint, option) =>{
try {
    let solicitud = await fetch(`${URL}/${endpoint}`,option)
    let data = await solicitud.json();
    return data  
} catch (error) {
    return error
}
}
export default solicitud;
export { enviar };
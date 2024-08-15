import is_valid from './modulo/is_valid.js';

const formulario = document.querySelector("form");
const nombre = document.querySelector("#nombre");
const boton = document.querySelector("#button");

formulario.addEventListener("submit", (event) => {
    event.preventDefault(); 
    let respuesta = is_valid(event, "form [required]");
    const data = {
        nombre: nombre.value,
    };
    if (respuesta) {
        fetch('http://localhost:3000/documents', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then((respuesta) => respuesta.json()) 
        .then((json) => {
            nombre.value = "";
            boton.removeAttribute("disabled"); 
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
});

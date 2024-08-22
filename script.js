import correo from './modulo/correo.js';
import numeros from './modulo/numeros.js';
import letras from './modulo/letras.js';
import is_valid from './modulo/is_valid.js';
import solicitud, { enviar } from './modulo/ajax.js';


const $formulario = document.querySelector("form");
const nombre = document.querySelector("#nombre");
const apellido = document.querySelector("#apellido");
const telefono = document.querySelector("#telefono");
const direccion = document.querySelector("#direccion");
const tipo_documento = document.querySelector("#tipo_documento");
const documento = document.querySelector("#documento");
const politicas = document.querySelector("#politicas");
const button = document.querySelector('#button');
const email = document.querySelector("#email");
const tp_users = document.querySelector("#tb_users").content;
const fragmento = document.createDocumentFragment();
const tbody = document.querySelector("tbody");
const id = document.querySelector(`#user`);


console.log(tb_users);

const cantidad = (elemento) => {
    let value = elemento.value.length === 10;
    if (value) {
        elemento.classList.remove("correcto")
        elemento.classList.add("error")
    }else{
        elemento.classList.remove("error")
        elemento.classList.add("cantidad")
    }
}
const documentos = () => {
    const fragmento = document.createDocumentFragment()
    fetch(`${URL}/documents`)
      .then(response => response.json())
      .then((data)=> {
        let option = document.createElement("option")
        option.textContent = "Seleccione ...."
        option.value = "";
        fragmento.appendChild(option)
        data.forEach(element => {
        let option = document.createElement("option");
        option.value = element.id;
        option.textContent = element.name;
        fragmento.appendChild(option)
        });
        tipo_documento.appendChild(fragmento)
      });
}

documentos();

const listar = async(page) => {
    const _page = page ? page : 1;
    const data = await solicitud(`users?_page=${_page}&_per_page=8`);
    const documentos = await solicitud("documents")
    
    const nav = document.querySelector(".navegacion");
    const first = data.first;
    const prev = data.prev;
    const next = data.next;
    const last = data.last;

    nav.querySelector(".first").disabled = first ? false : true;
    nav.querySelector(".prev").disabled = prev ? false : true;
    nav.querySelector(".next").disabled = next ? false : true;
    nav.querySelector(".last").disabled = last ? false : true;

    nav.querySelector(".first").setAttribute("data-first", first);
    nav.querySelector(".prev").setAttribute("data-prev", prev);
    nav.querySelector(".next").setAttribute("data-next", next);
    nav.querySelector(".last").setAttribute("data-last", last)
    

console.log(data);

console.log(nav);


    
    

    data.data.forEach(element =>{
        let nombre = documentos.find((documento) => documento.id === element.type_id).name;
        
        // tb_users.querySelector("tr").setAttribute("id", `user_${element.id}`)
        tp_users.querySelector("tr").id = `user_${element.id}`;
        
        tp_users.querySelector(".nombre").textContent = element.first_name;
        tp_users.querySelector(".apellido").textContent = element.last_name;
        tp_users.querySelector(".direccion").textContent = element.address;
        tp_users.querySelector(".correo").textContent = element.email;
        tp_users.querySelector(".telefono").textContent = element.phone;
        tp_users.querySelector(".tipo_documento").textContent = nombre;
        tp_users.querySelector(".documento").textContent = element.document;

        tp_users.querySelector(".modificar").setAttribute("data-id",element.id)
        tp_users.querySelector(".eliminar").setAttribute("data-id",element.id)

        const clone =document.importNode(tp_users, true);
        fragmento.appendChild(clone);
    })
    tbody.appendChild(fragmento);

}

document.addEventListener('click', (e) => {
    if (e.target.matches(".modificar")) {
        buscar(e.target);
    }
});


const createROW = (data) =>{
    const tr = tbody.insertRow(-1);
    const tdnombre = tr.insertCell(0);
    const tdapellido = tr.insertCell(1);
    const tddireccion = tr.insertCell(2);
    const tdcorreo = tr.insertCell(3);
    const tdtelefono = tr.insertCell(4);
    const tdtipo_documento = tr.insertCell(5);
    const tddocumento = tr.insertCell(6);


    tdnombre.textContent = data.first_name;
    tdapellido.textContent = data.last_name;
    tddireccion.textContent = data.address;
    tdcorreo.textContent = data.email;
    tdtelefono.textContent = data.phone;
    tdtipo_documento.textContent = data.type_id;
    tddocumento.textContent = data.document;
    

}
// createROW();

const buscar = async(element) =>{
    const data = await enviar(`users/${element.dataset.id}`, //endpoint
     {
         method: "PATCH",
         headers:{
             'Content-type': 'application/json; charset=UTF-8',
         }
     });
     loadForm(data)
 }
 
 const save = (event) =>  {
     let response = is_valid(event, "form [required]");
     const data ={
         first_name: nombre.value,
         last_name: apellido.value,
         address: direccion.value,
         type_id: tipo_documento.value,
         email: correo.value,
         phone: telefono.value,
         document: documento.value,
         }
         if (response) {
             if(user.value === ""){
                 guardar(data)
             }else{
                 actualizar(data)
                 console.log(document);
                 
             }
             
         }
 }
 
 
 
 const guardar = (data) => {
    fetch(`${URL}/users`,{
            method: "Post",
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then((response) => response.json())
        .then((json) => {
            nombre.value = "";
            apellido.value = "";
            telefono.value = "";
            direccion.value = "";
            tipo_documento.selectedIndex = 0;
            documento.value = "";
            politicas.value = false;
            correo.value = "";


            limpiarForm()

            createROW(json)

        });
}



const actualizar = async (data) => {
    const response = await enviar(`users/${user.value}`,{
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
    'Content-type': 'application/json; charset=UTF-8',
    }
    });
    limpiarForm()
    ediRow(response)
    
}

const limpiarForm = () => {
    nombre.value = "";
    apellido.value = "";
    telefono.value = "";
    direccion.value = "";
    correo.value = "";
    tipo_documento.value = "";
    documento.value = "";
    politicas.checked = false;
    button.removeAttribute ("disabled")
}

const ediRow = async (data) => {
    const documentos = await solicitud("documents")
    let nombre = documentos.find((documento)=> documento.id === data.type_id). name
    const tr = document.querySelector(`#user_${data.id}`)
    // nombre = tr.querySelector(".nombre");
   tr.querySelector(".nombre").textContent = data.first_name;
   tr.querySelector(".apellido").textContent = data.last_name;
   tr.querySelector(".direccion").textContent = data.address;
   tr.querySelector(".tipo_documento").textContent = nombre;
   tr.querySelector(".correo").textContent = data.email;
   tr.querySelector(".telefono").textContent = data.phone;
   tr.querySelector(".documento").textContent = data.document;
   
};


const loadForm = (data) => {
    const {
        id ,user_id,
        first_name: nombre,
        last_name: apellido,
        phone: telefono,
        address: direccion,
        type_id: tipoDocumento,
        document: documento,
        email: correo
    } = data;
    console.log(user_id);

    nombre.value=first_name;
    apellido.value=last_name;
    telefono.value=phone;
    direccion.value=address;
    tipoDocumento.value=type_id;
    documento.value=document;
    correo.value=email;
    politicas.checked = true;
    button.removeAttribute(`disabled`);


//     document.querySelector("#nombre").value = nombre;
//     document.querySelector("#apellido").value = apellido;
//     document.querySelector("#telefono").value = telefono;
//     document.querySelector("#direccion").value = direccion;
//     document.querySelector("#tipo_documento").value = tipoDocumento;
//     document.querySelector("#documento").value = documento;
//     document.querySelector("#email").value = correo;
//     document.querySelector("#politicas").checked = true; // Marca la casilla de verificación
//     document.querySelector("#button").removeAttribute("disabled"); // Habilita el botón
// 
};


const eliminar = async (element) => {
    let id = element.dataset.id;
    const tr = document-querySelector(`#users_${id}`);
    const username = tr.querySelector(".nombre").textContent;
    const confirmdelete = confirm(`Desea eliminar al usuario ${username} ?`);

    if (confirmdelete) {
        const response = await enviar(`${URL}/users/${id}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
    });
    }
    tr.remove()
    
    
}
addEventListener("DOMContentLoaded", (event) => {
    documentos();
    listar();
    //console.log(politicas.checked);
    if(!politicas.checked){
        // console.log(boton);
        button.setAttribute("disabled", "");
    };
})   

document.addEventListener("click", (e) =>{
    if (e.target.matches(".modificar")) {  
    buscar(e.target)  
    }

    if (e.target.matches(".eliminar")) {
    eliminar(e.target)
    }

    if (e.target.matches(".first")) {
        const nodos = tbody;
        const first = e.target.dataset.first
        console.log(first);
        
        while(nodos.firstChild){
            nodos.removeChild(nodos.firstChild)
        }
        listar(first)
    }

    if (e.target.matches(".prev")) {
        const nodos = tbody;
        const prev = e.target.dataset.prev
        console.log(prev);
        
        while(nodos.firstChild){
            nodos.removeChild(nodos.firstChild)
        }
        listar(prev)
    }

    if (e.target.matches(".next")) {
        const nodos = tbody;
        const next = e.target.dataset.next
        console.log(next);
        
        while(nodos.firstChild){
            nodos.removeChild(nodos.firstChild)
        }
        listar(next)
    }

    if (e.target.matches(".last")) {
        const nodos = tbody;
        const last = e.target.dataset.last
        console.log(last);
        

        while(nodos.firstChild){
            nodos.removeChild(nodos.firstChild)
        }
        listar(last)
    }
}
);

const vaciarCampos = () => {
nombre.value="" ;
apellido.value="" ;
direccion.value="" ;
email.value="" ;
telefono.value="" ;
documento.value="" ;
tipo_documento.selectedIndex = 0;
politicas.value = false;

};
$formulario.addEventListener("submit" , (event)=>{
    let response = is_valid(event, "form [required]");
    if (response) {
        const data ={
            first_name: nombre.value,
            last_name: apellido.value,
            address: direccion.value,
            type_id: tipo_documento.value,
            email: email.value,
            phone: telefono.value,
            document: documento.value,
        }
        fetch('http://localhost:3000/users',{
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then((response) => response.json())
        .then((json) => {
         vaciarCampos()
        createROW(json)
        });
    }else{
        alert("campos nulos")
    }
});

nombre.addEventListener("blur", (event) => {
    remover(event, nombre);
});
apellido.addEventListener("blur", (event) => {
    remover(event, apellido);
});
telefono.addEventListener("blur", (event) => {
    remover(event, telefono);
});
direccion.addEventListener("blur", (event) => {
    remover(event, direccion);
});
tipo_documento.addEventListener("blur", (event) => {
    remover(event, tipo_documento);
});
documento.addEventListener("blur", (event) => {
    remover(event, documento);
});

email.addEventListener("blur", (event) => {
    correo(event, email);
});

documento.addEventListener("DOMContentLoaded", (event) => {
    if (!politicas.checked) {
        button.setAttribute("disabled", "");    
    }
});

politicas.addEventListener("change", (event) => {
    console.log(event.target.checked);
    if (event.target.checked) {
        button.removeAttribute("disabled");

    } else {
        button.setAttribute("disabled", "");
    }
});

nombre.addEventListener("keyup", (event) => {
    letras(event);
});
documento.addEventListener("keypress", numeros) 
telefono.addEventListener("keypress", numeros )
nombre.addEventListener("keypress", (event)=>{
    letras(event, nombre)
})
apellido.addEventListener("keypress", (event)=>{
    letras(event, apellido)
})
//boton enviar hasta que se acepten las politicas


documento.addEventListener("keypress", numeros)
telefono.addEventListener("keypress", numeros)
nombre.addEventListener("keypress", (event)=>{
    letras(event, nombre)
});
apellido.addEventListener("keypress", (event)=>{
    letras(event, apellido)
});
correo.addEventListener("blur", (event)=>{
    correo(event, email)
});

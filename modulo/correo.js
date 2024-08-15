const correo = (event, input) => {
    
    let correoRegex = /^[\w-._]+@[\w-._]+(\.[a-zA-Z]{2,3}){1,2}$/;
    if (input.value.trim() === "") {
        input.classList.add("error");
        input.classList.remove("correcto");
    } else {
        if (correoRegex.test(input.value)) {
            input.classList.remove("error");
            input.classList.add("correcto");
        } else {
            event.preventDefault();
            input.classList.remove("correcto");
            input.classList.add("error");
        }
    }
};

export default correo;
const is_valid = (event , form) => {
    // event.preventDefault();
    let bandera = true;
    const elemts= document.querySelectorAll(form)
    elemts.forEach(element => {
        if (element.value == "") {
            element.classList.add("error");
            alert("Error");
            bandera = false;
        }
    });
    return bandera;
};
export default is_valid;
const letras = (event) => {
    let letras = /^[a-zA-ZÀ-ÿ\s]+$/;
    if (letras.test(event.key)) {
 
    } else {
        event.preventDefault();
    }
};
export default letras;


//url para ver el resultado
//C:/Users/osoho/OneDrive/Escritorio/DAW%202Año/M12/5%20DevChallenge%20piedra%20papel%20tojera%20lagarto%20spock/index.html
window.addEventListener("DOMContentLoaded", function () {
    const divMostrarEleccion = $("#mostrarEleccion");//donde mostraremos la elección
    const divResultado = $("#resultado");//donde añadiremos el resultado
    const servidor = new WebSocket("ws://localhost:3000");//establece una conexión WebSocket con el servidor que está escuchando en ws://localhost:3000

    // Capturo los botones y determino cual he seleccionado
    $(".boton").click(function () {
        const choice = $(this).data("choice");
        console.log("Opción seleccionada:", choice);
        divResultado.text('');//limpio el divResultado
        servidor.send(JSON.stringify({ type: 'choice', choice }));
        divMostrarEleccion.text(`Elegiste: ${choice}`);
    });

    /**
     * Esta función se ejecuta cuando se recibe un mensaje desde el servidor a través de la conexión WebSocket.
     * @param {*} event 
     */
    servidor.onmessage = (event) => {
        const data = JSON.parse(event.data);
     
        if (data.type === 'error') {
            alert(data.message);
        } else if (data.type === 'result') {
            // Atizo el resultado al DOM
            divResultado.text(`Resultado: ${data.result}. El otro jugador eligió: ${data.otherChoice}`);
        }
    };

});

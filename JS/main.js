window.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");
    // Captura de elementos del DOM donde añadiré el contenido
     const divMostrarJugador = $("#mostrarJugador");
    const divMostrarEleccion = $("#mostrarEleccion");
    const divResultado = $("#resultado");
    const servidor = new WebSocket("ws://localhost:3000");

   // Capturo el botón de reglas y añado el evento click
   $("#botonReglas").click(function () {
    // si esta oculto lo muestro y si esta visible lo oculto
    if ($("#instrucciones").is(":visible")) {
        $("#instrucciones").hide();
    } else {
        $("#instrucciones").show();
    }
    // $("#instrucciones").show();
});

// Capturo el botón de cerrar dentro de las instrucciones y añado el evento click
$("#cerrarInstrucciones").click(function () {
    $("#instrucciones").hide();
});

    servidor.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'error') {//Si el servidor envía un mensaje de error
            alert(data.message);
        } else if (data.type === 'playerNumber') {//Si el servidor envía el número de jugador lo atizo en el HTML
            divMostrarJugador.text(`Jugador: ${data.playerId}`);
        } else if (data.type === 'result') {//Si el servidor envía el resultado del juego lo atizo en el HTML
            divResultado.text(`Resultado: ${data.result}. El otro jugador eligió: ${data.otherChoice}`);
        }
    };
//Evento click en los botones de elección capturo todos los botones con la clase circle y les añado el ebento click
    $(".divPiedra, .divPapel ,.divTijeras , .divLagarto , .divSpock").click(function () {

        const choice = $(this).attr("data-choice");//determino la elección del jugador
        console.log("Opción seleccionada:", choice);

        servidor.send(JSON.stringify({ type: 'choice', choice }));//envío la elección al servidor
        divMostrarEleccion.text(`Elegiste: ${choice}`);//Atizo la eleccion en el HTML
    });

});

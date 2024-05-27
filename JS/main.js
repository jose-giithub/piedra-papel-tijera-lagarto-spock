window.addEventListener("DOMContentLoaded", function () {
    const divMostrarEleccion = $("#mostrarEleccion");
    const divResultado = $("#resultado");
    const servidor = new WebSocket("ws://localhost:3000");

    servidor.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'error') {
            alert(data.message);
        } else if (data.type === 'result') {
            divResultado.text(`Resultado: ${data.result}. El otro jugador eligió: ${data.otherChoice}`);
        }
    };

    $(".circle").click(function () {
        const choice = $(this).attr("data-choice");
        console.log("Opción seleccionada:", choice);
        servidor.send(JSON.stringify({ type: 'choice', choice }));
        divMostrarEleccion.text(`Elegiste: ${choice}`);
    });
});

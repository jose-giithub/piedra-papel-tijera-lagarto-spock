// window.addEventListener("DOMContentLoaded", function () {
//   //capturo el contenedor donde mostrare el boton seleccionado
//   const divMostrarEleccion = $("#mostrarEleccion");
//   const divResultado = $("#resultado");
//   const servidor = new WebSocket("ws://localhost:3000"); //establece una conexión WebSocket con el servidor que está escuchando en ws://localhost:3000

//   // Capturar los botones
//   let arrayBoton = $(".boton");

//   // Recibir la elección del otro jugador
//   //Esta función se ejecuta cuando se recibe un mensaje desde el servidor a través de la conexión WebSocket.
//   // servidor.onmessage = (event) => {
//   //    //modificamos el objeto recivido a texto
//   //    event.data.text().then((data)=>{
//   //     console.log(data);
//   //     divMostrarEleccion.append (`<p>${data}</p>`) ;
//   //    });
//   // };//final función onmessage
//   // *******mostrar el ganador arrayBoton.each(function (index, boton) {
//     // Recorro los botones y creo un click de cada botón
//     arrayBoton.each(function (index, boton) {
//         // Recorro los botones y creo un click de cada botón
//         $(boton).click(function () {
//           let texto = $(boton).text();
//           console.log("Boton seleccionado", boton);
//           servidor.send(texto); // Enviar la elección al servidor
//           divMostrarEleccion.text(`Elegiste: ${texto}`);
//         });
//       });
    

//     servidor.onmessage = (event) => {
//     event.data.text().then((data) => {
//         divResultado.text(`Resultado: ${data}`);//retorna la eleccion no la conclusion
//     });
//    };
// }); //Final de DOMContentLoaded

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

    $(".boton").click(function () {
        const choice = $(this).data("choice");
        console.log("Opción seleccionada:", choice);
        servidor.send(JSON.stringify({ type: 'choice', choice }));
        divMostrarEleccion.text(`Elegiste: ${choice}`);
    });
});

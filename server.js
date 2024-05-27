const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static("public"));

let players = [];
let choices = {};

// Iniciar el servidor y escuchar en el puerto 3000
server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

// Manejar nuevas conexiones WebSocket
wss.on("connection", (ws) => {
  // Si ya hay dos jugadores conectados, rechazar la nueva conexión
  if (players.length >= 2) {
    ws.send(JSON.stringify({ type: "error", message: "La sala está llena" }));
    ws.close();
    return;
  }

  // Añadir el nuevo jugador a la lista de jugadores
  const playerId = players.length;
  players.push(ws);

  /**
   * Función que recibe las elecciones de los jugadores y determina el ganador
   * 
   * @param {string} choice1 - Elección del jugador 1
   * @param {string} choice2 - Elección del jugador 2
   * @returns {string} - Resultado del juego
   */
  function determineWinner(choice1, choice2) {
    const wins = {
      Piedra: ["Lagarto", "Tijeras"], // Piedra gana a Lagarto y Tijeras
      Papel: ["Spock", "Piedra"],     // Papel gana a Spock y Piedra
      Tijeras: ["Lagarto", "Papel"],  // Tijeras gana a Lagarto y Papel
      Lagarto: ["Papel", "Spock"],    // Lagarto gana a Papel y Spock
      Spock: ["Piedra", "Tijeras"],   // Spock gana a Piedra y Tijeras
    };

    if (choice1 === choice2) return "Empate";
    return wins[choice1].includes(choice2) ? "Jugador 1 gana" : "Jugador 2 gana";
  }

  // Manejar mensajes recibidos desde el cliente
  ws.on("message", (message) => {
    const data = JSON.parse(message);
    if (data.type === "choice") {
      choices[playerId] = data.choice;
      console.log(`Player ${playerId} chose ${data.choice}`);

      // Si ambos jugadores han hecho sus elecciones, determinar el ganador
      if (Object.keys(choices).length === 2) {
        const [choice1, choice2] = [choices[0], choices[1]];
        const result = determineWinner(choice1, choice2);

        // Enviar el resultado a ambos jugadores
        players.forEach((player, index) => {
          const otherChoice = choices[index === 0 ? 1 : 0];
          let playerResult = result;
          if (result !== "Empate") {
            playerResult =
              (result === "Jugador 1 gana" && index === 0) ||
              (result === "Jugador 2 gana" && index === 1)
                ? "Ganas"
                : "Pierdes";
          }

          player.send(
            JSON.stringify({
              type: "result",
              result: playerResult,
              otherChoice: otherChoice,
            })
          );
        });

        // Resetear las elecciones para la siguiente ronda
        choices = {};
      }
    }
  });

  // Manejar la desconexión de un jugador
  ws.on("close", () => {
    console.log("Player disconnected");
    players = players.filter((player) => player !== ws);
  });
});

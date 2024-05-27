// const WebSocket = require('ws');
// const express = require('express');
// const http = require('http');
// //const { setDefaultResultOrder } = require('dns/promises');

// const app = express();
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// let players = [];
// //l******lógica para saber que jugador gana

// let choices = {};
// wss.on('connection', ws => {
//     players.push(ws);
//     console.log('Player connected');

//     ws.on('message', message => {
//         console.log('Received:', message);
//         const playerIndex = players.indexOf(ws);
//         choices[playerIndex] = message; // Almacenar la elección del jugador

//         // Si ambos jugadores han hecho su elección, determinar el ganador
//         if (Object.keys(choices).length === 2) {
//             console.log('Choices:', choices);
//             const result = determineWinner(choices[0], choices[1]);
//             console.log('Result:', result);
//             players.forEach((player, index) => {
//                 player.send(result[index]);
//             });
//             // Resetear las elecciones para la siguiente ronda
//             choices = {};
//         }
//     });

// //*****lógica programa básico sin ganador */
// // wss.on('connection', ws => {
// //     players.push(ws);
// //     console.log('Player connected');

// //     ws.on('message', message => {
// //         console.log('Received:', message);
// //         players.forEach(player => {
// //             if (player !== ws) {
// //                 player.send(message);
// //             }
// //         });
// //     });

//     ws.on('close', () => {
//         players = players.filter(player => player !== ws);
//         console.log('Player disconnected');
//     });
// });

// server.listen(3000, () => {
//     console.log('Server is listening on port 3000');
// });

// app.use(express.static('public'));

// //***********lógica para determinar el ganador */
// function determineWinner(choice1, choice2) {
//     console.log(`Determining winner between ${choice1} and ${choice2}`);


    // const outcomes = {
    //     piedra: { piedra: 'Empate', papel: 'Pierdes', tijeras: 'Ganas' },
    //     papel: { piedra: 'Ganas', papel: 'Empate', tijeras: 'Pierdes' },
    //     tijeras: { piedra: 'Pierdes', papel: 'Ganas', tijeras: 'Empate' }
    // };

    // const result1 = outcomes[choice1][choice2];
    // const result2 = outcomes[choice2][choice1] === 'Ganas' ? 'Pierdes' : outcomes[choice2][choice1] === 'Pierdes' ? 'Ganas' : 'Empate';

    // return [result1, result2];
//} //abrir servidor -->  nodemon server.js //   server.js

const express = require('express'); 
const http = require('http'); 
const WebSocket = require('ws'); 
 
const app = express(); 
const server = http.createServer(app); 
const wss = new WebSocket.Server({ server }); 
 
app.use(express.static('public')); 
 
let players = []; 
let choices = {}; 
 
function determineWinner(choice1, choice2) { 
    const wins = { 
        Piedra: ['Tijeras'], 
        Papel: ['Piedra'], 
        Tijeras: ['Papel'], 
    }; 
 
    if (choice1 === choice2) return 'Empate'; 
    return wins[choice1].includes(choice2) ? 'Jugador 1 gana' : 'Jugador 2 gana'; 
} 
 
wss.on('connection', (ws) => { 
    if (players.length >= 2) { 
        ws.send(JSON.stringify({ type: 'error', message: 'La sala está llena' })); 
        ws.close(); 
        return; 
    } 
 
    const playerId = players.length; 
    players.push(ws); 
 
    ws.on('message', (message) => { 
        const data = JSON.parse(message); 
        if (data.type === 'choice') { 
            choices[playerId] = data.choice; 
            console.log(`Player ${playerId} chose ${data.choice}`); 
            if (Object.keys(choices).length === 2) { 
                const [choice1, choice2] = [choices[0], choices[1]]; 
                const result = determineWinner(choice1, choice2); 
 
                players.forEach((player, index) => { 
                    const otherChoice = choices[index === 0 ? 1 : 0]; 
                    let playerResult = result; 
                    if (result !== 'Empate') { 
                        playerResult = (result === 'Jugador 1 gana' && index === 0) || (result === 'Jugador 2 gana' && index === 1) ? 'Ganas' : 'Pierdes'; 
                    } 
                     
                    player.send(JSON.stringify({ 
                        type: 'result', 
                        result: playerResult, 
                        otherChoice: otherChoice 
                    })); 
                }); 
 
                // Reset choices for next round 
                choices = {}; 
            } 
        } 
    }); 
 
    ws.on('close', () => { 
        console.log('Player disconnected'); 
        players = players.filter(player => player !== ws); 
    }); 
}); 
 
server.listen(3000, () => { 
    console.log('Server is listening on port 3000'); 
});

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Símbolos do jogo (ex: Laranja, Foguete, Tigre)
// Tigre vale mais (peso menor para sair)
const simbolos = ['Laranja', 'SacoDinheiro', 'Foguete', 'Envelope', 'Tigre'];

app.post('/api/spin', (req, res) => {
    // 1. Simula o giro das 3 bobinas (Reels)
    const reel1 = simbolos[Math.floor(Math.random() * simbolos.length)];
    const reel2 = simbolos[Math.floor(Math.random() * simbolos.length)];
    const reel3 = simbolos[Math.floor(Math.random() * simbolos.length)];

    // 2. Verifica vitória (se os 3 forem iguais)
    let win = false;
    let premio = 0;

    if (reel1 === reel2 && reel2 === reel3) {
        win = true;
        // Lógica simples de prêmio baseada no símbolo
        if (reel1 === 'Tigre') premio = 1000;
        else premio = 50;
    }

    // 3. Retorna o resultado para o Frontend animar
    res.json({
        reels: [reel1, reel2, reel3],
        win: win,
        premio: premio
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

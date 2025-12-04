const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve os arquivos do frontend

// Símbolos e seus pesos (quanto maior o número, mais fácil de sair)
// 🐯 é o Wild/Raro
const items = [
    { id: 'laranja', icon: '🍊', weight: 50 },
    { id: 'saco', icon: '💰', weight: 40 },
    { id: 'envelope', icon: '🧧', weight: 30 },
    { id: 'tigre', icon: '🐯', weight: 10 } 
];

// Função para escolher um símbolo baseado no peso (RNG Ponderado)
function getRandomSymbol() {
    const totalWeight = items.reduce((acc, item) => acc + item.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const item of items) {
        if (random < item.weight) {
            return item.icon;
        }
        random -= item.weight;
    }
    return items[0].icon;
}

app.post('/spin', (req, res) => {
    // Gera 3 símbolos independentes
    const reel1 = getRandomSymbol();
    const reel2 = getRandomSymbol();
    const reel3 = getRandomSymbol();

    // Verifica vitória (3 iguais)
    let win = false;
    let multiplier = 0;

    if (reel1 === reel2 && reel2 === reel3) {
        win = true;
        if (reel1 === '🐯') multiplier = 100; // Tigre paga muito
        else if (reel1 === '🧧') multiplier = 50;
        else multiplier = 10;
    }

    res.json({
        reels: [reel1, reel2, reel3],
        win: win,
        multiplier: multiplier
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

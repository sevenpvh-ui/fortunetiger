const spinBtn = document.getElementById('spin-btn');
const reels = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];
const message = document.getElementById('message');
const saldoEl = document.getElementById('saldo');

let saldo = 100.00;
const custoAposta = 1.00;

async function spin() {
    if (saldo < custoAposta) {
        message.innerText = "Saldo insuficiente!";
        return;
    }

    // Atualiza saldo visualmente
    saldo -= custoAposta;
    saldoEl.innerText = saldo.toFixed(2);
    message.innerText = "Girando...";
    
    // Desativa botão e adiciona animação
    spinBtn.disabled = true;
    reels.forEach(reel => reel.classList.add('spinning'));

    try {
        // Chama o backend (se estiver local, usa localhost, se não, pega a URL automática)
        const response = await fetch('/spin', { method: 'POST' });
        const data = await response.json();

        // Simula um tempo de giro de 2 segundos
        setTimeout(() => {
            // Para animação
            reels.forEach(reel => reel.classList.remove('spinning'));

            // Atualiza os ícones
            reels[0].innerText = data.reels[0];
            reels[1].innerText = data.reels[1];
            reels[2].innerText = data.reels[2];

            // Verifica resultado
            if (data.win) {
                const ganho = custoAposta * data.multiplier;
                saldo += ganho;
                saldoEl.innerText = saldo.toFixed(2);
                message.innerText = `GANHOU R$ ${ganho.toFixed(2)}! 🤑`;
                message.style.color = "green";
            } else {
                message.innerText = "Tente novamente!";
                message.style.color = "#2c0505";
            }

            spinBtn.disabled = false;
        }, 2000);

    } catch (error) {
        console.error("Erro:", error);
        spinBtn.disabled = false;
        reels.forEach(reel => reel.classList.remove('spinning'));
        message.innerText = "Erro de conexão.";
    }
}

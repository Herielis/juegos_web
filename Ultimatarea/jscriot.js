// Variables globales
let currentGame = null;

// Funciones de navegación
function startGame(game) {
    document.getElementById('mainPage').style.display = 'none';
    if (game === 'memory') {
        document.getElementById('memoryGame').classList.add('active');
        initMemory();
    } else if (game === 'guess') {
        document.getElementById('guessGame').classList.add('active');
        initGuess();
    }
    currentGame = game;
}

function backToMain() {
    document.getElementById('mainPage').style.display = 'block';
    document.getElementById('memoryGame').classList.remove('active');
    document.getElementById('guessGame').classList.remove('active');
    currentGame = null;
}

// ============================================
// JUEGO DE MEMORIA
// ============================================
const emojis = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎸', '🎺', '🎹'];
let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;

function initMemory() {
    memoryCards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    updateMemoryStats();
    renderMemoryGrid();
}

function renderMemoryGrid() {
    const grid = document.getElementById('memoryGrid');
    grid.innerHTML = '';
    memoryCards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.index = index;
        card.dataset.emoji = emoji;
        card.onclick = () => flipCard(index);
        grid.appendChild(card);
    });
}

function flipCard(index) {
    if (flippedCards.length === 2) return;
    
    const card = document.querySelector(`[data-index="${index}"]`);
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

    card.classList.add('flipped');
    card.textContent = card.dataset.emoji;
    flippedCards.push({index, emoji: card.dataset.emoji, element: card});

    if (flippedCards.length === 2) {
        moves++;
        updateMemoryStats();
        setTimeout(checkMatch, 800);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.emoji === card2.emoji) {
        card1.element.classList.add('matched');
        card2.element.classList.add('matched');
        matchedPairs++;
        updateMemoryStats();
        
        if (matchedPairs === emojis.length) {
            setTimeout(() => {
                alert(`¡Felicitaciones! Completaste el juego en ${moves} movimientos.`);
            }, 500);
        }
    } else {
        card1.element.classList.remove('flipped');
        card2.element.classList.remove('flipped');
        card1.element.textContent = '';
        card2.element.textContent = '';
    }
    
    flippedCards = [];
}

function updateMemoryStats() {
    document.getElementById('moves').textContent = moves;
    document.getElementById('pairs').textContent = matchedPairs;
}

function resetMemory() {
    initMemory();
}

// ============================================
// JUEGO ADIVINA EL NÚMERO
// ============================================
let secretNumber;
let attemptsCount = 0;
let bestScore = localStorage.getItem('bestScore') || '-';

function initGuess() {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    attemptsCount = 0;
    document.getElementById('guessInput').value = '';
    document.getElementById('guessMessage').innerHTML = '';
    updateGuessStats();
}

function makeGuess() {
    const input = document.getElementById('guessInput');
    const guess = parseInt(input.value);
    const messageDiv = document.getElementById('guessMessage');

    if (isNaN(guess) || guess < 1 || guess > 100) {
        messageDiv.innerHTML = '<div class="message info">Por favor ingresa un número entre 1 y 100</div>';
        return;
    }

    attemptsCount++;
    updateGuessStats();

    if (guess === secretNumber) {
        messageDiv.innerHTML = `<div class="message success">🎉 ¡Correcto! El número era ${secretNumber}. Lo adivinaste en ${attemptsCount} intentos.</div>`;
        
        if (bestScore === '-' || attemptsCount < parseInt(bestScore)) {
            bestScore = attemptsCount;
            localStorage.setItem('bestScore', bestScore);
            updateGuessStats();
            messageDiv.innerHTML += '<div class="message success">¡Nuevo récord personal!</div>';
        }
        
        input.disabled = true;
    } else if (guess < secretNumber) {
        messageDiv.innerHTML = `<div class="message info">📈 El número secreto es MAYOR que ${guess}. ¡Intenta con uno más grande!</div>`;
    } else {
        messageDiv.innerHTML = `<div class="message info">📉 El número secreto es MENOR que ${guess}. ¡Intenta con uno más pequeño!</div>`;
    }

    input.value = '';
    input.focus();
}

function updateGuessStats() {
    document.getElementById('attempts').textContent = attemptsCount;
    document.getElementById('bestScore').textContent = bestScore;
}

function resetGuess() {
    document.getElementById('guessInput').disabled = false;
    initGuess();
}

// Permitir presionar Enter en el input
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('guessInput');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') makeGuess();
        });
    }
});
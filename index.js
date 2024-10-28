"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gCards = [];
var gFlippedCardsStack = [];
var movesCounter = 0;
var timer = 0;
var gIntervalId = 0;
var gFoundPairs = 0;
var gMultiSelectMode = false;
function onInit(mode = 'easy') {
    const cardsEl = document.querySelector('.cards');
    const specialModesEl = document.querySelector('.special-modes');
    let htmlStr = '';
    initCards();
    if (mode !== 'easy')
        shuffleCards();
    gCards.forEach((card, idx) => {
        const cardEl = `<div
         class="card black flex center"
         id="card${idx}"
         onclick="onFlip(${idx})">
         <p>?</p>
         </div>`;
        htmlStr += cardEl;
    });
    cardsEl.innerHTML += htmlStr;
    setTimer();
    specialModesEl.style.display = 'flex';
}
function shuffleCards() {
    for (let i = gCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = gCards[i];
        gCards[i] = gCards[j];
        gCards[j] = temp;
    }
}
function setTimer() {
    const timerEl = document.querySelector('.timer').querySelector('p');
    if (!timer)
        timer = 420;
    gIntervalId = setInterval(() => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        timerEl.innerText = `${minutes.toString()}:${seconds.toString()}`;
        if (timer <= 0) {
            clearInterval(gIntervalId);
            timerEl.innerText = "00:00";
            toggleClickingOtherCards('off');
            checkVictory();
        }
        else
            timer--;
    }, 1000);
}
function onMultiSelectMode() {
    const multiSelectEl = document.querySelector('.multi-select');
    if (!gMultiSelectMode) {
        gMultiSelectMode = true;
        multiSelectEl.style.border = '2px solid red';
    }
    else {
        gMultiSelectMode = false;
        multiSelectEl.style.border = 'none';
    }
}
function initCards() {
    gCards = [{ shape: 'hexagon', icon: '⎔', color: 'red' }, { shape: 'triangle', icon: '△', color: 'blue' }, { shape: 'square', icon: '☐', color: 'pink' }, { shape: 'x', icon: '✕', color: 'black' },
        { shape: 'hexagon', icon: '⎔', color: 'red' }, { shape: 'triangle', icon: '△', color: 'blue' }, { shape: 'square', icon: '☐', color: 'pink' }, { shape: 'x', icon: '✕', color: 'black' },
        { shape: 'hexagon', icon: '⎔', color: 'black' }, { shape: 'triangle', icon: '△', color: 'pink' }, { shape: 'square', icon: '☐', color: 'blue' }, { shape: 'x', icon: '✕', color: 'red' },
        { shape: 'hexagon', icon: '⎔', color: 'black' }, { shape: 'triangle', icon: '△', color: 'pink' }, { shape: 'square', icon: '☐', color: 'blue' }, { shape: 'x', icon: '✕', color: 'red' }];
    gCards.forEach((card, idx) => {
        card.isHidden = true;
        card.id = idx;
        card.isMatched = false;
    });
}
function onFlip(num) {
    updateMoves();
    gCards[num].isHidden = false;
    console.log(num, gCards[num]);
    const selectedCardEl = document.getElementById(`card${num}`);
    addToFlippedCardsStack(num);
    const isTwoCardsFlipped = gFlippedCardsStack && (gMultiSelectMode ? gFlippedCardsStack.length === 3 : gFlippedCardsStack.length === 2);
    const selectedCard = gCards[num];
    showCard(selectedCard, selectedCardEl);
    modifyCardClr(selectedCardEl, selectedCard);
    if (isTwoCardsFlipped) {
        toggleClickingOtherCards('off');
        checkForMatchingCards();
        setTimeout(() => {
            hideCards();
            flipBackCards();
            cleanFlippedCardsStack();
            toggleClickingOtherCards('on');
        }, 2000);
    }
    checkVictory();
}
function toggleClickingOtherCards(mode) {
    if (mode === 'off') {
        gCards.forEach(card => {
            const currCardEl = document.getElementById(`card${card.id}`);
            currCardEl.style.pointerEvents = 'none';
        });
    }
    else {
        gCards.forEach(card => {
            const currCardEl = document.getElementById(`card${card.id}`);
            currCardEl.style.pointerEvents = 'auto';
        });
    }
}
function showCard(card, cardEl) {
    card.isHidden = false;
    cardEl.querySelector('p').innerText = card.icon;
}
function checkForMatchingCards() {
    const selectedCards = gFlippedCardsStack.map(id => gCards[id]);
    console.log(selectedCards);
    const condition = checkSelectedCards(selectedCards);
    if (condition) {
        if (!gFoundPairs)
            gFoundPairs = 1;
        else
            gFoundPairs++;
    }
    return condition;
}
function checkSelectedCards(selectedCards) {
    const firstCard = selectedCards[0];
    const secondCard = selectedCards[1];
    if (selectedCards.length === 2) {
        if (firstCard.shape === secondCard.shape && firstCard.color === secondCard.color) {
            gCards[firstCard.id].isMatched = true;
            gCards[secondCard.id].isMatched = true;
            return true;
        }
        else
            return false;
    }
    else {
        const thirdCard = selectedCards[2];
        if (firstCard.shape === secondCard.shape && firstCard.color === secondCard.color) {
            gCards[firstCard.id].isMatched = true;
            gCards[secondCard.id].isMatched = true;
            return true;
        }
        if (firstCard.shape === thirdCard.shape && firstCard.color === thirdCard.color) {
            gCards[firstCard.id].isMatched = true;
            gCards[thirdCard.id].isMatched = true;
            return true;
        }
        if (secondCard.shape === thirdCard.shape && secondCard.color === thirdCard.color) {
            gCards[secondCard.id].isMatched = true;
            gCards[thirdCard.id].isMatched = true;
            return true;
        }
        return false;
    }
}
function checkVictory() {
    const isVictory = gFoundPairs === 8;
    if (isVictory)
        setVictoryMode();
}
function setVictoryMode() {
    const winEl = document.querySelector('.victory').querySelector('p');
    winEl.innerText = 1 + '';
    const newRoundBtnEl = document.querySelector('.new-round');
    newRoundBtnEl.style.display = 'block';
}
function updateMoves() {
    if (!movesCounter)
        movesCounter = 1;
    else
        movesCounter++;
    const counterEl = document.querySelector('.moves').querySelector('p');
    counterEl.innerText = movesCounter + '';
}
function addToFlippedCardsStack(id) {
    if (!gFlippedCardsStack || !gFlippedCardsStack.length)
        gFlippedCardsStack = [id];
    else
        gFlippedCardsStack.push(id);
}
function flipBackCards() {
    const cardsEl = document.querySelector('.cards');
    for (let i = 0; i < gFlippedCardsStack.length; i++) {
        const flippedCardEl = cardsEl.querySelector(`#card${gFlippedCardsStack[i]}`);
        const idNum = gCards[gFlippedCardsStack[i]].id;
        const flippedCard = gCards[idNum];
        if (flippedCard.isMatched)
            continue;
        if (flippedCard.color !== 'black') {
            flippedCardEl.classList.remove(flippedCard.color);
            flippedCardEl.classList.add('black');
        }
        flippedCardEl.querySelector('p').innerText = '?';
    }
}
function cleanFlippedCardsStack() {
    gFlippedCardsStack = [];
}
function modifyCardClr(cardEl, selectedCard) {
    if (selectedCard.color !== 'black') {
        cardEl.classList.remove('black');
        cardEl.classList.add(selectedCard.color);
    }
}
function hideCards() {
    gCards.forEach(card => {
        if (!card.isMatched)
            card.isHidden = true;
    });
}

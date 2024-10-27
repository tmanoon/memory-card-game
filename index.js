"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gCards = [];
var gFlippedCardsStack = [];
var movesCounter = 0;
function onInit() {
    const cardsEl = document.querySelector('.cards');
    let htmlStr = '';
    initCards();
    for (let i = 0; i < gCards.length; i++) {
        const cardEl = `<div
         class="card black flex center"
         id="card${i}"
         onclick="onFlip(${i})">
         <p>?</p>
         </div>`;
        htmlStr += cardEl;
    }
    cardsEl.innerHTML += htmlStr;
}
function initCards() {
    gCards = [{ shape: 'hexagon', icon: '⎔', color: 'red' }, { shape: 'triangle', icon: '△', color: 'blue' }, { shape: 'square', icon: '☐', color: 'pink' }, { shape: 'x', icon: '✕', color: 'black' },
        { shape: 'hexagon', icon: '⎔', color: 'red' }, { shape: 'triangle', icon: '△', color: 'blue' }, { shape: 'square', icon: '☐', color: 'pink' }, { shape: 'x', icon: '✕', color: 'black' },
        { shape: 'hexagon', icon: '⎔', color: 'black' }, { shape: 'triangle', icon: '△', color: 'pink' }, { shape: 'square', icon: '☐', color: 'blue' }, { shape: 'x', icon: '✕', color: 'red' },
        { shape: 'hexagon', icon: '⎔', color: 'black' }, { shape: 'triangle', icon: '△', color: 'pink' }, { shape: 'square', icon: '☐', color: 'blue' }, { shape: 'x', icon: '✕', color: 'red' }];
    gCards.forEach(card => card.isHidden = true);
}
function onFlip(num) {
    updateMoves();
    const selectedCardEl = document.getElementById(`card${num}`);
    const isOneFlipped = checkForFlippedCards();
    const selectedCard = gCards[num];
    selectedCard.isHidden = false;
    addToFlippedCardsStack(`card${num}`);
    selectedCardEl.querySelector('p').innerText = selectedCard.icon;
    modifyCardClr(selectedCardEl, selectedCard);
    if (isOneFlipped) {
        setTimeout(() => {
            hideAllCards();
            flipBackAllCards();
            cleanFlippedCardsStack();
        }, 3000);
    }
}
function updateMoves() {
    if (!movesCounter)
        movesCounter = 1;
    else
        movesCounter++;
    const counterEl = document.querySelector('.moves').querySelector('p');
    counterEl.innerText = movesCounter + '';
}
function checkForFlippedCards() {
    return !!gCards.find(card => !card.isHidden);
}
function addToFlippedCardsStack(id) {
    if (!gFlippedCardsStack || !gFlippedCardsStack.length)
        gFlippedCardsStack = [];
    gFlippedCardsStack.push(id);
}
function flipBackAllCards() {
    const cardsEl = document.querySelector('.cards');
    for (let i = 0; i < gFlippedCardsStack.length; i++) {
        const flippedCardEl = cardsEl.querySelector(`#${gFlippedCardsStack[i]}`);
        const idNum = +(gFlippedCardsStack[i].replace('card', ''));
        const flippedCard = gCards[idNum];
        if (flippedCard.color !== 'black') {
            flippedCardEl.classList.remove(flippedCard.color);
            flippedCardEl.classList.add('black');
            flippedCardEl.querySelector('p').innerText = '?';
        }
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
function hideAllCards() {
    gCards.forEach(card => card.isHidden = true);
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cards = [];
function onInit() {
    const cardsEl = document.querySelector('.cards');
    let htmlStr = '';
    initCards();
    for (let i = 0; i < cards.length; i++) {
        const currCard = cards[i];
        const cardEl = `<div class="card ${currCard.color} flex center"><p>${currCard.icon}</p></div>`;
        htmlStr += cardEl;
    }
    cardsEl.innerHTML += htmlStr;
}
function initCards() {
    cards = [{ shape: 'hexagon', icon: '⎔', color: 'red' }, { shape: 'triangle', icon: '△', color: 'blue' }, { shape: 'square', icon: '☐', color: 'pink' }, { shape: 'x', icon: '✕', color: 'black' },
        { shape: 'hexagon', icon: '⎔', color: 'red' }, { shape: 'triangle', icon: '△', color: 'blue' }, { shape: 'square', icon: '☐', color: 'pink' }, { shape: 'x', icon: '✕', color: 'black' },
        { shape: 'hexagon', icon: '⎔', color: 'black' }, { shape: 'triangle', icon: '△', color: 'pink' }, { shape: 'square', icon: '☐', color: 'blue' }, { shape: 'x', icon: '✕', color: 'red' },
        { shape: 'hexagon', icon: '⎔', color: 'black' }, { shape: 'triangle', icon: '△', color: 'pink' }, { shape: 'square', icon: '☐', color: 'blue' }, { shape: 'x', icon: '✕', color: 'red' }];
}

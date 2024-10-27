import { Card } from "./models/card.model"

var gCards: Card[] = []
var gFlippedCardsStack: string[] = []
var gMatchedPairsFound: Card[] = []
var movesCounter: number = 0
var timer: number = 0
var gIntervalId: ReturnType<typeof setInterval> = 0
var gFoundPairs: number = 0

function onInit() {
    const cardsEl = document.querySelector('.cards') as HTMLElement
    let htmlStr = ''
    initCards()
    for (let i = 0; i < gCards.length; i++) {
        const cardEl = `<div
         class="card black flex center"
         id="card${i}"
         onclick="onFlip(${i})">
         <p>?</p>
         </div>`
        htmlStr += cardEl
    }
    cardsEl.innerHTML += htmlStr
    setTimer()
}

function setTimer() {
    const timerEl = document.querySelector('.timer')!.querySelector('p') as HTMLParagraphElement
    gIntervalId = setInterval(() => {
        if (!timer) timer = 1
        else timer++
        timerEl.innerText = timer.toString()
    }, 1000)
}

function initCards() {
    gCards = [{ shape: 'hexagon', icon: '⎔', color: 'red' }, { shape: 'triangle', icon: '△', color: 'blue' }, { shape: 'square', icon: '☐', color: 'pink' }, { shape: 'x', icon: '✕', color: 'black' },
    { shape: 'hexagon', icon: '⎔', color: 'red' }, { shape: 'triangle', icon: '△', color: 'blue' }, { shape: 'square', icon: '☐', color: 'pink' }, { shape: 'x', icon: '✕', color: 'black' },
    { shape: 'hexagon', icon: '⎔', color: 'black' }, { shape: 'triangle', icon: '△', color: 'pink' }, { shape: 'square', icon: '☐', color: 'blue' }, { shape: 'x', icon: '✕', color: 'red' },
    { shape: 'hexagon', icon: '⎔', color: 'black' }, { shape: 'triangle', icon: '△', color: 'pink' }, { shape: 'square', icon: '☐', color: 'blue' }, { shape: 'x', icon: '✕', color: 'red' }] as Card[]
    gCards.forEach(card => card.isHidden = true)
}

function onFlip(num: number) {
    updateMoves()
    const selectedCardEl = document.getElementById(`card${num}`) as HTMLDivElement
    addToFlippedCardsStack(`card${num}`)
    const isMatchFlipped: boolean = gFlippedCardsStack && gFlippedCardsStack.length === 2
    const selectedCard: Card = gCards[num]
    showCard(selectedCard, selectedCardEl)
    modifyCardClr(selectedCardEl, selectedCard)
    if (isMatchFlipped) {
        let isPairMatching: boolean = checkForMatchingCards()
        if (!isPairMatching) {
            setTimeout(() => {
                hideCards()
                flipBackCards()
                cleanFlippedCardsStack()
            }, 1200)
        }
    }
    checkVictory()
}

function showCard(card: Card, cardEl: HTMLDivElement) {
    card.isHidden = false
    cardEl.querySelector('p')!.innerText = card.icon
}

function checkForMatchingCards() {
    const firstCardNumId = +(gFlippedCardsStack[0].replace('card', ''))
    const firstCard = gCards.find((card, idx) => idx === firstCardNumId) as Card
    const secondCardNumId = +(gFlippedCardsStack[1].replace('card', ''))
    const secondCard = gCards.find((card, idx) => idx === secondCardNumId) as Card
    const condition = firstCard.shape === secondCard.shape && firstCard.color === secondCard.color
    if (condition) {
        if (!gMatchedPairsFound) gMatchedPairsFound = [firstCard, secondCard]
        else gMatchedPairsFound = [...gMatchedPairsFound, firstCard, secondCard]
        if (!gFoundPairs) gFoundPairs = 1
        else gFoundPairs++
        cleanFlippedCardsStack()
    }
    return condition
}

function checkVictory() {
    const isVictory = gFoundPairs === 8
    if (isVictory) setVictoryMode()
}

function setVictoryMode() {
    clearInterval(gIntervalId)
    const winEl = document.querySelector('.victory')!.querySelector('p') as HTMLParagraphElement
    winEl.innerText = 1 + ''
}

function updateMoves() {
    if (!movesCounter) movesCounter = 1
    else movesCounter++
    const counterEl = document.querySelector('.moves')!.querySelector('p') as HTMLParagraphElement
    counterEl.innerText = movesCounter + ''
}

function addToFlippedCardsStack(id: string) {
    if (!gFlippedCardsStack || !gFlippedCardsStack.length) gFlippedCardsStack = [id]
    else gFlippedCardsStack.push(id)
}

function flipBackCards() {
    const cardsEl = document.querySelector('.cards') as HTMLDivElement
    for (let i = 0; i < gFlippedCardsStack.length; i++) {
        const flippedCardEl = cardsEl.querySelector(`#${gFlippedCardsStack[i]}`) as HTMLDivElement
        const idNum = +(gFlippedCardsStack[i].replace('card', ''))
        const flippedCard = gCards[idNum]
        if (flippedCard.color !== 'black') {
            flippedCardEl.classList.remove(flippedCard.color)
            flippedCardEl.classList.add('black')
        }
        flippedCardEl.querySelector('p')!.innerText = '?'
    }
}

function cleanFlippedCardsStack() {
    gFlippedCardsStack = []
}

function modifyCardClr(cardEl: HTMLDivElement, selectedCard: Card) {
    if (selectedCard.color !== 'black') {
        cardEl.classList.remove('black')
        cardEl.classList.add(selectedCard.color)
    }
}

function hideCards() {
    gCards.forEach(card => {
        card.isHidden = true
    })
}
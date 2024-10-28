import { Card } from "./models/card.model"

var gCards: Card[] = []
var gFlippedCardsStack: number[] = []
var movesCounter: number = 0
var timer: number = 0
var gIntervalId: ReturnType<typeof setInterval> = 0
var gFoundPairs: number = 0
var gMultiSelectMode: boolean = false

function onInit() {
    const cardsEl = document.querySelector('.cards') as HTMLElement
    const specialModesEl = document.querySelector('.special-modes') as HTMLDivElement
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
    specialModesEl.style.display = 'flex'
}

function setTimer() {
    const timerEl = document.querySelector('.timer')!.querySelector('p') as HTMLParagraphElement
    gIntervalId = setInterval(() => {
        if (!timer) timer = 1
        else timer++
        timerEl.innerText = timer.toString()
    }, 1000)
}

function onMultiSelectMode() {
    if (!gMultiSelectMode) gMultiSelectMode = true
    else gMultiSelectMode = false
}

function initCards() {
    gCards = [{ shape: 'hexagon', icon: '⎔', color: 'red' }, { shape: 'triangle', icon: '△', color: 'blue' }, { shape: 'square', icon: '☐', color: 'pink' }, { shape: 'x', icon: '✕', color: 'black' },
    { shape: 'hexagon', icon: '⎔', color: 'red' }, { shape: 'triangle', icon: '△', color: 'blue' }, { shape: 'square', icon: '☐', color: 'pink' }, { shape: 'x', icon: '✕', color: 'black' },
    { shape: 'hexagon', icon: '⎔', color: 'black' }, { shape: 'triangle', icon: '△', color: 'pink' }, { shape: 'square', icon: '☐', color: 'blue' }, { shape: 'x', icon: '✕', color: 'red' },
    { shape: 'hexagon', icon: '⎔', color: 'black' }, { shape: 'triangle', icon: '△', color: 'pink' }, { shape: 'square', icon: '☐', color: 'blue' }, { shape: 'x', icon: '✕', color: 'red' }] as Card[]
    gCards.forEach((card, idx) => {
        card.isHidden = true
        card.id = idx
        card.isMatched = false
    })
}

function onFlip(num: number) {
    updateMoves()
    gCards[num].isHidden = false
    console.log(num, gCards[num])
    const selectedCardEl = document.getElementById(`card${num}`) as HTMLDivElement
    addToFlippedCardsStack(num)
    const isTwoCardsFlipped: boolean = gFlippedCardsStack && (gMultiSelectMode && gFlippedCardsStack.length === 3 || gFlippedCardsStack.length === 2)
    const selectedCard: Card = gCards[num]
    showCard(selectedCard, selectedCardEl)
    modifyCardClr(selectedCardEl, selectedCard)
    if (isTwoCardsFlipped) {
        toggleClickingOtherCards('off')
        checkForMatchingCards()
        setTimeout(() => {
            hideCards()
            flipBackCards()
            cleanFlippedCardsStack()
            toggleClickingOtherCards('on')
        }, 2000)
    }
    checkVictory()
}

function toggleClickingOtherCards(mode: string) {
    if (mode === 'off') {
        gCards.forEach(card => {
            const currCardEl = document.getElementById(`card${card.id}`) as HTMLDivElement
            currCardEl.style.pointerEvents = 'none'
        })
    } else {
        gCards.forEach(card => {
            const currCardEl = document.getElementById(`card${card.id}`) as HTMLDivElement
            currCardEl.style.pointerEvents = 'auto'
        })
    }
}

function showCard(card: Card, cardEl: HTMLDivElement) {
    card.isHidden = false
    cardEl.querySelector('p')!.innerText = card.icon
}

function checkForMatchingCards() {
    const selectedCards: Card[] = gFlippedCardsStack.map(id => gCards[id])
    console.log(selectedCards)
    const condition: boolean = checkSelectedCards(selectedCards)
    if (condition) {
        if (!gFoundPairs) gFoundPairs = 1
        else gFoundPairs++
    }
    return condition
}

function checkSelectedCards(selectedCards: Card[]) {
    const firstCard = selectedCards[0]
    const secondCard = selectedCards[1]
    if (selectedCards.length === 2) {
        if (firstCard.shape === secondCard.shape && firstCard.color === secondCard.color) {
            gCards[firstCard.id].isMatched = true
            gCards[secondCard.id].isMatched = true
            return true
        } else return false
    } else {
        const thirdCard = selectedCards[2]
        if (firstCard.shape === secondCard.shape && firstCard.color === secondCard.color) {
            gCards[firstCard.id].isMatched = true
            gCards[secondCard.id].isMatched = true
            return true
        }
        if (firstCard.shape === thirdCard.shape && firstCard.color === thirdCard.color) {
            gCards[firstCard.id].isMatched = true
            gCards[thirdCard.id].isMatched = true
            return true
        }
        if (secondCard.shape === thirdCard.shape && secondCard.color === thirdCard.color) {
            gCards[secondCard.id].isMatched = true
            gCards[thirdCard.id].isMatched = true
            return true
        }
        return false
    }
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

function addToFlippedCardsStack(id: number) {
    if (!gFlippedCardsStack || !gFlippedCardsStack.length) gFlippedCardsStack = [id]
    else gFlippedCardsStack.push(id)
}

function flipBackCards() {
    const cardsEl = document.querySelector('.cards') as HTMLDivElement
    for (let i = 0; i < gFlippedCardsStack.length; i++) {
        const flippedCardEl = cardsEl.querySelector(`#card${gFlippedCardsStack[i]}`) as HTMLDivElement
        const idNum = gCards[gFlippedCardsStack[i]].id
        const flippedCard = gCards[idNum]
        if (flippedCard.isMatched) continue
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
        if (!card.isMatched) card.isHidden = true
    })
}
﻿class ToEmit {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-remaining');
        this.ticker=document.getElementById('score')
    }
    startGame() {
        this.cardToCheck = null;
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.matchedCards = [];
        this.busy = true;

        setTimeout(() => {
            this.shuffleCards();
            this.countDown = this.startCountDown();
            this.busy = false;
        }, 500);
        this.hideCards();
        this.timer.innerTex = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
    }
    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        })
    }
    flipCard(card) {
        if (this.canFlipCard(card)) {
            
            card.classList.add('visible');

            if (this.cardToCheck) {
                this.cheakForCardMatch(card);
            }
            else {
                this.cardToCheck = card;
            }
        }
    }
    cheakForCardMatch(card) {
        if (this.getCardType(card) === this.getCardType(this.cardToCheck)) {
            this.cardMatch(card,this.cardToCheck);
        }
        else {
            this.cardMisMatch(card, this.cardToCheck); 
        }
        this.cardToCheck = null;
    }
    cardMatch(card1,card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.totalClicks++;
        this.ticker.innerHTML = this.totalClicks;
        if (this.matchedCards.length === this.cardsArray.length) {
            this.victory();
        }
    }
    cardMisMatch(card1,card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        },1000)
    }
    getCardType(card) {
        return card.getElementsByClassName('card-value')[0].src;
    }
    startCountDown() {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if (this.timeRemaining === 0) {
                this.gameOver();
            }
        },1000);
    }
    victory() {
        clearInterval(this.countDown);
        document.getElementById('victory-text').classList.add('visible');
        let score = this.totalClicks * this.timeRemaining;
        sendScore(score);
    }
    gameOver() {
        clearInterval(this.countDown);
        document.getElementById('game-over-text').classList.add('visible');

    }
    shuffleCards(cardsArray) {
        for (let i = this.cardsArray.length - 1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i + 1));
            this.cardsArray[randIndex].style.order = i;
            this.cardsArray[i].style.order = randIndex;
        }
    }
    canFlipCard(card) {
        return (!this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck)
    }
}
function ready() {
    let ovelays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new ToEmit(100, cards);

    ovelays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
        });
    });
    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        })
    })
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready());
}
else {
    ready();
}
function sendScore(score) {
    console.log(score);
    $.post("/Home/SaveScore",{ score: score });
}
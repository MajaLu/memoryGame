const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");

let cards;
let interval;
let firstCard = false;
let secondCard = false;

//Items Array
const items = [
    { name:"bee", image: "images/bee.png" },
    { name:"crocodile", image: "images/crocodile.png" },
    { name:"macaw", image: "images/macaw.png" },
    { name:"gorilla", image: "images/gorilla.png" },
    { name:"tiger", image: "images/tiger.png" },
    { name:"monkey", image: "images/monkey.png" },
    { name:"chameleon", image: "images/chameleon.png" },
    { name:"piranha", image: "images/piranha.png" },
     {name:"anaconda", image: "images/anaconda.png" },
    { name:"sloth", image: "images/sloth.png" },
    { name:"cockatoo", image: "images/cockatoo.png" },
    { name:"toucan", image: "images/toucan.png" },
];

//Initial Time
let seconds = 0,
    minutes = 0;
//Initial moves and win count
let movesCount = 0,
    winCount = 0;

//Timer
const timeGenerator = () => {
    seconds += 1;
    //minutes logic
    if (seconds >= 60) {
        minutes += 1;
        seconds = 0;
    }
    //Format time before display
    let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
    let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
    timeValue.innerHTML = `<span>Time: </span>${minutesValue}:${secondsValue}`;
};

// Calculating Moves 
const movesCounter = () => {
    movesCount += 1;
    moves.innerHTML = `<span>Moves: </span>${movesCount}`;
};

//Generate random objects from the items array
const generateRandom = (size = 4) => {
    let tempArray = [...items];
    let cardValues = [];

    size = (size * size) / 2;

    //Random object selection
    for (let i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * tempArray.length);
        cardValues.push(tempArray[randomIndex]);
        //once selected remove the object from temp array
        tempArray.splice(randomIndex, 1);
    }
    return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
    gameContainer.innerHTML = "";
    cardValues = [...cardValues, ...cardValues];
    cardValues.sort(() => Math.random() - 0.5);
    for (let i = 0; i < size*size; i++) {
        /*
        Create Cards. before => front side, after => back side
         */
        gameContainer.innerHTML += `
        <div class="card-container" data-card-value="${cardValues[i].name}">
            <div class="card-before">?</div>
            <div class="card-after"><img src="${cardValues[i].image}"
            class="image"/></div>
        </div>
        `;
    }
    //Grid
    gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

    //Cards
    cards = document.querySelectorAll(".card-container");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            //already matched card when clicked would be ignored
            if (!card.classList.contains("matched")) {
                card.classList.add("flipped");
                if (!firstCard) {
                    firstCard = card;
                    firstCardValue = card.getAttribute("data-card-value");
                }
                else {
                    //increment moves since user selected second card
                    movesCounter();
                    //secondCard and value
                    secondCard = card;
                    let secondCardValue = card.getAttribute("data-card-value");
                    if (firstCardValue == secondCardValue) {
                        firstCard.classList.add("matched");
                        secondCard.classList.add("matched");
                        firstCard = false;
                        //Increment winCount
                        winCount += 1;
                        //check if count == half of cardvalues
                        if (winCount == Math.floor(cardValues.length / 2)) {
                            result.innerHTML = `<h2>You Won!</h2>
                            <h4>Moves: ${movesCount}</h4>`;
                            stopGame();
                        }
                    } else {
                        //if cards don't match, flip cards back to normal
                        let [tempFirst, tempSecond] = [firstCard, secondCard];
                        firstCard = false;
                        secondCard = false;
                        let delay = setTimeout(() => {
                            tempFirst.classList.remove("flipped");
                            tempSecond.classList.remove("flipped");
                        }, 900);
                    }
                }
            } 
        });
    });
};

//Start Game
startButton.addEventListener("click", () => {
    movesCount = 0;
    seconds = 0;
    minutes = 0;
    controls.classList.add("hide");
    stopButton.classList.remove("hide");
    startButton.classList.add("hide");
    //start timer
    interval = setInterval(timeGenerator, 1000);
    //initial moves
    moves.innerHTML = `<span>Moves: </span> ${movesCount}`;
    initializer();
});

//Stop Game
stopButton.addEventListener("click",
(stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
}));


//Initialize value and func calls
const initializer = () => {
    result.innerText = "";
    winCount = 0;
    let cardValues = generateRandom();
    console.log(cardValues);
    matrixGenerator(cardValues);
};

initializer();






const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const scoreText = document.querySelector("#scoreText");
const description = document.querySelector("#description");
const startButton = document.querySelector("#startButton");
const resetButton = document.querySelector("#resetButton");
const boardBackground = 'white';
const snakeColor = 'darkgreen';
const snakeBorder = 'black';
const apple = 'red';
const unitSize = 20;
// Load sounds
const backgroundMusic = new Audio('sounds/background-music.mp3');
const eatSound = new Audio('sounds/eat.mp3');
const gameOverSound = new Audio('sounds/game-over.mp3');

// Configure background music (looping)
backgroundMusic.loop = true;
backgroundMusic.volume = 0.15; // Adjust volume as needed
eatSound.volume = 1; // Adjust volume as needed

// Init Variables

startButton.disabled = false;
resetButton.disabled = true;

let gameRunning = false;
let score = 0;
let direction = "RIGHT";
let xSpeed = unitSize;
let ySpeed = 0;
let foodX;
let foodY;
let snake = [
    {x:unitSize*2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0}
];

// Wait for User to click start
startButton.addEventListener('click', () => {

    gameStart(); // Call the gameStart function
});

resetButton.addEventListener('click', () => {
    

    gameReset(); // Call a gameReset function (you can define this to reset the game logic)
});

function addKeyListener() {
    // Adding an event listener for keydown events
    document.addEventListener("keydown", (event) => {
        // Prevent default behavior for arrow keys
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
            event.preventDefault();
        }
        switch (event.key) {
            case "ArrowUp":
                if (direction !== "DOWN") {
                    direction = "UP";
                }
                break;
            case "ArrowDown":
                if (direction !== "UP") {
                    direction = "DOWN";
                }
                break;
            case "ArrowLeft":
                if (direction !== "RIGHT") {
                    direction = "LEFT";
                }
                break;
            case "ArrowRight":
                if (direction !== "LEFT") {
                    direction = "RIGHT";
                }
                break;
        }
    });
}


function clearBoard(){
    ctx.fillStyle = 'lightgreen'; // Set the background color
    ctx.fillRect(0, 0, gameWidth, gameHeight); // Fill the canvas with the color
    ctx.clearRect(0, 0, gameWidth, gameHeight); // Clears the entire canvas
}

function drawFood(){
    // Draw the food on the canvas
    ctx.fillStyle = apple; // Food color
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
}
function createFood(){
    // Generate random x and y positions, ensuring they align with the grid
    foodX = Math.floor(Math.random() * (gameWidth / unitSize)) * unitSize;
    foodY = Math.floor(Math.random() * (gameHeight / unitSize)) * unitSize;
}

function drawSnake(){
    ctx.fillStyle = snakeColor; // Food color
    snake.forEach(snakeBlock => {
        ctx.fillRect(snakeBlock.x, snakeBlock.y, unitSize, unitSize);
    })
}

function moveSnake(){
    if (direction == "RIGHT"){
        xSpeed = unitSize;
        ySpeed = 0;
    }
    else if (direction == "LEFT"){
        xSpeed = -unitSize;
        ySpeed = 0;
    }
    else if (direction == "UP"){
        xSpeed = 0;
        ySpeed = -unitSize;
    }
    else if (direction == "DOWN"){
        xSpeed = 0;
        ySpeed = unitSize;
    }
    else {
        return
    }

    let head = {x: snake[0].x + xSpeed, y: snake[0].y + ySpeed};
    console.log(head);
    snake.unshift(head);
    console.log(snake);
    //Check if snake ate food before drawing
    if(snake[0].x == foodX && snake[0].y == foodY){
        score += 1;
        scoreText.textContent = score;
        createFood();
        eatSound.play(); // Play the eat sound
    } else {
        snake.pop();
    }
    drawSnake();
}

function checkGameOver() {
    // Check if the snake hits the wall
    if (
        snake[0].x < 0 || snake[0].x >= gameWidth || // Out of horizontal bounds
        snake[0].y < 0 || snake[0].y >= gameHeight  // Out of vertical bounds
    ) {
        gameRunning = false; // Stop the game
        return;
    }

    // Check if the snake collides with itself
    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            gameRunning = false; // Stop the game
            return;
        }
    }
}


function gameOver(){
    backgroundMusic.pause(); // Stop the background music
    backgroundMusic.currentTime = 0; // Reset music to the beginning
    gameOverSound.play(); // Play the game-over sound
    gameReset();
}

function nextFrame(){
    if(gameRunning){
        setTimeout(()=>{
            clearBoard();
            drawFood();        
            moveSnake();       
            checkGameOver();       
            nextFrame();
        }, 150)
    } else {
        gameOver();
    }
}

function gameStart() {
    // Disable the start button and enable the reset button
    startButton.disabled = true;
    resetButton.disabled = false;
    console.log('Game has started!');
    backgroundMusic.play(); // Start the background music
    gameRunning = true;
    addKeyListener(); // Function wrapping the listener setup
    createFood();
    nextFrame(); // Begin running the game logic
}

function gameReset() {
    // Optionally reset the button states
    startButton.disabled = false;
    resetButton.disabled = true;


    console.log('Game has been reset!');

    gameRunning = false;
    score = 0;
    scoreText.textContent = '0';
    direction = "RIGHT";
    xSpeed = unitSize;
    ySpeed = 0;
    snake = [
        {x:unitSize*2, y:0},
        {x:unitSize, y:0},
        {x:0, y:0}
    ];

    // Add your reset logic here
    clearBoard();
}




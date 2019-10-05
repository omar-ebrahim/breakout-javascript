var canvas = document.getElementById('myCanvas');
// Stores the 2d rendering context - the tool used to paint on the canvas
var ctx = canvas.getContext("2d");

// Start coordinates
var x = canvas.width / 2;
var y = canvas.height - 30;

// move coords
var stepX = 2;
var stepY = -2;

var leftBallEdge, topBallEdge = 0;

var ballRadius = 10;
var topBallEdge = ballRadius;
var leftBallEdge = ballRadius;
var bottomBallEdge = canvas.height - ballRadius;
var rightBallEdge = canvas.width - ballRadius;

var paddleStep = 7;
var paddleHeight = 10;
var paddleWidth = 150;
var paddleX = (canvas.width - paddleWidth) / 2;

var leftPressed = false;
var rightPressed = false;

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;

var nextStepY = function () {
    return y + stepY;
}

var nextStepX = function () {
    return x + stepX;
}

var collidesWithBottom = function () {
    return nextStepY() > bottomBallEdge;
}

var collidesWithTop = function () {
    return nextStepY() < topBallEdge;
}

var collidesWithRight = function () {
    return nextStepX() > rightBallEdge;
}

var collidesWithLeft = function () {
    return nextStepX() < leftBallEdge;
}

var collidesWithPaddle = function () {
    return x > paddleX && x < paddleX + paddleWidth;
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

var leftKeys = ['Left', 'ArrowLeft'];
var rightKeys = ['Right', 'ArrowRight'];

function keyDownHandler(e) {
    if (leftKeys.some(x => x == e.key)) {
        leftPressed = true;
    } else if (rightKeys.some(x => x == e.key)) {
        rightPressed = true;
    }
}

function keyUpHandler(e) {
    if (leftKeys.some(x => x == e.key)) {
        leftPressed = false;
    } else if (rightKeys.some(x => x == e.key)) {
        rightPressed = false;
    }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

var updateBallCoordinates = function () {
    x += stepX;
    y += stepY;
}

function draw() {

    // if it hits the top or bottom, reverse direction
    if (collidesWithTop()) {
        stepY = -stepY
    } else if (collidesWithBottom()) {
        if (collidesWithPaddle()) {
            stepY = -stepY;
        } else {
            alert("GAME OVER!");
            document.location.reload();
            clearInterval(interval); // needed for Chrome
        }
    }

    // if it hits left or right
    if (collidesWithRight() || collidesWithLeft()) {
        stepX = -stepX;
    }

    if (leftPressed) {
        paddleX -= paddleStep;
        paddleX = paddleX < 0 ? 0 : paddleX; // reset to left most edge
    } else if (rightPressed) {
        paddleX += paddleStep;
        paddleX = (paddleX + paddleWidth > canvas.width) ? (canvas.width - paddleWidth) : paddleX; // reset to rightmost edge
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    updateBallCoordinates();
}

// call the draw function every 10ms
var interval = setInterval(draw, 10);

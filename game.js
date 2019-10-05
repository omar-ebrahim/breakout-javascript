var canvas = document.getElementById('myCanvas');
// Stores the 2d rendering context - the tool used to paint on the canvas
var ctx = canvas.getContext("2d");

// Start coordinates
var currentX = canvas.width / 2;
var currentY = canvas.height - 30;

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
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var score = 0;

var bricks = [];
for (var column = 0; column < brickColumnCount; column++) {
    bricks[column] = [];
    for (var row = 0; row < brickRowCount; row++) {
        bricks[column][row] = { x: 0, y: 0, status: 1 };
    }
}

var nextStepY = function () {
    return currentY + stepY;
}

var nextStepX = function () {
    return currentX + stepX;
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
    return currentX > paddleX && currentX < paddleX + paddleWidth;
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(currentX, currentY, ballRadius, 0, Math.PI * 2);
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

function drawBricks() {
    for (var column = 0; column < brickColumnCount; column++) {
        for (var row = 0; row < brickRowCount; row++) {
            if (bricks[column][row].status == 1) {
                var brickX = (column * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (row * (brickHeight + brickPadding)) + brickOffsetTop;

                bricks[column][row].x = brickX;
                bricks[column][row].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
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

function collisionDetection() {
    for (var column = 0; column < brickColumnCount; column++) {
        for (var row = 0; row < brickRowCount; row++) {
            var brick = bricks[column][row];
            if (brick.status == 1) {
                if (currentX > brick.x && currentX < brick.x + brickWidth && currentY > brick.y && currentY < brick.y + brickHeight) {
                    stepY = -stepY;
                    brick.status = 0;
                    score++;
                    if (score == brickColumnCount * brickRowCount) {
                        alert("You win!");
                        document.location.reload();
                        clearInterval(interval);
                    }
                }
            }
        }
    }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

var updateBallCoordinates = function () {
    currentX += stepX;
    currentY += stepY;
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
    drawBricks();
    drawScore();
    drawPaddle();
    collisionDetection();
    updateBallCoordinates();
}

// call the draw function every 10ms
var interval = setInterval(draw, 10);

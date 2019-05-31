let canvas = document.getElementById("tetris");
let context = canvas.getContext("2d");
let next = document.getElementById("next");
let context_next = next.getContext("2d");
let scoreHTML = document.getElementById("score");
let levelHTML = document.getElementById("level");

const ROW = 16;
const COLUMN = 12;
const FS = 40;
const EMPTY = "#b5b2aa";

const I = [
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
    ],
    [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
    ],
    [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
    ]
];

const J = [
    [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0]
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1]
    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
    ]
];

const L = [
    [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0]
    ],
    [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
    ]
];

const S = [
    [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1]
    ],
    [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0]
    ],
    [
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0]
    ]
];

const Z = [
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0]
    ],
    [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1]
    ],
    [
        [0, 1, 0],
        [1, 1, 0],
        [1, 0, 0]
    ]
];

const T = [
    [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0]
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
    ],
    [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0]
    ]
];

const O = [
    [
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ]
];

let FIGURES = [
    [I, "#1eb434"],
    [L, "#f78c39"],
    [J, "#4348bf"],
    [S, "#db423c"],
    [Z, "#5c9fa0"],
    [T, "#e2d52d"],
    [O, "#914588"]
];


function randomFigure(){
    let ranNum = Math.floor(Math.random() * FIGURES.length);
    return new Figure(FIGURES[ranNum][0], FIGURES[ranNum][1]);
}

let p = randomFigure();

function Figure(shape, color) {
    this.shape = shape;
    this.color = color;
    this.shapeN = 0;
    this.currentShape = this.shape[this.shapeN];

    this.i = 5;
    this.j = -2;
}

function drawFigure(i, j, color) {
    context.fillStyle = color;
    context.fillRect(i * FS, j * FS, FS, FS);

    context.strokeStyle = "#3f4040";
    context.strokeRect(i * FS, j * FS, FS, FS);
}

let tetrisArr = [];
function clear() {
    for (let r = 0; r < ROW; r++) {
        tetrisArr[r] = [];
        for (let c = 0; c < COLUMN; c++) {
            tetrisArr[r][c] = EMPTY;
        }
    }
}

function drawTableArea() {
    for (let r = 0; r < ROW; r++) {
        for (let c = 0; c < COLUMN; c++) {
            drawFigure(c, r, tetrisArr[r][c]);
        }
    }
}

clear();
drawTableArea();

Figure.prototype.move = function(color) {
    for (let r = 0; r < this.currentShape.length; r++) {
        for (let c = 0; c < this.currentShape.length; c++) {
            if (this.currentShape[r][c]) {
                drawFigure(this.i + c, this.j + r, color);
            }
        }
    }
};

Figure.prototype.draw = function() {
    this.move(this.color);
};

Figure.prototype.unDraw = function() {
    this.move(EMPTY);
};

Figure.prototype.moveDown = function() {
    if(!this.collusion(0,1, this.currentShape)) {
        this.unDraw();
        this.j++;
        this.draw();
    } else {
        this.freeze();
        p = randomFigure();
    }
};

Figure.prototype.moveLeft = function() {
    if (!this.collusion(-1, 0, this.currentShape)) {
        this.unDraw();
        this.i--;
        this.draw();
    }
};

Figure.prototype.moveRight = function() {
    if (!this.collusion(1, 0, this.currentShape)) {
        this.unDraw();
        this.i++;
        this.draw();
    }
};

Figure.prototype.rotate = function() {
    let rotatedFigure = this.shape[(this.shapeN + 1) % this.shape.length];
    let click = 0;

    if (this.collusion(0,0, rotatedFigure)){
        if (this.i > COLUMN/2){
            click = -1;
        } else {
            click = 1;
        }
    }

    if(!this.collusion(click,0,rotatedFigure)){
        this.unDraw();
        this.i += click;
        this.shapeN = (this.shapeN + 1) % this.shape.length;
        this.currentShape = this.shape[this.shapeN];
        this.draw();
    }
};


let score = 0;
let level = 1;

Figure.prototype.freeze = function(){
    for (let r = 0; r < this.currentShape.length; r++){
        for (let c = 0; c < this.currentShape.length; c++){

            if (!this.currentShape[r][c]){
                continue;
            }

            if (this.j + r < 0) {
                let ask = confirm(`Game Over. To start a new game press 'OK'.` + "\n"+ `Score: ${score}`);
                gameOver = true;
                if (ask) {
                    score = 0;
                    level = 1;
                    scoreHTML.innerHTML = score;
                    levelHTML.innerHTML = level;
                    gameOver = false;
                    clear();
                    drawTableArea();
                    p = randomFigure();
                    p.moveDown();
                    drop();
                }
            }
            tetrisArr[this.j+r][this.i+c] = this.color;
        }
    }

    for (let r = 0; r < ROW; r++){
        let isRowFull = true;
        for (let c = 0; c < COLUMN; c++){
            isRowFull = isRowFull && (tetrisArr[r][c] !== EMPTY);
        }
        if (isRowFull){
            for (let j = r; j > 1; j--){
                for (let c = 0; c < COLUMN; c++){
                    tetrisArr[j][c] = tetrisArr[j-1][c];
                }
            }

            for (let c = 0; c < COLUMN; c++){
                tetrisArr[0][c] = EMPTY;
            }

            score += 10;
            level = Math.floor(score / 100) + 1;

        }
    }
    drawTableArea();
    scoreHTML.innerHTML = score;
    levelHTML.innerHTML = level;

};

Figure.prototype.collusion = function(i, j, figure) {
    for (let r = 0; r < figure.length; r++) {
        for (let c = 0; c < figure.length; c++) {

            if (!figure[r][c]) {
                continue;
            }

            let newI = this.i + c + i;
            let newJ = this.j + r + j;

            if (newI < 0 || newI >= COLUMN || newJ >= ROW) {
                return true;
            }
            if (newJ < 0) {
                continue;
            }
            if (tetrisArr[newJ][newI] !== EMPTY) {
                return true;
            }
        }
    }
    return false;
};

document.addEventListener('keydown', moves);

function moves(event){
    if(event.keyCode === 37 && !pause && !gameOver){
        p.moveLeft();
    }else if(event.keyCode === 38 && !pause && !gameOver){
        p.rotate();
    }else if(event.keyCode === 39 && !pause && !gameOver){
        p.moveRight();
    }else if(event.keyCode === 40 && !pause && !gameOver){
        p.moveDown();
    }
    else if(event.keyCode === 32) {
        paused();
    }
}


function paused() {
    pause = !pause;
    if (!pause) {
        document.getElementById("pause").innerHTML = "PAUSE";
        drop();
    } else {
        document.getElementById("pause").innerHTML = "PLAY";
    }
}

let dropStart = Date.now();
let gameOver = false;
let pause = false;

function drop() {
    let now = Date.now();
    let deltaTime = now - dropStart;
    if (deltaTime > 1000 - (level * 100) / 2) {
        if (level > 10) {
            alert ("Winner!");
            return;
        }
        p.moveDown();
        dropStart = Date.now();
    }
    if(!gameOver && !pause){
        requestAnimationFrame(drop);
    }
}

drop();

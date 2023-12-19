/**
 * @type HTMLCanvasElement
*/

const gameBoard = document.getElementById('gameBoard');
const ctx = gameBoard.getContext('2d');


const CANVASWIDTH = gameBoard.width = 390;
const CANVASHEIGHT = gameBoard.height = 390;

const cellCount = 3;

const cellWidth = CANVASWIDTH / cellCount;
const cellCenter = cellWidth / 2;
const cellHeight = CANVASWIDTH / cellCount;
const lineWidth = CANVASWIDTH / 20;
const lineCenter = lineWidth / 2;
const para = gameBoard.getBoundingClientRect();
const btnX = document.getElementById('x');
const btnO = document.getElementById('o');
let whoWin = null;
let tempL;
let playerX = "x";
let playerO = "o";
let xPlay = true;

let winLine = {
    h1: {
        sx: 0,
        sy: cellCenter,
        tx: 0,
        ty: cellCenter,
        dx: CANVASWIDTH,
        dy: cellCenter,
    },
    h2: {
        sx: 0,
        sy: cellCenter * 3,
        tx: 0,
        ty: cellCenter * 3,
        dx: CANVASWIDTH,
        dy: cellCenter * 3,
    },
    h3: {
        sx: 0,
        sy: cellCenter * 5,
        tx: 0,
        ty: cellCenter * 5,
        dx: CANVASWIDTH,
        dy: cellCenter * 5,
    },
    v1: {
        sx: cellCenter,
        sy: 0,
        tx: cellCenter,
        ty: 0,
        dx: cellCenter,
        dy: CANVASHEIGHT,
    },
    v2: {
        sx: cellCenter * 3,
        sy: 0,
        tx: cellCenter * 3,
        ty: 0,
        dx: cellCenter * 3,
        dy: CANVASHEIGHT,
    },
    v3: {
        sx: cellCenter * 5,
        sy: 0,
        tx: cellCenter * 5,
        ty: 0,
        dx: cellCenter * 5,
        dy: CANVASHEIGHT,
    },
    d1: {
        sx: 0,
        sy: 0,
        tx: 0,
        ty: 0,
        dx: CANVASWIDTH,
        dy: CANVASHEIGHT,
    },
    d2: {
        sx: CANVASWIDTH,
        sy: 0,
        tx: CANVASWIDTH,
        ty: 0,
        dx: 0,
        dy: CANVASHEIGHT,
    }
}

let game = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
]


function border(){
    const padding = lineWidth / 2;
    for(let i = 0; i < cellCount; i++){
        ctx.fillStyle = 'rgb(255, 245, 206)';
        if(i != 0) {
            ctx.fillRect(cellWidth * i, 0, padding, CANVASHEIGHT);
            ctx.fillRect(0, cellHeight * i, CANVASHEIGHT, padding);
        }
        if(i != 2) {
            ctx.fillRect((cellWidth - padding) + cellWidth * i, 0, padding, CANVASHEIGHT);
            ctx.fillRect(0, (cellHeight - padding) + cellHeight * i, CANVASHEIGHT, padding);
        }

        ctx.fillStyle = 'black';
    }
}

function drawX(cellX, cellY){
    let x = cellX * cellWidth;
    let y = cellY * cellHeight;
    const padding = lineWidth * 1.5;
    ctx.strokeStyle = 'rgb(255, 245, 206)';
    ctx.lineWidth = lineWidth ;
    ctx.beginPath();
    ctx.moveTo(x + padding, y + padding);
    ctx.lineTo(x + cellWidth - padding, y + cellHeight - padding)
    ctx.moveTo(x + cellWidth - padding, y + padding)
    ctx.lineTo(x + padding, y + cellHeight - padding)
    ctx.closePath()
    ctx.stroke();
}

function drawO(cellX, cellY){
    ctx.strokeStyle = '#rgb(255, 245, 206)';
    let x = cellX * cellWidth;
    let y = cellY * cellHeight;
    ctx.lineWidth = lineWidth;
    let padding = lineWidth;
    ctx.beginPath();
    ctx.arc(x + cellWidth / 2, y + cellHeight / 2, cellWidth / 2 - padding * 1.5, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
}

function drawWinLine(sx, sy, dx, dy, tempL){
    ctx.strokeStyle = 'rgb(190, 154, 107)';
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    let transactionSpeed = 15;
    if(tempL.tx < dx) tempL.tx += transactionSpeed;
    if(tempL.tx > dx) tempL.tx -= transactionSpeed;
    if(tempL.ty < dy) tempL.ty += transactionSpeed;
    if(tempL.ty > dy) tempL.ty -= transactionSpeed;
    // ctx.lineTo(tempL.tx, tempL.ty);
    ctx.lineTo(tempL.tx, tempL.ty);
    ctx.closePath();
    ctx.stroke();
}
function isWin(win) {
    if(win[0]){
        tempL = winLine.h1;
        whoWin = game[0][0];
    }
    if(win[1]){
        tempL = winLine.h2;
        whoWin = game[1][0];
    }
    if(win[2]){
        tempL = winLine.h3;
        whoWin = game[2][0];
    }
    if(win[3]){
        tempL = winLine.v1;
        whoWin = game[0][0];
    }
    if(win[4]){
        tempL = winLine.v2;
        whoWin = game[0][1];
    }
    if(win[5]){
        tempL = winLine.v3;
        whoWin = game[0][2];
    }
    if(win[6]){
        tempL = winLine.d1;
        whoWin = game[0][0];
    }
    if(win[7]){
        tempL = winLine.d2;
        whoWin = game[0][2];
    }
    if(whoWin != null){
        console.log(tempL)
        setTimeout(() => {
            interval = setInterval(()=>{
                drawWinLine(tempL.sx, tempL.sy, tempL.dx, tempL.dy, tempL)
            }, 12);
        }, 300);
        if(whoWin == 'o'){
            btnO.classList.add('win');
        }else{
            btnX.classList.add('win');
        }
    }else{
        if(xPlay){
            btnX.style.opacity = 1;
            btnO.style.opacity = 0;
        }
        if(!xPlay){
            btnX.style.opacity = 0;
            btnO.style.opacity = 1;
        }
    }
}
gameBoard.addEventListener('click', (e) => {
    const cellX = Math.floor((e.x - para.x) / cellWidth);
    const cellY = Math.floor((e.y - para.y) / cellHeight);
    if(game[cellY][cellX] == null && whoWin == null){
        if(xPlay){
            drawX(cellX, cellY);
            game[cellY][cellX] = playerX;
            xPlay = false;
        }else{
            drawO(cellX, cellY);
            game[cellY][cellX] = playerO;
            xPlay = true;
        }
    }
    
    win = [  
        (game[0][0] == game[0][1] && game[0][1] == game[0][2] && game[0][2] != null),
        (game[1][0] == game[1][1] && game[1][1] == game[1][2] && game[1][2] != null),
        (game[2][0] == game[2][1] && game[2][1] == game[2][2] && game[2][2] != null), 
        (game[0][0] == game[1][0] && game[1][0] == game[2][0] && game[2][0] != null),
        (game[0][1] == game[1][1] && game[1][1] == game[2][1] && game[2][1] != null),
        (game[0][2] == game[1][2] && game[1][2] == game[2][2] && game[2][2] != null), 
        (game[0][0] == game[1][1] && game[1][1] == game[2][2] && game[2][2] != null), 
        (game[2][0] == game[1][1] && game[1][1] == game[0][2] && game[0][2] != null) 
    ]
    isWin(win);
});

function restart(){
    game = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ]
    if(xPlay) xPlay = false;
    else xPlay = true;

    whoWin = null;
    
}

btnX.style.opacity = 1;
border();

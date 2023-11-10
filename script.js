const startChoiceBox = document.querySelector('.start-choice-box');
const startNewGame = startChoiceBox.querySelectorAll('.new-game');
const options = document.querySelector('.options');
const typeX = options.querySelector('#type-x');
const shapeXLn = options.querySelectorAll('.ln');
const typeO = options.querySelector('#type-o');
const shapeO = typeO.querySelector('.shape-o');

const playing = document.querySelector('.playing');
const playingHeader = playing.querySelector('.header');
const playingTurn = playingHeader.querySelector('.turn');
const board = playing.querySelector('.board');
const cells = board.querySelector('.cells');
const refresh = playingHeader.querySelector('.refresh');

const result = document.querySelector('.result');
const wonMessage = document.querySelector('.won');
const takesRound = document.querySelector('.takes-round');
const quitBtn = document.querySelector('.quit');
const nxtBtn = document.querySelector('.nxt');


/******************************START CHOICE BOX******************************/

let firstPlayer = 1; // 1 = X, 0 = O
let playWithCPU = 1; // 1 = yes, 0 = no

function optionXClicked() {
    firstPlayer = 1;
    typeX.style.background = "#a8bec9";
    shapeXLn.forEach((ln) => {
        ln.style.background = "#192a32";
    })

    typeO.style.background = "transparent";
    shapeO.style.borderColor = "#a8bec9";
}

function optionOClicked() {
    firstPlayer = 0;
    typeX.style.background = "transparent";
    shapeXLn.forEach((ln) => {
        ln.style.background = "#a8bec9";
    })

    typeO.style.background = "#a8bec9";
    shapeO.style.borderColor = "#192a32";
}

optionXClicked();
typeX.addEventListener('click', optionXClicked);
typeO.addEventListener('click', optionOClicked);


startNewGame.forEach((e) => {
    e.addEventListener('click', () => {
        playWithCPU = parseInt(e.getAttribute('val'));
        startChoiceBox.classList.add("hide");
        playing.classList.remove('hide');

        if(playWithCPU == 1) {
            cpuTurn = firstPlayer == 1? 0 : 1;
        }

        newScoreBoard();
        cleanBoard();

        refreshCnt = 5;
        refresh.style.background = "#2ec4be";
        updateRefreshCount();
    })
})


/******************************PLAYING******************************/

let arr = [
    [-1, -1, -1], // 1 = X, 0 = O
    [-1, -1, -1],
    [-1, -1, -1]
];

let anyWin = 0;
let curTurn = 1; // 1 = X, 0 = O
let whoWin = -1; // 1 = X, 0 = O
let remainTurns = 9;
let refreshCnt = 5;


function addCross(target) {
    if(anyWin == 1) return;
    let i = parseInt(target.getAttribute("i"));
    let j = parseInt(target.getAttribute("j"));
    if(arr[i][j] != -1) return;

    target.innerHTML = `<div class="cross"><div class="ln"></div><div class="ln l1"></div></div>`;
    const temp = target.querySelectorAll('.ln');
    temp.forEach((e) => {
        e.style.animation = "none";
        setTimeout(() => {
            e.style.animation = "cross-animation 300ms";
            e.style.height = "120%";
        }, 1)
    })

    arr[i][j] = 1;
    curTurn = 0;
    remainTurns--;
    checkWin();
    if(anyWin == 0) {
        changeTurn();
        checkCPUTurn();
    }
}

function addCircle(target) {
    if(anyWin == 1) return;
    let i = parseInt(target.getAttribute("i"));
    let j = parseInt(target.getAttribute("j"));
    if(arr[i][j] != -1) return;

    target.innerHTML = `<svg class="circl"><circle cx="50%" cy="50%" r="37%"></circle></svg>`;
    const temp = target.querySelector('circle');

    temp.style.animation = "none";
    setTimeout(() => {
        temp.style.animation = "circl-animation 300ms";
        temp.style.strokeDashoffset = "0";
    }, 1)

    arr[i][j] = 0;
    curTurn = 1;
    remainTurns--;
    checkWin();
    if(anyWin == 0) {
        changeTurn();
        checkCPUTurn();
    }
}

function cleanBoard() {
    cells.innerHTML = "";
    newBoard();

    anyWin = 0;
    whoWin = -1;
    curTurn = 1;
    remainTurns = 9;

    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            arr[i][j] = -1;
        }
    }
    
    changeTurn();
    checkCPUTurn();
}

function newBoard() {
    let innerContent = "";
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            innerContent += `<div class="cell" i="${i}" j="${j}" pos="${i}${j}"></div>`;
        }
    }
    innerContent += `<div class="win-line hide"><div class="inner-line"></div></div>`;
    cells.innerHTML = innerContent;
}

function bringingWinLine(color, pos) {
    setTimeout(() => {
        bringWinLine(color, pos);
    }, 300)
}

function checkWin() {
    for(let i = 0; i < 3; i++) {
        if(arr[i][0] == arr[i][1] && arr[i][0] == arr[i][2] && arr[i][0] != -1) {
            anyWin = 1;
            whoWin = arr[i][0];
            let pos = `${i}${0}${i}${1}${i}${2}`;
            bringingWinLine(arr[i][0], pos);
            break;
        } 
        else if(arr[0][i] == arr[1][i] && arr[0][i] == arr[2][i] && arr[0][i] != -1) {
            anyWin = 1;
            whoWin = arr[0][i];
            let pos = `${0}${i}${1}${i}${2}${i}`;
            bringingWinLine(arr[0][i], pos);
            break;
        }
    }

    if(anyWin == 0 && arr[0][0] == arr[1][1] && arr[0][0] == arr[2][2] && arr[0][0] != -1) {
        anyWin = 1;
        whoWin = arr[0][0];
        let pos = `${0}${0}${1}${1}${2}${2}`;
        bringingWinLine(arr[0][0], pos);
    }
    else if(anyWin == 0 && arr[0][2] == arr[1][1] && arr[0][2] == arr[2][0] && arr[0][2] != -1) {
        anyWin = 1;
        whoWin = arr[0][2];
        let pos = `${0}${2}${1}${1}${2}${0}`;
        bringingWinLine(arr[0][2], pos);
    }

    if(remainTurns == 0 && anyWin == 0) { // TIE ROUND
        anyWin = 1;

        setTimeout(() => {
            cells.querySelectorAll('.cell').forEach((cell) => {
                cell.style.animation = "bring-box-center 500ms";
                cell.style.zIndex = "5";
                
                setTimeout(() => {
                    cell.classList.add('hide');
                }, 499)
            })

            setTimeout(() => {
                showResult();
                cleanBoard();
            }, 499)
        }, 300)
    }
} 

function bringWinLine(color, pos) {
    const winLine = cells.querySelector('.win-line');
    const innerLine = winLine.querySelector('.inner-line');

    color = color == 0? "#eeac34" : "#2ec4be";
    winLine.classList.remove('hide');
    innerLine.style.background = color;

    switch(pos) {
        case "001020": {
            winLine.style.height = "100%";
            winLine.style.top = "0";
            winLine.style.left = "-68%";
            winLine.style.rotate = "0deg";
        } break;
        case "011121": {
            winLine.style.height = "100%";
            winLine.style.top = "0";
            winLine.style.left = "0";
            winLine.style.rotate = "0deg";
        } break;
        case "021222": {
            winLine.style.height = "100%";
            winLine.style.top = "0";
            winLine.style.left = "68%";
            winLine.style.rotate = "0deg";
        } break;
        case "000102": {
            winLine.style.height = "100%";
            winLine.style.top = "-68%";
            winLine.style.left = "0";
            winLine.style.rotate = "-90deg";
        } break;
        case "101112": {
            winLine.style.height = "100%";
            winLine.style.top = "0";
            winLine.style.left = "0";
            winLine.style.rotate = "-90deg";
        } break;
        case "202122": {
            winLine.style.height = "100%";
            winLine.style.top = "68%";
            winLine.style.left = "0";
            winLine.style.rotate = "-90deg";
        } break;
        case "001122": {
            winLine.style.height = "130%";
            winLine.style.top = "0";
            winLine.style.left = "0";
            winLine.style.rotate = "-45deg";
        } break;
        case "021120": {
            winLine.style.height = "130%";
            winLine.style.top = "0";
            winLine.style.left = "0";
            winLine.style.rotate = "45deg";
        }
    }

    setTimeout(() => {
        bringCenter(pos);
    }, 500);
}

function bringCenter(pos) {
    let cell1 = pos.substring(0, 2);
    let cell2 = pos.substring(2, 4);
    let cell3 = pos.substring(4, 6);

    cells.querySelectorAll('.cell').forEach((cell) => {
        let cellPos = cell.getAttribute('pos');
        if(cellPos == cell1 || cellPos == cell2 || cellPos == cell3) {
            cell.style.animation = "bring-box-center 500ms";
            cell.style.zIndex = "5";
            
            setTimeout(() => {
                cell.classList.add('hide');
            }, 499)
        }
    })

    cells.querySelector('.win-line').style.animation = "bring-line-center 500ms";
    setTimeout(() => {
        showResult();
        cleanBoard();
    }, 499)
}

function showResult() {
    let win;
    if(whoWin == -1) win = "TIE";
    else win = whoWin == 1? "X" : "O";

    if(win == "X") {
        firstPlayer == 1? score1++ : score2++;
    } else if(win == "O") {
        firstPlayer == 1? score2++ : score1++;
    } else scoreTie++;

    updateScoreBoard();
    showResultMessage(win);
}

function changeTurn() {
    playingTurn.innerHTML = `${curTurn == 1? 'X' : 'O'} TURN`;
}

function updateRefreshCount() {
    refresh.innerHTML = refreshCnt;
}


/*********************************SCORE CALCULATION**********************************/

const score = playing.querySelector('.score');
const player1Info = score.querySelector('.player1-info');
const player2Info = score.querySelector('.player2-info');
const player1Score = score.querySelector('.player1-score');
const player2Score = score.querySelector('.player2-score');
const tiesScore = score.querySelector('.ties-score');
const reset = playing.querySelector('.reset');
const clear = playingHeader.querySelector('.clear');

let score1 = 0;
let score2 = 0;
let scoreTie = 0;

function newScoreBoard() {
    let player1 = firstPlayer == 1? 'X' : 'O';
    let player2 = firstPlayer == 1? 'O' : 'X';

    if(playWithCPU == 1) {
        player1Info.innerHTML = `${player1} (YOU)`;
        player2Info.innerHTML = `${player2} (CPU)`;
    } else {
        player1Info.innerHTML = `${player1} (PLAYER 1)`;
        player2Info.innerHTML = `${player2} (PLAYER 2)`;
    }

    player1Score.innerHTML = score1 = 0;
    player2Score.innerHTML = score2 = 0;
    tiesScore.innerHTML = scoreTie = 0;
}

function updateScoreBoard() {
    player1Score.innerHTML = score1;
    player2Score.innerHTML = score2;
    tiesScore.innerHTML = scoreTie;
}


reset.addEventListener('click', () => {
    playing.classList.add('hide');
    startChoiceBox.classList.remove('hide');
    optionXClicked();
})

clear.addEventListener('click', () => {
    if(anyWin == 0 && refreshCnt > 0) {
        refreshCnt--;
        updateRefreshCount();
        cleanBoard();
    }
    if(refreshCnt == 0) {
        refresh.style.background = "#dc2f02";
    }
})


/****************************PLAY WITH CPU ALGORITHM MEDIUM LEVEL******************************/

let cpuTurn = 0; // 1 = X, 0 = O

function checkCPUTurn() {
    if(playWithCPU == 0) return;
    if(showingResult == 1) return;

    if(cpuTurn == curTurn) {
        setTimeout(() => {
            cpuAlgorithm(cpuTurn);
            cpuAlgorithm(firstPlayer);
            pickARandomCell();
        }, 300)
    }
}

function isValidMove(a, b, c, search) {
    if(a == search && b == search && c == -1) return true;
    if(a == search && b == -1 && c == search) return true;
    if(a == -1 && b == search && c == search) return true;
    return false;
} 

function cpuAlgorithm(search) {
    if(cpuTurn != curTurn) return;

    for(let i = 0; i < 3; i++) {
        if(isValidMove(arr[i][0], arr[i][1], arr[i][2], search)) {
            if(arr[i][0] == -1) cpuMove(i, 0);
            else if(arr[i][1] == -1) cpuMove(i, 1);
            else cpuMove(i, 2);
            break;
        }
        if(isValidMove(arr[0][i], arr[1][i], arr[2][i], search)) {
            if(arr[0][i] == -1) cpuMove(0, i);
            else if(arr[1][i] == -1) cpuMove(1, i);
            else cpuMove(2, i);
            break;
        }
    }

    if(cpuTurn == curTurn && isValidMove(arr[0][0], arr[1][1], arr[2][2], search)) {
        if(arr[0][0] == -1) cpuMove(0, 0);
        else if(arr[1][1] == -1) cpuMove(1, 1);
        else cpuMove(2, 2);
    }
    else if(cpuTurn == curTurn && isValidMove(arr[0][2], arr[1][1], arr[2][0], search)) {
        if(arr[0][2] == -1) cpuMove(0, 2);
        else if(arr[1][1] == -1) cpuMove(1, 1);
        else cpuMove(2, 0);
    }
}

function pickARandomCell() {
    if(cpuTurn != curTurn) return;

    let targetCell = parseInt(Math.random() * remainTurns);
    let curCell = 0;

    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            if(arr[i][j] == -1) {
                if(curCell == targetCell) {
                    cpuMove(i, j);
                    return;
                }
                curCell++;
            }
        }
    }
}

function cpuMove(i, j) {
    let targetPos = `${i}${j}`;

    cells.querySelectorAll('.cell').forEach((cell) => {
        let tem = cell.getAttribute("pos");
        if(tem == targetPos) {
            if(cpuTurn == 1) addCross(cell);
            else addCircle(cell);
        }
    })
}


/****************************USER INPUT********************************/

document.addEventListener('click', (e) => {
    if(e.target.classList.contains("cell")) {
        if(curTurn == 1) addCross(e.target);
        else addCircle(e.target);
    }
})


/****************************RESULT PART********************************/

let showingResult = 0; // 0 = No, 1 = yes

function showResultMessage(win) {
    showingResult = 1;
    result.classList.remove('hide');
    playing.style.filter = "blur(1px)";

    let color, winner, tookRound;
    if(win == "X") color = "#2ec4be";
    else if(win == "O") color = "#eeac34";
    else color = "#a8bec9";

    if(win == "X") {
        if(playWithCPU == 1) {
            winner = firstPlayer == 1? "YOU WON!" : "YOU LOST!";
        } else {
            winner = firstPlayer == 1? "PLAYER 1 WON!" : "PLAYER 2 WON!";
        }

        tookRound = "X TAKES THE ROUND";
    } 
    else if(win == "O") {
        if(playWithCPU == 1) {
            winner = firstPlayer == 1? "YOU LOST!" : "YOU WON!";
        } else {
            winner = firstPlayer == 1? "PLAYER 2 WON!" : "PLAYER 1 WON!";
        }

        tookRound = "O TAKES THE ROUND";
    }
    else {
        winner = "TIE!";
        tookRound = "TIE ROUND, NO WINNER";
    }

    wonMessage.innerHTML = winner;
    takesRound.innerHTML = tookRound;
    takesRound.style.color = color;
}

quitBtn.addEventListener('click', () => {
    showingResult = 0;
    playing.classList.add('hide');
    result.classList.add('hide');
    startChoiceBox.classList.remove('hide');
    playing.style.filter = "none";
    optionXClicked();
})

nxtBtn.addEventListener('click', () => {
    showingResult = 0;
    result.classList.add('hide');
    playing.style.filter = "none";

    document.querySelectorAll('.line').forEach((line) => {
        line.style.animation = "none";
        setTimeout(() => {
            line.style.animation = "animate 300ms";
        }, 1)
    })

    checkCPUTurn();
})

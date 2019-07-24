const canvas = document.getElementById('canvas');
const timerIndicator = document.querySelector('.timer');
const minesLeftIndicator = document.querySelector('.mines-left');
const resetGameBtn = document.getElementById('resetGame');

const ctx = canvas.getContext('2d');
let numberOfRows = 20;
let numberOfColumns = 25;
let numberOfCells = numberOfRows * numberOfColumns;


const gridSize = 23;
let mines = 100;
let preventClick = false;
let preventRightClick = true;

function setInitialMinesInput () {
    document.getElementById(('minesAmountInput')).value = mines;
}
setInitialMinesInput();

function setMines() {
    resetGame();
    let newMinesAmount = document.getElementById('minesAmountInput').value;
    if(newMinesAmount > 200) {
        document.getElementById('minesAmountInput').value = 200;
        newMinesAmount = 200;
    } else if(newMinesAmount < 1) {
        document.getElementById('minesAmountInput').value = 1;
        newMinesAmount = 1;
    }
    mines = newMinesAmount;
    setMinesLeftIndicator(mines);
}
setCanvasDimensions();



const canvasPosition = {
    x: window.canvas.offsetLeft,
    y: window.canvas.offsetTop
}

class Cell { 
    
    constructor(coords, state, row, column, pressed, flagged) {
        this.coords = coords;
        this.state = state;
        this.row = row;
        this.column = column;
        this.pressed = pressed;
        this.flagged = flagged;
    }
}

function createMinefield() {
    for(let i = 0; i < numberOfRows; i++) {
        let rowArr = [];
    
        for(let j = 0; j < numberOfColumns; j++) {
            let coords = [gridSize * j, gridSize * i];
            let obj = new Cell(coords, 'empty', i + 1, j + 1, false, false);
            rowArr.push(obj);
        }
        minefield.push(rowArr);
    }
}

let minefield = [];
let minesArr = [];
let safeStartingArea = [];

let testNumber = 39;
let counter = 0;
let timer = 0;
createMinefield();
drawMinefield();

resetGameBtn.addEventListener('click', (e) => {
    stop();
    resetGame();
})


canvas.addEventListener('click', (e) => pickCellWithMouse(e));
window.oncontextmenu = (e) => {
    e.preventDefault();
    pickCellWithMouseRightClick(e);
}

function gameOver() {
    stop();
    // preventClick = false;

}

let interval;

function stop() {
    clearInterval(interval);
};

function play() {
    preventRightClick = false;
    interval = setInterval(() => {
        timer++;
        timerIndicator.innerText = `Time: ${timer}`;
    }, 1000);
};



function resetGame() {
    clearInterval(interval)
    minefield = [];
    minesArr = [];
    safeStartingArea = [];
    timer = 0;
    timerIndicator.innerText = `Time: ${timer}`;

    createMinefield();
    setMinesLeftIndicator(mines);

    drawMinefield();
    preventClick = false;
    preventRightClick = true;
    
}

function startGame() {
    createMines(mines);
    scanAroundAndCountMines();
    
    setMinesLeftIndicator(mines);
    play();
};

function setCanvasDimensions() {
    const canvasComputedWidth = numberOfColumns * gridSize;
    const canvasComputedHeight = numberOfRows * gridSize;
    canvas.width = canvasComputedWidth + 2;
    canvas.height = canvasComputedHeight + 2;
};

function createSafeStartingArea(cell) {
    for(let i = cell.row - 1; i <= cell.row + 1 ; i++) {
        if(minefield[i-1]) {
            for(let j = cell.column - 1; j <= cell.column + 1; j++) {
                if(minefield[i-1][j-1]) {
                    let coords = [i, j];
                    let globalId;
                    if(i < 2) {
                        globalId = j;
                    } else {
                        globalId = ((i-1) * numberOfColumns) + j;
                    }
                    safeStartingArea.push(globalId, coords);


                }
                
            }

        }
    }
};

function getNewRandomNumber() {
    let randomNumber = getRandomInt(1, numberOfCells);
    if(!minesArr.includes(randomNumber) && !safeStartingArea.includes(randomNumber)) {
        minesArr.push(randomNumber);
    } else {
        getNewRandomNumber();
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createArrOfNumbers(number) {
    for(let i = 0; i < number; i++) {
        getNewRandomNumber();
    }
}

function recursiveRow(x) {
    if(x > numberOfColumns) {
        counter++;
        x = x - numberOfColumns;
        recursiveRow(x);
    } else {
        counter++;
    }
}

function getCellRow (val) {
    recursiveRow(val);
    return counter;
}

function getCellId (val, row) {
   if(val <= numberOfColumns) {
       return val;
   } else {
    return val - ((row -1)  * numberOfColumns)
   }
}

function getCellPosition (val) {
    let cellRow = getCellRow(val);
    let cellId = getCellId(val, cellRow);
    counter = 0;
    return ([cellRow - 1, cellId - 1]);
}




function createMines(minesAmount) {
    createArrOfNumbers(minesAmount);
    minesArr.forEach(id => {
        let row = getCellPosition(id)[0];
        let column = getCellPosition(id)[1];
        minefield[row][column]['state'] = 'mine';
    })
}


function scanAroundAndCountMines() {
    minefield.forEach(line => line.forEach(cell => {
        counter = 0;
        if(cell.state == 'mine') {
            return;
        } else if (cell.state == 'empty')    
        {

            for(let i = cell.row - 1; i <= cell.row + 1 ; i++) {
                if(minefield[i-1]) {
                    for(let j = cell.column - 1; j <= cell.column + 1; j++) {
                        if(minefield[i-1][j-1]) {
                            if(minefield[i-1][j-1]['state'] == 'mine') {
                                counter++;
                            }
                        }
                    }
                }
            }
            cell.minesAmount = counter;
        }
    
    }));
};




function scanAroundAndPressWhenNoMine(cell) {
        let prop = 'minesAmount';
        let propVal = 0;
        cell.pressed = true;

        for(let i = cell.row - 1; i <= cell.row + 1 ; i++) {
            if(minefield[i-1]) {
                for(let j = cell.column - 1; j <= cell.column + 1; j++) {
                    if(minefield[i-1][j-1]) {
                        if(minefield[i-1][j-1][prop] === propVal &&
                             minefield[i-1][j-1] !== cell && 
                             minefield[i-1][j-1].pressed === false) {
                            scanAroundAndPressWhenNoMine(minefield[i-1][j-1]);
                        }
                    }
                }
            }
        };
            revealAround(cell);
}



function checkForPressed() {
    minefield.forEach(row => row.forEach(cell => {
        if(cell.pressed === true){
            drawActive(cell);
        }
    }))
}

function drawMinefield() {
    minefield.forEach(line => line.forEach(cell => {
        createRect(cell, '');
    }
    ));
};



const ifNoMines = () => minefield.every(row => row.every(cell => cell.state == 'empty'));




function pickCellWithMouse(e) {

    if(preventClick) {
        return;
    }
    const mouseX = e.x; 
    const mouseY = e.y; 
    const canvasX = canvasPosition.x;
    const canvasY = canvasPosition.y;
    let cellX = mouseX - canvasX;
    let cellY = mouseY - canvasY;

    minefield.forEach(row => row.forEach(cell => {
        if(cellX >= cell.coords[0] && cellX <= cell.coords[0] + gridSize && 
        cellY >=cell.coords[1] && cellY <= cell.coords[1] + gridSize) {

            if(ifNoMines()) {
                createSafeStartingArea(cell);
                startGame();
            }
            if(!cell.flagged){
            revealIfEmpty(cell);
            checkForPressed();
            };
        }
    }))
};

function pickCellWithMouseRightClick(e) {
    if(preventRightClick) {
        return
    }
    const mouseX = e.x; 
    const mouseY = e.y; 
    const canvasX = canvasPosition.x;
    const canvasY = canvasPosition.y;
    let cellX = mouseX - canvasX;
    let cellY = mouseY - canvasY;

    minefield.forEach(row => row.forEach(cell => {
        if(cellX >= cell.coords[0] && cellX <= cell.coords[0] + gridSize && cellY >=cell.coords[1] && cellY <= cell.coords[1] + gridSize) {

            if(!cell.pressed){
            toggleFlag(cell);
            
            setMinesLeftIndicator(mineCounter(cell));
            drawFlag(cell);
            isGameWon();
            
            };
        }
    }))

};

function mineCounter() {
     let flagCounter = 0;
    minefield.forEach(row => row.forEach(cell => {
        if(cell.flagged) {
            flagCounter++;
        }
    }));

    let minesLeft = mines - flagCounter;
    return minesLeft;
}



function toggleFlag(cell) {
    cell.flagged = !cell.flagged;
}
function drawFlag(cell) {
    if(cell.flagged){
    createRect(cell, '');
    } else if(!cell.flagged) {
        createRect(cell, '');
    }
}

function pressAllMines() {
    minefield.forEach(row => row.forEach(cell => {
        if(cell.state === 'mine') {
            cell.pressed = true;
        }
    }))
};



function revealIfEmpty(cell) {
    if(!(cell.state === 'empty')) {
        pressAllMines();
        drawAllMines();
        preventClick = true;
        alert('You loose!')
        gameOver();
    } else if (cell.state === 'empty' && cell.minesAmount === 0) {
        scanAroundAndPressWhenNoMine(cell);
        isGameWon();
    } else if (cell.state === 'empty' && cell.minesAmount > 0) {
        drawActive(cell);
        cell.pressed = true;
        isGameWon();
    }
}

function drawAllMines() {
    minefield.forEach(row => row.forEach(cell => {
        if(cell.state === 'mine') {
            drawActive(cell);
        }
    }))
}

function revealAround(cell) {
    cell.pressed = true;

    for(let i = cell.row - 1; i <= cell.row + 1 ; i++) {
        if(minefield[i-1]) {
            for(let j = cell.column - 1; j <= cell.column + 1; j++) {
                if(minefield[i-1][j-1]) {
                    minefield[i-1][j-1]['pressed'] = true;
                    }
                }
        }
    }
};



function setMinesLeftIndicator (val) {
    minesLeftIndicator.innerText = `Mines: ${val}`;
}


function isGameWon () {
    function countPressedAndFlaggedCells() {
        let numberOfPressedCells = 0;
        let numberOfFlaggedCells = 0;
        minefield.forEach(row => row.forEach(cell => {
            if(cell.pressed) {
                numberOfPressedCells++;
            } 
            if(cell.flagged) {
                numberOfFlaggedCells++;
            }
        }));
        return [numberOfPressedCells, numberOfFlaggedCells];
    }

    const [numberOfPressedCells, numberOfFlaggedCells] = countPressedAndFlaggedCells();

    if(numberOfPressedCells + numberOfFlaggedCells == numberOfCells) {
        gameOver();
        alert('You win!')
    } 

}

function createRect(cell, text) {
    // STYLING 
    const lineColor = '#948ED9';
    let x = cell.coords[0] + 1;
    let y = cell.coords[1] + 1;
    color = '#C1BEEF';
    let width = gridSize;
    let height = gridSize;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(x , y, width, height);
    ctx.closePath();

    
    if(!cell.pressed){
        ctx.fillStyle = '#CDC9F6';
        ctx.fillRect(x , y, width, height);


        

        ctx.beginPath();
        ctx.fillStyle = '#524C9B';
        ctx.fillRect(x + width - 3, y, 3, height);
     
        ctx.fillRect(x , y + height - 3, width, 3);
        ctx.fillRect(x + width -5, y + height - 5, 4, 4);

        ctx.closePath();
        ctx.beginPath();
        ctx.fillStyle = '#ffeaea';
        ctx.fillRect(x , y, 3, height);
        
        ctx.fillRect(x  , y, width, 3);
        ctx.closePath();
        ctx.beginPath();
        ctx.fillStyle = '#524C9B';
        ctx.fillRect(x + width - 2, y + 2, 1, 1);
        
        ctx.fillRect(x + 2, y + height - 2, 1, 1);
        ctx.fillRect(x + 2, y + height - 2, 1, 1);
        ctx.closePath();
    } 

    if(cell.flagged) {
        ctx.fillStyle = '#524C9B';
        ctx.fillRect(x + 12 , y + 4, 2, 14);
        ctx.fillRect(x + 7 , y + 17, 10, 2);
        ctx.fillStyle = 'red';
        ctx.fillRect(x + 8 , y + 6, 4, 6);
        ctx.fillRect(x + 5 , y + 8, 2, 6 );
    }

    switch (text) {
        case '1':
        ctx.fillStyle = '#2D3DFF';
            break;
        case '2':
        ctx.fillStyle = '#1B8538';
            break;
        case '3':
        ctx.fillStyle = '#C70B0B';
            break;
        case '4':
        ctx.fillStyle = '#272553';
            break;
        case '5':
        ctx.fillStyle = '#800439';
            break;
    
        default:
        ctx.fillStyle = 'black';
            break;
    }

    if(cell.state === 'mine' && cell.pressed) {
        ctx.fillStyle = '#524C9B';

        /// CIRCLE
        const moveX = 1;
        const moveY = 0;
        ctx.fillRect(x + 5 + moveX, y + 6 + moveY, 11, 11);
        ctx.fillRect(x + 8 + moveX, y + 5 + moveY, 5, 13);
        ctx.fillRect(x + 4 + moveX, y + 9 + moveY, 13, 5);

        // / LINES
        ctx.fillRect(x + 2, y + 10, 19, 3);
        ctx.fillRect(x + 10, y + 3, 3, 17);

        // mine points
        ctx.fillRect(x + 5, y + 5, 2, 2);
        ctx.fillRect(x + 16, y + 5, 2, 2);

        ctx.fillRect(x + 5, y + 16, 2, 2);
        ctx.fillRect(x + 16, y + 16, 2, 2);

        /// HIGHLIGHT
        ctx.fillStyle = '#cdc9f6';
        ctx.fillRect(x + 7, y + 9, 3, 3);
        }
    
    ctx.font = '28px "VT323", sans-serif';
    ctx.fillText(text, x + 7, y + 20);
    
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = lineColor;
    ctx.strokeRect(cell.coords[0] + 1, cell.coords[1] + 1, gridSize, gridSize);
    ctx.closePath();
    ctx.beginPath();
    ctx.fillStyle = lineColor;
    // TOP LEFT
    ctx.fillRect(x, y + height - 3 , 3, 3);

    ctx.fillRect(x + 1, y + height -  5, 1, 1);
    ctx.fillRect(x + 1, y + height -  4, 1, 1);

    ctx.fillRect(x + 3, y + height - 2, 1, 1);
    ctx.fillRect(x + 4, y + height - 2, 1, 1);

    // TOP RIGHT
    // ctx.fillStyle = 'red';
    
    ctx.fillRect(x + width - 2, y + 1, 1, 1);

    ctx.fillRect(x + width -  5 , y  + 1, 1, 1);
    ctx.fillRect(x + width - 4, y + 1, 1, 1);

    ctx.fillRect(x + width - 2, y +  3, 1, 1);
    ctx.fillRect(x + 4, y + height - 2, 1, 1);
    
    ctx.fillRect(x, y + height - 3 , 3, 3);

    ctx.fillRect(x + 1, y + height -  5, 1, 1);
    ctx.fillRect(x + 1, y + height -  4, 1, 1);

    ctx.fillRect(x + 3, y + height - 2, 1, 1);
    ctx.fillRect(x + 4, y + height - 2, 1, 1);
    
    ctx.fillRect(x, y + height - 3 , 3, 3);

    ctx.fillRect(x + 1, y + height -  5, 1, 1);
    ctx.fillRect(x + 1, y + height -  4, 1, 1);

    ctx.fillRect(x + 3, y + height - 2, 1, 1);
    ctx.fillRect(x + 4, y + height - 2, 1, 1);
    
    
    ctx.closePath();
};

function drawActive(cell) {
    switch (cell.minesAmount) {
        case 0:
            createRect(cell, '');
            break;
        case 1:
            createRect(cell, '1');
            break;
        case 2:
            createRect(cell, '2');
            break;
        case 3:
            createRect(cell, '3');
            break;
        case 4:
            createRect(cell, '4');
            break;
        case 5:
            createRect(cell, '5');
            break;
        case 6:
            createRect(cell, '6');
            break;
        case 7:
            createRect(cell, '7');
            break;
        case undefined:
            createRect(cell, '');
            break;
    }
}
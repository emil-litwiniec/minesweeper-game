import Cell from './Cell';
import { numberOfRows, numberOfColumns, gridSize, numberOfCells } from './config';
import { setCanvasDimensions, createRect, drawActive } from './canvas';

const timerIndicatorElement = document.getElementById('timer');
const minesLeftIndicatorElement = document.getElementById('minesLeft');
const resetGameBtnElement = document.getElementById('resetGame');
const minesAmountInputElement = document.getElementById('minesAmountInput');
const minesAmountSetBtnElement = document.getElementById('minesAmountSetBtn');

let mines = 100;
let preventClick = false;
let preventRightClick = true;

let minefield = [];
let minesArr = [];
let safeStartingArea = [];

let counter = 0;
let timer = 0;
let interval;

(function init() {
    setInitialMinesInput();
    setCanvasDimensions();
    createMinefield();
    drawMinefield();
})();

function stop() {
    clearInterval(interval);
}

function play() {
    preventRightClick = false;
    interval = setInterval(() => {
        timer++;
        timerIndicatorElement.innerText = `Time: ${timer}`;
    }, 1000);
}

function gameOver() {
    stop();
    preventRightClick = true;
}

function resetGame() {
    clearInterval(interval);
    minefield = [];
    minesArr = [];
    safeStartingArea = [];
    timer = 0;
    timerIndicatorElement.innerText = `Time: ${timer}`;

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
}

function isGameWon() {
    function countPressedAndFlaggedCells() {
        let numberOfPressedCells = 0;
        let numberOfFlaggedCells = 0;
        minefield.forEach((row) =>
            row.forEach((cell) => {
                if (cell.pressed) {
                    numberOfPressedCells++;
                }
                if (cell.flagged) {
                    numberOfFlaggedCells++;
                }
            })
        );
        return [numberOfPressedCells, numberOfFlaggedCells];
    }

    const [numberOfPressedCells, numberOfFlaggedCells] = countPressedAndFlaggedCells();

    const hasAllMinesBeenFound = numberOfPressedCells + numberOfFlaggedCells === numberOfCells;

    if (!hasAllMinesBeenFound) return;
    gameOver();
    alert('You win!');
}

function drawMinefield() {
    minefield.forEach((line) =>
        line.forEach((cell) => {
            createRect(cell, '');
        })
    );
}

function recursiveRow(x) {
    if (x > numberOfColumns) {
        counter++;
        x = x - numberOfColumns;
        recursiveRow(x);
    } else {
        counter++;
    }
}

function getCellRow(val) {
    recursiveRow(val);
    return counter;
}

function getCellId(val, row) {
    return val <= numberOfColumns ? val : val - (row - 1) * numberOfColumns;
}

function getCellPosition(val) {
    const cellRow = getCellRow(val);
    const cellId = getCellId(val, cellRow);
    counter = 0;
    return [cellRow - 1, cellId - 1];
}

function createSafeStartingArea(cell) {
    for (let i = cell.row - 1; i <= cell.row + 1; i++) {
        if (minefield[i - 1]) {
            for (let j = cell.column - 1; j <= cell.column + 1; j++) {
                if (minefield[i - 1][j - 1]) {
                    const coords = [i, j];
                    const globalId = i < 2 ? j : (i - 1) * numberOfColumns + j;
                    safeStartingArea.push(globalId, coords);
                }
            }
        }
    }
}

function checkForPressed() {
    minefield.forEach((row) =>
        row.forEach((cell) => {
            if (cell.pressed === true) {
                drawActive(cell);
            }
        })
    );
}

function revealIfEmpty(cell) {
    if (!(cell.state === 'empty')) {
        pressAllMines();
        drawAllMines();
        preventClick = true;
        gameOver();
        setTimeout(() => alert('Boom!'), 100);
    } else if (cell.state === 'empty' && cell.minesAmount === 0) {
        scanAroundAndPressWhenNoMine(cell);
        isGameWon();
    } else if (cell.state === 'empty' && cell.minesAmount > 0) {
        drawActive(cell);
        cell.pressed = true;
        isGameWon();
    }
}
function revealAround(cell) {
    cell.pressed = true;

    for (let i = cell.row - 1; i <= cell.row + 1; i++) {
        if (minefield[i - 1]) {
            for (let j = cell.column - 1; j <= cell.column + 1; j++) {
                if (minefield[i - 1][j - 1]) {
                    minefield[i - 1][j - 1]['pressed'] = true;
                }
            }
        }
    }
}

function pushUniqueNumberToMinesArr() {
    const randomNumber = getRandomInt(1, numberOfCells);
    if (!minesArr.includes(randomNumber) && !safeStartingArea.includes(randomNumber)) {
        minesArr.push(randomNumber);
    } else {
        pushUniqueNumberToMinesArr();
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawAllMines() {
    minefield.forEach((row) =>
        row.forEach((cell) => {
            if (cell.state === 'mine') {
                drawActive(cell);
            }
        })
    );
}

function countMines() {
    let flagCounter = 0;
    minefield.forEach((row) =>
        row.forEach((cell) => {
            if (cell.flagged) {
                flagCounter++;
            }
        })
    );

    const minesLeft = mines - flagCounter;
    return minesLeft;
}

function createMines(minesAmount) {
    for (let i = 0; i < minesAmount; i++) {
        pushUniqueNumberToMinesArr();
    }
    minesArr.forEach((id) => {
        const row = getCellPosition(id)[0];
        const column = getCellPosition(id)[1];
        minefield[row][column]['state'] = 'mine';
    });
}

function setMines() {
    resetGame();
    let newMinesAmount = minesAmountInputElement.value;
    if (newMinesAmount > 200) {
        minesAmountInputElement.value = 200;
        newMinesAmount = 200;
    } else if (newMinesAmount < 1) {
        minesAmountInputElement.value = 1;
        newMinesAmount = 1;
    }
    mines = newMinesAmount;
    setMinesLeftIndicator(mines);
}

function createMinefield() {
    for (let i = 0; i < numberOfRows; i++) {
        const rowArr = [];

        for (let j = 0; j < numberOfColumns; j++) {
            const coords = [gridSize * j, gridSize * i];
            const obj = new Cell(coords, 'empty', i + 1, j + 1, false, false);
            rowArr.push(obj);
        }
        minefield.push(rowArr);
    }
}

function pressAllMines() {
    minefield.forEach((row) =>
        row.forEach((cell) => {
            if (cell.state === 'mine') {
                cell.pressed = true;
            }
        })
    );
}

function scanAroundAndCountMines() {
    minefield.forEach((line) =>
        line.forEach((cell) => {
            counter = 0;
            if (cell.state == 'mine') {
                return;
            } else if (cell.state == 'empty') {
                for (let i = cell.row - 1; i <= cell.row + 1; i++) {
                    if (minefield[i - 1]) {
                        for (let j = cell.column - 1; j <= cell.column + 1; j++) {
                            const cellHasMine =
                                minefield[i - 1][j - 1] &&
                                minefield[i - 1][j - 1]['state'] == 'mine';
                            cellHasMine && counter++;
                        }
                    }
                }
                cell.minesAmount = counter;
            }
        })
    );
}

function scanAroundAndPressWhenNoMine(cell) {
    const prop = 'minesAmount';
    const propVal = 0;
    cell.pressed = true;

    for (let i = cell.row - 1; i <= cell.row + 1; i++) {
        if (minefield[i - 1]) {
            for (let j = cell.column - 1; j <= cell.column + 1; j++) {
                const shouldPressNext =
                    minefield[i - 1][j - 1] &&
                    minefield[i - 1][j - 1][prop] === propVal &&
                    minefield[i - 1][j - 1] !== cell &&
                    minefield[i - 1][j - 1].pressed === false;

                shouldPressNext && scanAroundAndPressWhenNoMine(minefield[i - 1][j - 1]);
            }
        }
    }
    revealAround(cell);
}

const checkIfNoMines = () => minefield.every((row) => row.every((cell) => cell.state == 'empty'));

function setMinesLeftIndicator(val) {
    minesLeftIndicatorElement.innerText = `Mines: ${val}`;
}

function setInitialMinesInput() {
    minesAmountInputElement.value = mines;
}

function handleClick(e, isPrevented, callback) {
    if (isPrevented) {
        return;
    }
    const mouseX = e.x;
    const mouseY = e.y;
    const canvasX = window.canvas.offsetLeft;
    const canvasY = window.canvas.offsetTop;
    let cellX = mouseX - canvasX;
    let cellY = mouseY - canvasY;

    minefield.forEach((row) =>
        row.forEach((cell) => {
            const shouldClick =
                cellX >= cell.coords[0] &&
                cellX <= cell.coords[0] + gridSize &&
                cellY >= cell.coords[1] &&
                cellY <= cell.coords[1] + gridSize;
            shouldClick && callback(cell);
        })
    );
}

const handleLeftClick = (cell) => {
    if (checkIfNoMines()) {
        createSafeStartingArea(cell);
        startGame();
    }
    if (!cell.flagged) {
        revealIfEmpty(cell);
        checkForPressed();
    }
};

const handleRightClick = (cell) => {
    if (!cell.pressed) {
        toggleFlag(cell);

        setMinesLeftIndicator(countMines(cell));
        createRect(cell, '');
        isGameWon();
    }
};

function toggleFlag(cell) {
    cell.flagged = !cell.flagged;
}

resetGameBtnElement.addEventListener('click', () => {
    stop();
    resetGame();
});
minesAmountSetBtnElement.addEventListener('click', setMines);
canvas.addEventListener('click', (e) => handleClick(e, preventClick, handleLeftClick));

window.oncontextmenu = (e) => {
    e.preventDefault();
    handleClick(e, preventRightClick, handleRightClick);
};

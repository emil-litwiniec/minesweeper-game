const canvas = document.getElementById('canvas');

const ctx = canvas.getContext('2d');

const gridSize = 26;





class Cell { 

    constructor(coords) {
        this.coords = coords;
    }
}




let minefield = [];

function createMinefield() {
    for(let i = 0; i < 16; i++) {
        let rowArr = [];
    
        for(let j = 0; j < 30; j++) {
            let coords = [gridSize * j, gridSize * i];
            let obj = new Cell(coords);
            obj.state = 'empty';
            obj.row = i + 1;
            obj.column = j + 1;
            obj.pressed = false;
            obj.flagged = false;
            rowArr.push(obj);
        }
        minefield.push(rowArr);
        
    }
}

createMinefield();

function getNewRandomNumber() {
    let randomNumber = getRandomInt(1, 480);
    if(!minesArr.includes(randomNumber)) {
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


let minesArr = [];
function createArrOfNumbers(number) {
    for(let i = 0; i < number; i++) {
        getNewRandomNumber();
    }
}



let testNumber = 39;
let counter = 0;

function recursiveRow(x) {
    if(x > 30) {
        counter++;
        x = x - 30;
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
   if(val <= 30) {
       return val;
   } else {
    return val - ((row -1)  * 30)
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
        // console.log(minefield[row][column], `Coords: ${row}, ${column}`);
    })
}

createMines(80);

scanAroundAndCountMines();
function scanAroundAndCountMines() {
    minefield.forEach(line => line.forEach(cell => {
        counter = 0;
        let row = cell.row ;
        let column = cell.column ;
        if(cell.state == 'mine') {
            return;
        } else if (cell.state == 'empty')    
        {
            if(row === 1 && column === 1) {
                for(let i = row; i <= row + 1; i++){
                    for(let j = column; j <= column + 1; j++){
                        if(minefield[i-1][j-1]['state'] == 'mine') {
                            counter++;
                        }
                    }
                }
            } else if(row === 1 && column === 30) {
                for(let i = row; i <= row + 1; i++){
                    for(let j = column - 1; j <= column; j++){
                        if(minefield[i-1][j-1]['state'] == 'mine') {
                            counter++;
                        }
                    }
                }
            } else if(row === 16 && column === 1) {
                for(let i = row - 1; i <= row; i++){
                    for(let j = column; j <= column + 1; j++){
                        if(minefield[i-1][j-1]['state'] == 'mine') {
                            counter++;
                        }
                    }
                }
            } else if(row === 16 && column === 30) {
                for(let i = row - 1; i <= row; i++){
                    for(let j = column - 1; j <= column; j++){
                        if(minefield[i-1][j-1]['state'] == 'mine') {
                            counter++;
                        }
                    }
                }
            }   else if(row === 1 && column < 30) {
                for(let i = row; i <= row + 1; i++){
                    for(let j = column - 1; j <= column + 1; j++){
                        if(minefield[i-1][j-1]['state'] == 'mine') {
                            counter++;
                        }
                    }
                }
            } 
            else if (row === 16) {
                for(let i = row - 1; i <= row; i++){
                    for(let j = column - 1; j <= column + 1; j++){
                        if(minefield[i-1][j-1]['state'] == 'mine') {
                            counter++;
                        }
                    }
                }
            } else if (column === 1) {
                for(let i = row - 1; i <= row + 1; i++){
                    for(let j = column; j <= column + 1; j++){
                        if(minefield[i-1][j-1]['state'] == 'mine') {
                            counter++;
                        }
                    }
                
            }} else if (column === 30) {
                for(let i = row - 1; i <= row + 1; i++){
                    for(let j = column - 1; j <= column; j++){
                        if(minefield[i-1][j-1]['state'] == 'mine') {
                            counter++;
                        }
                    }
                }
            } else if (row > 1 && row < 16 && column > 1 && column < 30){
                for(let i = (row - 1); i <= row + 1; i++){
                    for(let j = (column - 1); j <= column + 1; j++){
                        if(minefield[i-1][j-1]['state'] == 'mine') {
                            counter++;
                        }
                    }
                }
            }
            
            
            cell.minesAmount = counter;
        }
    
    }));
}




function scanAroundAndUnpressWhenNoMine(cell) {
        let row = cell.row ;
        let column = cell.column ;
        let prop = 'minesAmount';
        let propVal = 0;
        cell.pressed = true;
        
            if(row === 1 && column === 1) {
                for(let i = row; i <= row + 1; i++){
                    for(let j = column; j <= column + 1; j++){
                        if(minefield[i-1][j-1][prop] !== propVal) {
                            minefield[i-1][j-1]['pressed'] = true;
                        }
                    }
                }
            } else if(row === 1 && column === 30) {
                for(let i = row; i <= row + 1; i++){
                    for(let j = column - 1; j <= column; j++){
                        if(minefield[i-1][j-1][prop] !== propVal) {
                            minefield[i-1][j-1]['pressed'] = true;
                        }
                    }
                }
            } else if(row === 16 && column === 1) {
                for(let i = row - 1; i <= row; i++){
                    for(let j = column; j <= column + 1; j++){
                        if(minefield[i-1][j-1][prop] !== propVal) {
                            minefield[i-1][j-1]['pressed'] = true;
                        }
                    }
                }
            } else if(row === 16 && column === 30) {
                for(let i = row - 1; i <= row; i++){
                    for(let j = column - 1; j <= column; j++){
                        if(minefield[i-1][j-1][prop] !== propVal) {
                            minefield[i-1][j-1]['pressed'] = true;
                        }
                    }
                }
            }   else if(row === 1 && column < 30) {
                for(let i = row; i <= row + 1; i++){
                    for(let j = column - 1; j <= column + 1; j++){
                        if(minefield[i-1][j-1][prop] !== propVal) {
                            minefield[i-1][j-1]['pressed'] = true;
                        }
                    }
                }
            } 
            else if (row === 16) {
                for(let i = row - 1; i <= row; i++){
                    for(let j = column - 1; j <= column + 1; j++){
                        if(minefield[i-1][j-1][prop] !== propVal) {
                            minefield[i-1][j-1]['pressed'] = true;
                        }
                    }
                }
            } else if (column === 1) {
                for(let i = row - 1; i <= row + 1; i++){
                    for(let j = column; j <= column + 1; j++){
                        if(minefield[i-1][j-1][prop] !== propVal) {
                            minefield[i-1][j-1]['pressed'] = true;
                        }
                    }
                
            }} else if (column === 30) {
                for(let i = row - 1; i <= row + 1; i++){
                    for(let j = column - 1; j <= column; j++){
                        if(minefield[i-1][j-1][prop] !== propVal) {
                            minefield[i-1][j-1]['pressed'] = true;
                        }
                    }
                }
            } else if (row > 1 && row < 16 && column > 1 && column < 30){
                console.log('hey');
                for(let i = (row - 1); i <= row + 1; i++){
                    for(let j = (column - 1); j <= column + 1; j++){
                        // minefield[i-1][j-1]['pressed'] = true;
                        if(minefield[i-1][j-1][prop] === propVal && minefield[i-1][j-1] !== cell && minefield[i-1][j-1].pressed === false) {
                            console.log(`minefield: ${minefield[i-1][j-1].row}, ${minefield[i-1][j-1].column}, cell: ${cell.row}, ${cell.column}`);
                            scanAroundAndUnpressWhenNoMine(minefield[i-1][j-1]);
                        }
                    }
                }
            }
            
            revealAround(cell);
        
    
   
}

function createRect(cell, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(cell.coords[0] + 1, cell.coords[1] + 1, gridSize, gridSize);
    ctx.closePath();
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.strokeRect(cell.coords[0] + 1, cell.coords[1] + 1, gridSize, gridSize);
    ctx.closePath();
//     ctx.beginPath();
//     ctx.fillStyle = 'blue';
//     ctx.fillRect(cell.coords[0], cell.coords[1], gridSize - 5, gridSize - 5);
//     ctx.closePath();
};

function drawActive(cell) {
    switch (cell.minesAmount) {
        case 0:
            createRect(cell, 'grey');
            break;
        case 1:
            createRect(cell, 'blue');
            break;
        case 2:
            createRect(cell, 'green');
            break;
        case 3:
            createRect(cell, 'purple');
            break;
        case 4:
            createRect(cell, 'yellow');
            break;
        case 5:
            createRect(cell, 'black');
            break;
        case 6:
            createRect(cell, 'brown');
            break;
        case 7:
            createRect(cell, 'coral');
            break;
        case undefined:
            createRect(cell, 'red');
            break;
    }
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
        createRect(cell, '#f4f4f4');
        // drawPressed(cell);
    }
    ));
};

drawMinefield();

const canvasPosition = {
    x: window.canvas.offsetLeft,
    y: window.canvas.offsetTop
}


// let offsetCellPosition =  


function pickCellWithMouse(e) {

    // console.log(e);
    const mouseX = e.x; 
    const mouseY = e.y; 
    const canvasX = canvasPosition.x;
    const canvasY = canvasPosition.y;
    let cellX = mouseX - canvasX;
    let cellY = mouseY - canvasY;

    // console.log('mouse', mouseX, mouseY);
    // console.log('canvas', canvasX, canvasY);
    // console.log('cell', cellX, cellY);

    minefield.forEach(row => row.forEach(cell => {
        if(cellX >= cell.coords[0] && cellX <= cell.coords[0] + gridSize && cellY >=cell.coords[1] && cellY <= cell.coords[1] + gridSize) {
            revealIfEmpty(cell);
            checkForPressed();
        }
    }))

}

function revealIfEmpty(cell) {
    if(!(cell.state === 'empty')) {
        return;
    } if (cell.state === 'empty' && cell.minesAmount === 0) {
        scanAroundAndUnpressWhenNoMine(cell);
    }
}

function revealAround(cell) {

    let row = cell.row ;
    let column = cell.column ;
    let prop = 'minesAmount';
    let propVal = 0;
    cell.pressed = true;
    
        if(row === 1 && column === 1) {
            for(let i = row; i <= row + 1; i++){
                for(let j = column; j <= column + 1; j++){
                        minefield[i-1][j-1]['pressed'] = true;
                }
            }
        } else if(row === 1 && column === 30) {
            for(let i = row; i <= row + 1; i++){
                for(let j = column - 1; j <= column; j++){
                        minefield[i-1][j-1]['pressed'] = true;
                }
            }
        } else if(row === 16 && column === 1) {
            for(let i = row - 1; i <= row; i++){
                for(let j = column; j <= column + 1; j++){
                        minefield[i-1][j-1]['pressed'] = true;
                }
            }
        } else if(row === 16 && column === 30) {
            for(let i = row - 1; i <= row; i++){
                for(let j = column - 1; j <= column; j++){
                        minefield[i-1][j-1]['pressed'] = true;
                }
            }
        }   else if(row === 1 && column < 30) {
            for(let i = row; i <= row + 1; i++){
                for(let j = column - 1; j <= column + 1; j++){
                        minefield[i-1][j-1]['pressed'] = true;
                }
            }
        } 
        else if (row === 16) {
            for(let i = row - 1; i <= row; i++){
                for(let j = column - 1; j <= column + 1; j++){
                        minefield[i-1][j-1]['pressed'] = true;
                }
            }
        } else if (column === 1) {
            for(let i = row - 1; i <= row + 1; i++){
                for(let j = column; j <= column + 1; j++){
                        minefield[i-1][j-1]['pressed'] = true;
                }
            
        }} else if (column === 30) {
            for(let i = row - 1; i <= row + 1; i++){
                for(let j = column - 1; j <= column; j++){
                        minefield[i-1][j-1]['pressed'] = true;
                }
            }
        } else if (row > 1 && row < 16 && column > 1 && column < 30){
            console.log('hey');
            for(let i = (row - 1); i <= row + 1; i++){
                for(let j = (column - 1); j <= column + 1; j++){
                    // minefield[i-1][j-1]['pressed'] = true;
                        console.log(`minefield: ${minefield[i-1][j-1].row}, ${minefield[i-1][j-1].column}, cell: ${cell.row}, ${cell.column}`);
                        minefield[i-1][j-1]['pressed'] = true;
                }
            }
        }
            
            
        
}

canvas.addEventListener('click', (e) => pickCellWithMouse(e));

console.log(canvasPosition.x, canvasPosition.y);

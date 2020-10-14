const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
import { numberOfColumns, numberOfRows, gridSize } from './config';

export function createRect(cell, text) {
    const lineColor = '#948ED9';
    const color = '#C1BEEF';

    const x = cell.coords[0] + 1;
    const y = cell.coords[1] + 1;
    const width = gridSize;
    const height = gridSize;
    
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    ctx.closePath();

    if (!cell.pressed) {
        ctx.fillStyle = '#CDC9F6';
        ctx.fillRect(x, y, width, height);

        ctx.beginPath();
        ctx.fillStyle = '#524C9B';
        ctx.fillRect(x + width - 3, y, 3, height);

        ctx.fillRect(x, y + height - 3, width, 3);
        ctx.fillRect(x + width - 5, y + height - 5, 4, 4);

        ctx.closePath();
        ctx.beginPath();
        ctx.fillStyle = '#ffeaea';
        ctx.fillRect(x, y, 3, height);

        ctx.fillRect(x, y, width, 3);
        ctx.closePath();
        ctx.beginPath();
        ctx.fillStyle = '#524C9B';
        ctx.fillRect(x + width - 2, y + 2, 1, 1);

        ctx.fillRect(x + 2, y + height - 2, 1, 1);
        ctx.fillRect(x + 2, y + height - 2, 1, 1);
        ctx.closePath();
    }

    //FLAGGED CELL STYLE
    if (cell.flagged) {
        ctx.fillStyle = '#524C9B';
        ctx.fillRect(x + 12, y + 4, 2, 14);
        ctx.fillRect(x + 7, y + 17, 10, 2);
        ctx.fillStyle = 'red';
        ctx.fillRect(x + 8, y + 6, 4, 6);
        ctx.fillRect(x + 5, y + 8, 2, 6);
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

    if (cell.state === 'mine' && cell.pressed) {
        // MINE CELL STYLE

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
    ctx.fillRect(x, y + height - 3, 3, 3);

    ctx.fillRect(x + 1, y + height - 5, 1, 1);
    ctx.fillRect(x + 1, y + height - 4, 1, 1);

    ctx.fillRect(x + 3, y + height - 2, 1, 1);
    ctx.fillRect(x + 4, y + height - 2, 1, 1);

    // TOP RIGHT

    ctx.fillRect(x + width - 2, y + 1, 1, 1);

    ctx.fillRect(x + width - 5, y + 1, 1, 1);
    ctx.fillRect(x + width - 4, y + 1, 1, 1);

    ctx.fillRect(x + width - 2, y + 3, 1, 1);
    ctx.fillRect(x + 4, y + height - 2, 1, 1);

    ctx.fillRect(x, y + height - 3, 3, 3);

    ctx.fillRect(x + 1, y + height - 5, 1, 1);
    ctx.fillRect(x + 1, y + height - 4, 1, 1);

    ctx.fillRect(x + 3, y + height - 2, 1, 1);
    ctx.fillRect(x + 4, y + height - 2, 1, 1);

    ctx.fillRect(x, y + height - 3, 3, 3);

    ctx.fillRect(x + 1, y + height - 5, 1, 1);
    ctx.fillRect(x + 1, y + height - 4, 1, 1);

    ctx.fillRect(x + 3, y + height - 2, 1, 1);
    ctx.fillRect(x + 4, y + height - 2, 1, 1);

    ctx.closePath();
}

export function drawActive(cell) {
    const text = cell.minesAmount ? String(cell.minesAmount) : '';
    createRect(cell, text);
}

export function setCanvasDimensions() {
    const canvasComputedWidth = numberOfColumns * gridSize;
    const canvasComputedHeight = numberOfRows * gridSize;
    canvas.width = canvasComputedWidth + 2;
    canvas.height = canvasComputedHeight + 2;
}

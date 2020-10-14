export default class Cell {
    constructor(coords, state, row, column, pressed, flagged) {
        this.coords = coords;
        this.state = state;
        this.row = row;
        this.column = column;
        this.pressed = pressed;
        this.flagged = flagged;
    }
}
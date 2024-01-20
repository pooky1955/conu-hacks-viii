import { roomStore } from "./index.js";
const ROOM_CODE_LENGTH = 5;
const ROOM_CODE_CHARACTERS = ["ABCDEFGHIJKLMNOPQRSTUVWXYZ", "0123456789"];

export function addToCol(board, col, team) {
    if (countColEmptySlots(board, col) != 0) {
        let arr = getCol(board, col)
        for (let i = arr.length - 1; i >= 0; i--) {
            if (arr[i].team == -1) {
                arr[i].team = team
                break
            }
        }
        board = setCol(board, col, arr)
    }
    return board
}

export function getCol(board, col) {
    return board.map(row => row[col])
}

export function setCol(board, col, arr) {
    for (let i = 0; i < board.length; i++) {
        board[i][col] = arr[i]
    }
    return board
}

export function countColEmptySlots(board, col) {
    return getCol(board, col).filter(tile => tile.team === -1).length
}

export function isBoardFull(board) {
    return board.every(row => row.every(tile => tile.team != -1))
}

export function isWinningMove(board, col, team) {
    let row = countColEmptySlots(board, col)
    let horizontalWin = isConsecutivePattern(board[row], team)
    let verticalWin = isConsecutivePattern(getCol(board, col), team)
    let diagonalWin = isDiagonalWin(board, col, row, team)
    return horizontalWin || verticalWin || diagonalWin
}

function isConsecutivePattern(arr, team) {
    let consecutive = 0
    for (let i = 0; i < arr.length; i++) {
        consecutive = (arr[i].team == team ? consecutive + 1 : 0)
        if (consecutive == 4) {
            return true
        }
    }
    return false
}

function isDiagonalWin(board, col, row, team) {
    let colDiff = board[0].length-col
    let rowDiff = board.length-row
    let firstDiagonal = []
    let firstDiagonalLength = Math.min(col-1, row-1) + Math.min(colDiff, rowDiff) + 1
    let firstDiagonalOffset = Math.min(col, row)
    let firstDiagonalOrigin = [col-firstDiagonalOffset, row-firstDiagonalOffset]
    for (let i = 0; i < firstDiagonalLength; i++) {
        firstDiagonal.push(board[firstDiagonalOrigin[1]+i][firstDiagonalOrigin[0]+i])
    }
    let secondDiagonal = []
    let secondDiagonalLength = Math.min(colDiff-1, row) + Math.min(rowDiff-1, col) + 1
    let secondDiagonalOffset = Math.min(colDiff, row+1)
    let secondDiagonalOrigin = [col+secondDiagonalOffset-1, row-secondDiagonalOffset+1]
    for (let i = 0; i < secondDiagonalLength; i++) {
        secondDiagonal.push(board[secondDiagonalOrigin[1]+i][secondDiagonalOrigin[0]-i])
    }
    return isConsecutivePattern(firstDiagonal, team) || isConsecutivePattern(secondDiagonal, team)
}

export function generateRoomCode() {
    let code = '';
    while (!code || roomStore.findRoom(code)) {
        for (var i = ROOM_CODE_LENGTH; i > 0; --i) {
            let charSelection = ROOM_CODE_CHARACTERS[Math.floor(Math.random() * ROOM_CODE_CHARACTERS.length)];
            code += charSelection[Math.floor(Math.random() * charSelection.length)];
        }
    }
    return code;
}

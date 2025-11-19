export type Difficulty = "Easy" | "Medium" | "Hard";

export const BLANK = 0;

export function generateSudoku(difficulty: Difficulty): {
    initialBoard: number[][];
    solvedBoard: number[][];
} {
    // 1. Generate a full valid board
    const solvedBoard = createSolvedBoard();

    // 2. Remove numbers based on difficulty
    const attempts = difficulty === "Easy" ? 30 : difficulty === "Medium" ? 45 : 55;
    const initialBoard = removeNumbers(solvedBoard, attempts);

    return { initialBoard, solvedBoard };
}

function createSolvedBoard(): number[][] {
    const board = Array.from({ length: 9 }, () => Array(9).fill(BLANK));
    fillBoard(board);
    return board;
}

function fillBoard(board: number[][]): boolean {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === BLANK) {
                const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                for (const num of nums) {
                    if (isValidMove(board, row, col, num)) {
                        board[row][col] = num;
                        if (fillBoard(board)) return true;
                        board[row][col] = BLANK;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

export function isValidMove(
    board: number[][],
    row: number,
    col: number,
    num: number
): boolean {
    // Check row
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num && i !== col) return false;
    }

    // Check col
    for (let i = 0; i < 9; i++) {
        if (board[i][col] === num && i !== row) return false;
    }

    // Check 3x3 box
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] === num && (startRow + i !== row || startCol + j !== col)) {
                return false;
            }
        }
    }

    return true;
}

function removeNumbers(solvedBoard: number[][], attempts: number): number[][] {
    const board = solvedBoard.map((row) => [...row]);
    let count = attempts;

    while (count > 0) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);

        if (board[row][col] !== BLANK) {
            board[row][col] = BLANK;
            count--;
        }
    }
    return board;
}

function shuffle(array: number[]): number[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { generateSudoku, Difficulty, BLANK } from "@/lib/sudoku";
import { Header } from "./Header";
import { Board } from "./Board";
import { Controls } from "./Controls";

export default function Game() {
    const [difficulty, setDifficulty] = useState<Difficulty>("Easy");
    const [board, setBoard] = useState<number[][]>([]);
    const [initialBoard, setInitialBoard] = useState<number[][]>([]);
    const [solvedBoard, setSolvedBoard] = useState<number[][]>([]);
    const [notes, setNotes] = useState<Set<number>[][]>([]);
    const [mistakes, setMistakes] = useState(0);
    const [time, setTime] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isWon, setIsWon] = useState(false);
    const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
    const [isNoteMode, setIsNoteMode] = useState(false);
    const [history, setHistory] = useState<{ board: number[][]; notes: Set<number>[][]; mistakes: number }[]>([]);
    const [mistakeCells, setMistakeCells] = useState<boolean[][]>([]);

    // Initialize game
    const startNewGame = useCallback((diff: Difficulty) => {
        const { initialBoard, solvedBoard } = generateSudoku(diff);
        setBoard(initialBoard.map(row => [...row]));
        setInitialBoard(initialBoard.map(row => [...row]));
        setSolvedBoard(solvedBoard);
        setNotes(Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => new Set<number>())));
        setMistakeCells(Array.from({ length: 9 }, () => Array(9).fill(false)));
        setMistakes(0);
        setTime(0);
        setIsGameOver(false);
        setIsWon(false);
        setHistory([]);
        setSelectedCell(null);
    }, []);

    // Initial load
    useEffect(() => {
        startNewGame("Easy");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDifficultyChange = (diff: Difficulty) => {
        setDifficulty(diff);
        startNewGame(diff);
    };

    useEffect(() => {
        if (isGameOver || isWon) return;
        const timer = setInterval(() => setTime((t) => t + 1), 1000);
        return () => clearInterval(timer);
    }, [isGameOver, isWon]);

    const handleCellClick = useCallback((row: number, col: number) => {
        if (isGameOver || isWon) return;
        setSelectedCell([row, col]);
    }, [isGameOver, isWon]);

    const handleNumberClick = useCallback((num: number) => {
        if (isGameOver || isWon || !selectedCell) return;
        const [row, col] = selectedCell;

        // Cannot edit initial cells
        if (initialBoard[row][col] !== BLANK) return;

        // Save history before any change
        setHistory(prev => [...prev, {
            board: board.map(r => [...r]),
            notes: notes.map(r => r.map(s => new Set(s))),
            mistakes
        }]);

        if (isNoteMode) {
            const newNotes = notes.map(r => r.map(s => new Set(s)));
            const cellNotes = newNotes[row][col];
            if (cellNotes.has(num)) {
                cellNotes.delete(num);
            } else {
                cellNotes.add(num);
            }
            setNotes(newNotes);
        } else {
            const newBoard = board.map(r => [...r]);
            newBoard[row][col] = num;

            // Check if move is correct against solved board
            if (num !== solvedBoard[row][col]) {
                setMistakes(m => {
                    const newMistakes = m + 1;
                    if (newMistakes >= 3) setIsGameOver(true);
                    return newMistakes;
                });
                const newMistakeCells = mistakeCells.map(r => [...r]);
                newMistakeCells[row][col] = true;
                setMistakeCells(newMistakeCells);

                // Clear mistake highlight after 1s
                setTimeout(() => {
                    setMistakeCells(prev => {
                        const cleared = prev.map(r => [...r]);
                        cleared[row][col] = false;
                        return cleared;
                    });
                }, 1000);
            } else {
                // Correct move
                setBoard(newBoard);

                // Clear notes in related row/col/box
                const newNotes = notes.map(r => r.map(s => new Set(s)));
                // Clear row/col
                for (let i = 0; i < 9; i++) {
                    newNotes[row][i].delete(num);
                    newNotes[i][col].delete(num);
                }
                // Clear box
                const startRow = Math.floor(row / 3) * 3;
                const startCol = Math.floor(col / 3) * 3;
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        newNotes[startRow + i][startCol + j].delete(num);
                    }
                }
                setNotes(newNotes);

                // Check win
                let filled = true;
                for (let i = 0; i < 9; i++) {
                    for (let j = 0; j < 9; j++) {
                        if (newBoard[i][j] === BLANK) {
                            filled = false;
                            break;
                        }
                    }
                }
                if (filled) setIsWon(true);
            }
        }
    }, [isGameOver, isWon, selectedCell, initialBoard, board, notes, mistakes, isNoteMode, solvedBoard, mistakeCells]);

    const handleUndo = useCallback(() => {
        if (history.length === 0 || isGameOver || isWon) return;
        const previousState = history[history.length - 1];
        setBoard(previousState.board);
        setNotes(previousState.notes);
        setMistakes(previousState.mistakes);
        setHistory(prev => prev.slice(0, -1));
        setMistakeCells(Array.from({ length: 9 }, () => Array(9).fill(false)));
    }, [history, isGameOver, isWon]);

    const handleErase = useCallback(() => {
        if (isGameOver || isWon || !selectedCell) return;
        const [row, col] = selectedCell;
        if (initialBoard[row][col] !== BLANK) return;

        setBoard(prev => {
            const newBoard = prev.map(r => [...r]);
            newBoard[row][col] = BLANK;
            return newBoard;
        });
    }, [isGameOver, isWon, selectedCell, initialBoard]);

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isGameOver || isWon) return;

            if (e.key >= "1" && e.key <= "9") {
                handleNumberClick(parseInt(e.key));
            } else if (e.key === "Backspace" || e.key === "Delete") {
                handleErase();
            } else if (e.key === "ArrowUp" && selectedCell) {
                setSelectedCell([Math.max(0, selectedCell[0] - 1), selectedCell[1]]);
            } else if (e.key === "ArrowDown" && selectedCell) {
                setSelectedCell([Math.min(8, selectedCell[0] + 1), selectedCell[1]]);
            } else if (e.key === "ArrowLeft" && selectedCell) {
                setSelectedCell([selectedCell[0], Math.max(0, selectedCell[1] - 1)]);
            } else if (e.key === "ArrowRight" && selectedCell) {
                setSelectedCell([selectedCell[0], Math.min(8, selectedCell[1] + 1)]);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isGameOver, isWon, selectedCell, handleNumberClick, handleErase]);

    if (board.length === 0) return null;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
            <Header
                difficulty={difficulty}
                mistakes={mistakes}
                time={time}
                onChangeDifficulty={handleDifficultyChange}
            />

            <Board
                board={board}
                initialBoard={initialBoard}
                notes={notes}
                selectedCell={selectedCell}
                onCellClick={handleCellClick}
                mistakeCells={mistakeCells}
            />

            <Controls
                onNumberClick={handleNumberClick}
                onUndo={handleUndo}
                onErase={handleErase}
                onNoteToggle={() => setIsNoteMode(!isNoteMode)}
                isNoteMode={isNoteMode}
            />

            {/* Game Over Modal */}
            {isGameOver && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl text-center max-w-sm mx-4">
                        <h2 className="text-3xl font-bold text-red-600 mb-4">Game Over</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">You made 3 mistakes. Better luck next time!</p>
                        <button
                            onClick={() => startNewGame(difficulty)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {isWon && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl text-center max-w-sm mx-4">
                        <h2 className="text-3xl font-bold text-green-600 mb-4">Solved!</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-2">Difficulty: {difficulty}</p>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">Time: {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")}</p>
                        <button
                            onClick={() => startNewGame(difficulty)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
                        >
                            New Game
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

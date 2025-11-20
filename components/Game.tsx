"use client";

import { useState, useEffect, useCallback } from "react";
import { generateSudoku, Difficulty, BLANK, isValidMove } from "@/lib/sudoku";
import { Header } from "./Header";
import { Board } from "./Board";
import { Controls } from "./Controls";
import { FloatingText, FloatingTextItem } from "./FloatingText";
import { ParticleBurst, ParticleItem } from "./ParticleBurst";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

export default function Game() {
    const [difficulty, setDifficulty] = useState<Difficulty>("Easy");
    const [board, setBoard] = useState<number[][]>([]);
    const [initialBoard, setInitialBoard] = useState<number[][]>([]);
    const [solvedBoard, setSolvedBoard] = useState<number[][]>([]);
    const [notes, setNotes] = useState<Set<number>[][]>([]);
    const [isWon, setIsWon] = useState(false);
    const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
    const [isNoteMode, setIsNoteMode] = useState(false);
    const [history, setHistory] = useState<{ board: number[][]; notes: Set<number>[][]; combo: number }[]>([]);
    const [mistakeCells, setMistakeCells] = useState<boolean[][]>([]);
    const [floatingTexts, setFloatingTexts] = useState<FloatingTextItem[]>([]);
    const [particles, setParticles] = useState<ParticleItem[]>([]);
    const [combo, setCombo] = useState(0);

    // Initialize game
    const startNewGame = useCallback((diff: Difficulty) => {
        const { initialBoard, solvedBoard } = generateSudoku(diff);
        setBoard(initialBoard.map(row => [...row]));
        setInitialBoard(initialBoard.map(row => [...row]));
        setSolvedBoard(solvedBoard);
        setNotes(Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => new Set<number>())));
        setMistakeCells(Array.from({ length: 9 }, () => Array(9).fill(false)));
        setIsWon(false);
        setHistory([]);
        setSelectedCell(null);
        setFloatingTexts([]);
        setParticles([]);
        setCombo(0);
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
        if (isWon) {
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const random = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: NodeJS.Timeout = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti({ ...defaults, particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);
        }
    }, [isWon]);

    const triggerFloatingText = (text: string, color: string, x: number, y: number) => {
        const id = Date.now();
        setFloatingTexts(prev => [...prev, { id, text, x, y, color }]);
        setTimeout(() => {
            setFloatingTexts(prev => prev.filter(item => item.id !== id));
        }, 1000);
    };

    const triggerParticles = (x: number, y: number, color: string) => {
        const id = Date.now();
        setParticles(prev => [...prev, { id, x, y, color }]);
        setTimeout(() => {
            setParticles(prev => prev.filter(item => item.id !== id));
        }, 1000);
    };

    const handleCellClick = useCallback((row: number, col: number) => {
        if (isWon) return;
        setSelectedCell([row, col]);
    }, [isWon]);

    const handleNumberClick = useCallback((num: number) => {
        if (isWon || !selectedCell) return;
        const [row, col] = selectedCell;

        // Cannot edit initial cells
        if (initialBoard[row][col] !== BLANK) return;

        // Save history before any change
        setHistory(prev => [...prev, {
            board: board.map(r => [...r]),
            notes: notes.map(r => r.map(s => new Set(s))),
            combo
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
                setCombo(0); // Reset combo on mistake
                const newMistakeCells = mistakeCells.map(r => [...r]);
                newMistakeCells[row][col] = true;
                setMistakeCells(newMistakeCells);

                // Get cell position for floating text
                const cellElement = document.querySelector(`[data-cell="${row}-${col}"]`);
                if (cellElement) {
                    const rect = cellElement.getBoundingClientRect();
                    triggerFloatingText("Oops!", "#ef4444", rect.left + rect.width / 2, rect.top);
                }

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
                setCombo(c => c + 1);

                // Get cell position for floating text and particles
                const cellElement = document.querySelector(`[data-cell="${row}-${col}"]`);
                if (cellElement) {
                    const rect = cellElement.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;

                    const phrases = ["Magical!", "Brilliant!", "Spectacular!", "Wicked!", "+10 XP"];
                    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

                    // Show combo text if combo > 0 (it will be 1 after this update, so check current combo + 1)
                    // Actually state update is async, so we use the value we know it will be
                    const newCombo = combo + 1;
                    const textToShow = newCombo > 1 ? `${newCombo}x Combo!` : randomPhrase;
                    const color = newCombo > 1 ? "#f59e0b" : "#9333ea"; // Orange for combo, Purple for normal

                    triggerFloatingText(textToShow, color, centerX, rect.top);
                    triggerParticles(centerX, centerY, color);
                }

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
    }, [isWon, selectedCell, initialBoard, board, notes, isNoteMode, solvedBoard, mistakeCells, combo]);

    const handleUndo = useCallback(() => {
        if (history.length === 0 || isWon) return;
        const previousState = history[history.length - 1];
        setBoard(previousState.board);
        setNotes(previousState.notes);
        setCombo(previousState.combo);
        setHistory(prev => prev.slice(0, -1));
        setMistakeCells(Array.from({ length: 9 }, () => Array(9).fill(false)));
    }, [history, isWon]);

    const handleErase = useCallback(() => {
        if (isWon || !selectedCell) return;
        const [row, col] = selectedCell;
        if (initialBoard[row][col] !== BLANK) return;

        setBoard(prev => {
            const newBoard = prev.map(r => [...r]);
            newBoard[row][col] = BLANK;
            return newBoard;
        });
    }, [isWon, selectedCell, initialBoard]);

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isWon) return;

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
    }, [isWon, selectedCell, handleNumberClick, handleErase]);

    // Calculate valid candidates for the selected cell (Box only)
    const validCandidates = selectedCell && initialBoard[selectedCell[0]][selectedCell[1]] === BLANK
        ? (() => {
            const [row, col] = selectedCell;
            const startRow = Math.floor(row / 3) * 3;
            const startCol = Math.floor(col / 3) * 3;
            const existingNumbers = new Set<number>();

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    const num = board[startRow + i][startCol + j];
                    if (num !== BLANK) existingNumbers.add(num);
                }
            }

            return [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => !existingNumbers.has(n));
        })()
        : undefined;

    if (board.length === 0) return null;

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 dark:bg-gray-950 py-4 overflow-hidden">
            <FloatingText items={floatingTexts} />
            <ParticleBurst items={particles} />
            <Header
                difficulty={difficulty}
                onChangeDifficulty={handleDifficultyChange}
                combo={combo}
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
                validCandidates={validCandidates}
            />

            <AnimatePresence>
                {/* Success Modal */}
                {isWon && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.5, opacity: 0, y: 50 }}
                            transition={{ type: "spring", damping: 20, stiffness: 300 }}
                            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl text-center max-w-sm mx-4 border-2 border-purple-200 dark:border-purple-900"
                        >
                            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4 font-serif">
                                Mischief Managed!
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-2 font-medium">
                                {difficulty === "Easy" ? "Not bad for a Muggle!" : difficulty === "Medium" ? "A true Demigod!" : "Merlin's Beard, you did it!"}
                            </p>
                            <motion.button
                                onClick={() => startNewGame(difficulty)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium hover:shadow-lg transition-all"
                            >
                                New Adventure
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

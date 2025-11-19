import { cn } from "@/lib/utils";
import { BLANK } from "@/lib/sudoku";

interface BoardProps {
    board: number[][];
    initialBoard: number[][];
    notes: Set<number>[][];
    selectedCell: [number, number] | null;
    onCellClick: (row: number, col: number) => void;
    mistakeCells: boolean[][];
}

export function Board({
    board,
    initialBoard,
    notes,
    selectedCell,
    onCellClick,
    mistakeCells,
}: BoardProps) {
    return (
        <div className="w-full max-w-md aspect-square bg-gray-800 border-2 border-gray-800 dark:border-gray-600">
            <div className="grid grid-cols-9 grid-rows-9 h-full w-full bg-gray-300 gap-px border-2 border-gray-800 dark:bg-gray-600 dark:border-gray-600">
                {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                        const isInitial = initialBoard[rowIndex][colIndex] !== BLANK;
                        const isSelected =
                            selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex;
                        const isRelated =
                            selectedCell &&
                            (selectedCell[0] === rowIndex ||
                                selectedCell[1] === colIndex ||
                                (Math.floor(selectedCell[0] / 3) === Math.floor(rowIndex / 3) &&
                                    Math.floor(selectedCell[1] / 3) === Math.floor(colIndex / 3)));

                        const isSameNumber =
                            selectedCell &&
                            cell !== BLANK &&
                            board[selectedCell[0]][selectedCell[1]] === cell;

                        const isRightBorder = (colIndex + 1) % 3 === 0 && colIndex !== 8;
                        const isBottomBorder = (rowIndex + 1) % 3 === 0 && rowIndex !== 8;

                        return (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                onClick={() => onCellClick(rowIndex, colIndex)}
                                className={cn(
                                    "relative flex items-center justify-center text-2xl cursor-pointer select-none transition-colors",
                                    "bg-white dark:bg-gray-900",
                                    isRightBorder && "border-r-2 border-r-gray-800 dark:border-r-gray-500",
                                    isBottomBorder && "border-b-2 border-b-gray-800 dark:border-b-gray-500",
                                    isSelected && "!bg-blue-500 !text-white",
                                    !isSelected && isSameNumber && "!bg-blue-200 dark:!bg-blue-900",
                                    !isSelected && !isSameNumber && isRelated && "bg-blue-50 dark:bg-gray-800",
                                    mistakeCells[rowIndex][colIndex] && !isSelected && "bg-red-100 text-red-500 dark:bg-red-900/20",
                                    mistakeCells[rowIndex][colIndex] && isSelected && "bg-red-500",
                                    isInitial ? "font-bold text-black dark:text-white" : "font-medium text-blue-600 dark:text-blue-400",
                                    isSelected && isInitial && "text-white"
                                )}
                            >
                                {cell !== BLANK ? (
                                    cell
                                ) : (
                                    <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-0.5 pointer-events-none">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                                            <div
                                                key={n}
                                                className="flex items-center justify-center text-[8px] leading-none text-gray-500 dark:text-gray-400"
                                            >
                                                {notes[rowIndex][colIndex].has(n) ? n : ""}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

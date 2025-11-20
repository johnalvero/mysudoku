import { cn } from "@/lib/utils";
import { BLANK } from "@/lib/sudoku";
import { motion } from "framer-motion";

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
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-md aspect-square bg-purple-800 border-2 border-purple-800 dark:border-purple-600 rounded-xl overflow-hidden shadow-2xl"
        >
            <div className="grid grid-cols-9 grid-rows-9 h-full w-full bg-purple-300 gap-px border-2 border-purple-800 dark:bg-purple-600 dark:border-purple-600">
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
                            <motion.div
                                key={`${rowIndex}-${colIndex}`}
                                data-cell={`${rowIndex}-${colIndex}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: (rowIndex * 9 + colIndex) * 0.005 }}
                                onClick={() => onCellClick(rowIndex, colIndex)}
                                className={cn(
                                    "relative flex items-center justify-center text-2xl cursor-pointer select-none transition-colors duration-200",
                                    "bg-white dark:bg-gray-900",
                                    isRightBorder && "border-r-2 border-r-purple-800 dark:border-r-purple-500",
                                    isBottomBorder && "border-b-2 border-b-purple-800 dark:border-b-purple-500",
                                    isSelected && "!bg-purple-600 !text-white shadow-inner z-10",
                                    !isSelected && isSameNumber && "!bg-purple-200 dark:!bg-purple-900",
                                    !isSelected && !isSameNumber && isRelated && "bg-purple-50 dark:bg-gray-800",
                                    mistakeCells[rowIndex][colIndex] && !isSelected && "bg-red-100 text-red-500 dark:bg-red-900/20",
                                    mistakeCells[rowIndex][colIndex] && isSelected && "bg-red-500",
                                    isInitial ? "font-bold text-gray-900 dark:text-white" : "font-medium text-purple-600 dark:text-purple-400",
                                    isSelected && isInitial && "text-white"
                                )}
                                whileHover={{ scale: 0.95 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                {mistakeCells[rowIndex][colIndex] && (
                                    <motion.div
                                        className="absolute inset-0 bg-red-500/20"
                                        animate={{ x: [-2, 2, -2, 2, 0] }}
                                        transition={{ duration: 0.4 }}
                                    />
                                )}
                                {cell !== BLANK ? (
                                    <motion.span
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{
                                            scale: [1.5, 1],
                                            opacity: 1,
                                            color: isInitial ? undefined : ["#9333ea", "#7e22ce"] // Purple flash for new numbers
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 15,
                                            duration: 0.4
                                        }}
                                        key={`${cell}-${rowIndex}-${colIndex}`} // Re-animate on change
                                        className="relative z-10"
                                    >
                                        {cell}
                                        {!isInitial && (
                                            <motion.span
                                                initial={{ scale: 1, opacity: 0.5 }}
                                                animate={{ scale: 2, opacity: 0 }}
                                                transition={{ duration: 0.4 }}
                                                className="absolute inset-0 bg-purple-400 rounded-full -z-10"
                                            />
                                        )}
                                    </motion.span>
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
                            </motion.div>
                        );
                    })
                )}
            </div>
        </motion.div>
    );
}

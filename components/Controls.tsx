import { Eraser, Pencil, Undo } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ControlsProps {
    onNumberClick: (num: number) => void;
    onUndo: () => void;
    onErase: () => void;
    onNoteToggle: () => void;
    isNoteMode: boolean;
}

export function Controls({
    onNumberClick,
    onUndo,
    onErase,
    onNoteToggle,
    isNoteMode,
}: ControlsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-full max-w-md px-4 mt-6"
        >
            <div className="grid grid-cols-9 gap-1 mb-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <motion.button
                        key={num}
                        onClick={() => onNumberClick(num)}
                        whileHover={{ scale: 1.1, backgroundColor: "#E9D5FF" }}
                        whileTap={{ scale: 0.9 }}
                        className="aspect-square flex items-center justify-center text-xl font-medium text-purple-600 bg-purple-50 rounded-lg transition-colors dark:bg-gray-800 dark:text-purple-400 border border-purple-100 dark:border-purple-900"
                    >
                        {num}
                    </motion.button>
                ))}
            </div>

            <div className="flex justify-between gap-4">
                <motion.button
                    onClick={onUndo}
                    whileHover={{ scale: 1.05, backgroundColor: "#F3E8FF" }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex flex-col items-center gap-1 p-2 text-purple-700 bg-transparent rounded-lg transition-colors dark:text-purple-300"
                >
                    <Undo className="w-6 h-6" />
                    <span className="text-xs font-medium">Time Turner</span>
                </motion.button>

                <motion.button
                    onClick={onErase}
                    whileHover={{ scale: 1.05, backgroundColor: "#F3E8FF" }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex flex-col items-center gap-1 p-2 text-purple-700 bg-transparent rounded-lg transition-colors dark:text-purple-300"
                >
                    <Eraser className="w-6 h-6" />
                    <span className="text-xs font-medium">Evanesco</span>
                </motion.button>

                <motion.button
                    onClick={onNoteToggle}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                        "flex-1 flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                        isNoteMode
                            ? "text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-md"
                            : "text-purple-700 hover:bg-purple-50 dark:text-purple-300 dark:hover:bg-gray-800"
                    )}
                >
                    <Pencil className="w-6 h-6" />
                    <span className="text-xs font-medium">Runes</span>
                    <span className="text-[10px] font-bold uppercase">{isNoteMode ? "Active" : "Off"}</span>
                </motion.button>
            </div>
        </motion.div>
    );
}

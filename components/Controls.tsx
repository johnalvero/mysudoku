import { Eraser, Pencil, Undo } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ControlsProps {
    onNumberClick: (num: number) => void;
    validCandidates?: number[];
}

export function Controls({
    onNumberClick,
    validCandidates,
}: ControlsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-full max-w-md px-4 mt-6"
        >
            <div className="grid grid-cols-9 gap-1 mb-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
                    const isValid = validCandidates ? validCandidates.includes(num) : true;
                    return (
                        <motion.button
                            key={num}
                            onClick={() => isValid && onNumberClick(num)}
                            disabled={!isValid}
                            whileHover={isValid ? { scale: 1.1, backgroundColor: "#E9D5FF" } : {}}
                            whileTap={isValid ? { scale: 0.9 } : {}}
                            className={cn(
                                "aspect-square flex items-center justify-center text-3xl font-bold rounded-xl transition-all border",
                                isValid
                                    ? "text-purple-600 bg-purple-50 dark:bg-gray-800 dark:text-purple-400 border-purple-100 dark:border-purple-900 shadow-sm cursor-pointer"
                                    : "text-gray-300 bg-gray-50 dark:bg-gray-900/50 dark:text-gray-700 border-transparent opacity-30 cursor-not-allowed"
                            )}
                        >
                            {num}
                        </motion.button>
                    );
                })}
            </div>
        </motion.div>
    );
}

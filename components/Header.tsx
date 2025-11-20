import { Difficulty } from "@/lib/sudoku";
import { Sparkles, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
    difficulty: Difficulty;
    onChangeDifficulty: (diff: Difficulty) => void;
    combo: number;
}

export function Header({ difficulty, onChangeDifficulty, combo }: HeaderProps) {
    const difficultyLabels: Record<Difficulty, string> = {
        Easy: "Muggle",
        Medium: "Demigod",
        Hard: "Wizard",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md px-4 mb-2"
        >
            <div className="flex flex-col items-center mb-2">
                <motion.h1
                    className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 mb-2 text-center"
                    animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                >
                    John & Ava&apos;s Sudoku
                </motion.h1>
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-300">
                    <motion.div
                        animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                        <Sparkles className="w-4 h-4" />
                    </motion.div>
                    <span className="text-sm font-medium italic">&quot;I solemnly swear that I am up to no good&quot;</span>
                    <motion.div
                        animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.2, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, delay: 0.5 }}
                    >
                        <Sparkles className="w-4 h-4" />
                    </motion.div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {combo > 1 && (
                    <motion.div
                        key="combo"
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        className="flex justify-center items-center gap-1 text-orange-500 font-bold"
                    >
                        <div className="flex items-center gap-1 bg-white/80 dark:bg-gray-800/80 px-3 py-1 rounded-full shadow-sm backdrop-blur-sm">
                            <Flame className="w-4 h-4 fill-orange-500" />
                            <span>{combo}x Combo!</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex justify-center">
                <div className="flex gap-2 bg-purple-100 dark:bg-purple-900/30 p-1 rounded-full">
                    {(["Easy", "Medium", "Hard"] as Difficulty[]).map((diff) => (
                        <motion.button
                            key={diff}
                            onClick={() => onChangeDifficulty(diff)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${difficulty === diff
                                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                                : "text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800"
                                }`}
                        >
                            {difficultyLabels[diff]}
                        </motion.button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

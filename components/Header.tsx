import { Difficulty } from "@/lib/sudoku";
import { Timer } from "lucide-react";

interface HeaderProps {
    difficulty: Difficulty;
    mistakes: number;
    time: number;
    onChangeDifficulty: (diff: Difficulty) => void;
}

export function Header({ difficulty, mistakes, time, onChangeDifficulty }: HeaderProps) {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="w-full max-w-md px-4 mb-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Sudoku</h1>
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-1">
                        <span className="font-medium">Mistakes:</span>
                        <span className={mistakes >= 3 ? "text-red-500" : ""}>{mistakes}/3</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Timer className="w-4 h-4" />
                        <span>{formatTime(time)}</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    {(["Easy", "Medium", "Hard"] as Difficulty[]).map((diff) => (
                        <button
                            key={diff}
                            onClick={() => onChangeDifficulty(diff)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${difficulty === diff
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
                                }`}
                        >
                            {diff}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

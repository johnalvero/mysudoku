import { Eraser, Pencil, Undo } from "lucide-react";
import { cn } from "@/lib/utils";

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
        <div className="w-full max-w-md px-4 mt-6">
            <div className="grid grid-cols-9 gap-1 mb-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                        key={num}
                        onClick={() => onNumberClick(num)}
                        className="aspect-square flex items-center justify-center text-xl font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
                    >
                        {num}
                    </button>
                ))}
            </div>

            <div className="flex justify-between gap-4">
                <button
                    onClick={onUndo}
                    className="flex-1 flex flex-col items-center gap-1 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-400 dark:hover:bg-gray-800"
                >
                    <Undo className="w-6 h-6" />
                    <span className="text-xs font-medium">Undo</span>
                </button>

                <button
                    onClick={onErase}
                    className="flex-1 flex flex-col items-center gap-1 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-400 dark:hover:bg-gray-800"
                >
                    <Eraser className="w-6 h-6" />
                    <span className="text-xs font-medium">Erase</span>
                </button>

                <button
                    onClick={onNoteToggle}
                    className={cn(
                        "flex-1 flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                        isNoteMode
                            ? "text-white bg-blue-600 hover:bg-blue-700"
                            : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                    )}
                >
                    <Pencil className="w-6 h-6" />
                    <span className="text-xs font-medium">Notes</span>
                    <span className="text-[10px] font-bold uppercase">{isNoteMode ? "On" : "Off"}</span>
                </button>
            </div>
        </div>
    );
}

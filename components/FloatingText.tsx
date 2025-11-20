import { motion, AnimatePresence } from "framer-motion";

export interface FloatingTextItem {
    id: number;
    text: string;
    x: number;
    y: number;
    color: string;
}

interface FloatingTextProps {
    items: FloatingTextItem[];
}

export function FloatingText({ items }: FloatingTextProps) {
    return (
        <AnimatePresence>
            {items.map((item) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 0, scale: 0.5 }}
                    animate={{ opacity: 1, y: -50, scale: 1.2 }}
                    exit={{ opacity: 0, y: -80, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="fixed pointer-events-none z-50 font-bold text-xl drop-shadow-md"
                    style={{
                        left: item.x,
                        top: item.y,
                        color: item.color,
                        textShadow: "0px 2px 4px rgba(0,0,0,0.2)"
                    }}
                >
                    {item.text}
                </motion.div>
            ))}
        </AnimatePresence>
    );
}

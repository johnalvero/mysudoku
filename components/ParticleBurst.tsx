import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

export interface ParticleItem {
    id: number;
    x: number;
    y: number;
    color: string;
}

interface ParticleBurstProps {
    items: ParticleItem[];
}

export function ParticleBurst({ items }: ParticleBurstProps) {
    return (
        <AnimatePresence>
            {items.map((item) => (
                <div key={item.id} className="fixed pointer-events-none z-40" style={{ left: item.x, top: item.y }}>
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                            animate={{
                                scale: [0, 1, 0],
                                x: (Math.random() - 0.5) * 100,
                                y: (Math.random() - 0.5) * 100,
                                opacity: 0,
                            }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="absolute"
                        >
                            <Sparkles
                                className="w-4 h-4"
                                style={{ color: item.color, fill: item.color }}
                            />
                        </motion.div>
                    ))}
                </div>
            ))}
        </AnimatePresence>
    );
}

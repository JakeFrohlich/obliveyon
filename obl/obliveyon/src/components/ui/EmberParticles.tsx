"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

export default function EmberParticles({ count = 25 }: { count?: number }) {
  const embers = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 8 + 6,
        delay: Math.random() * 10,
        drift: (Math.random() - 0.5) * 60,
        opacity: Math.random() * 0.6 + 0.2,
      })),
    [count]
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {embers.map((ember) => (
        <motion.div
          key={ember.id}
          className="absolute rounded-full"
          style={{
            left: `${ember.left}%`,
            bottom: "-5%",
            width: ember.size,
            height: ember.size,
            background: `radial-gradient(circle, rgba(255,200,100,${ember.opacity}) 0%, rgba(255,120,50,${ember.opacity * 0.5}) 60%, transparent 100%)`,
            boxShadow: `0 0 ${ember.size * 2}px rgba(255,150,50,${ember.opacity * 0.4})`,
            ["--drift" as string]: `${ember.drift}px`,
          }}
          animate={{
            y: [0, -1200],
            x: [0, ember.drift],
            opacity: [0, ember.opacity, ember.opacity * 0.8, 0],
            scale: [1, 0.8, 0.3],
          }}
          transition={{
            duration: ember.duration,
            delay: ember.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

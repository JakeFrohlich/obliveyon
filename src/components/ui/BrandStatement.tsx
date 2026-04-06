"use client";

import { motion } from "framer-motion";

export default function BrandStatement() {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="max-w-3xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-2xl sm:text-3xl md:text-4xl font-light leading-relaxed tracking-tight"
        >
          We don&apos;t follow trends.
          <span className="text-text-muted"> We exist beyond them.</span>
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 text-sm text-text-secondary leading-relaxed max-w-lg mx-auto"
        >
          Obliveyon is built for those who reject the ordinary. Every piece is crafted
          with intention — blending dark aesthetics with premium materials and a
          relentless commitment to quality.
        </motion.p>
      </div>
    </section>
  );
}

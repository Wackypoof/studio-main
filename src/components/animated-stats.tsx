'use client';

import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const AnimatedNumber = ({ value, suffix = '', duration = 2 }: { value: number; suffix?: string; duration?: number }) => {
  const [currentValue, setCurrentValue] = useState(0);
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView) {
      const start = 0;
      const end = value;
      const increment = end / (duration * 30); // 30fps
      
      let current = start;
      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          setCurrentValue(end);
          clearInterval(timer);
        } else {
          setCurrentValue(Math.ceil(current));
        }
      }, 1000 / 30);
      
      return () => clearInterval(timer);
    }
  }, [inView, value, duration]);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="inline-block"
    >
      {currentValue.toLocaleString()}{suffix}
    </motion.span>
  );
};

export function AnimatedStats() {
  const stats = [
    { value: 10, suffix: 'B+', label: 'Total Value Sold' },
    { value: 50000, suffix: '+', label: 'Businesses Listed' },
    { value: 500000, suffix: '+', label: 'Members' },
    { value: 98, suffix: '%', label: 'Success Rate' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="text-4xl font-bold text-blue-600 mb-2 font-display">
            <AnimatedNumber value={stat.value} suffix={stat.suffix} />
          </div>
          <div className="text-gray-600 text-sm font-medium uppercase tracking-wider">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

import { motion } from 'framer-motion'

const lights = [
  { className: 'left-[8%] top-[16%] h-20 w-20', delay: 0 },
  { className: 'left-[74%] top-[22%] h-28 w-28', delay: 1.2 },
  { className: 'left-[26%] top-[68%] h-24 w-24', delay: 2.1 },
  { className: 'left-[72%] top-[72%] h-16 w-16', delay: 0.7 },
]

export function AmbientField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-candle opacity-80" />
      {lights.map((light) => (
        <motion.span
          key={light.className}
          className={`absolute rounded-full bg-[radial-gradient(circle,rgba(255,236,199,0.34),rgba(214,185,140,0.06)_48%,transparent_72%)] blur-2xl ${light.className}`}
          animate={{ y: [0, -12, 0], opacity: [0.28, 0.68, 0.32] }}
          transition={{
            duration: 12,
            delay: light.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      <motion.div
        className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(255,236,199,0.12),transparent_70%)]"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

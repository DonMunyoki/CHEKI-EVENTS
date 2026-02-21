import { motion } from "motion/react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  const textSizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div className="flex items-center gap-3">
      <motion.div
        className={`${sizeClasses[size]} relative flex items-center justify-center bg-gradient-to-br from-black via-gray-800 to-sky-500 rounded-2xl shadow-lg`}
        whileHover={{ scale: 1.05, rotate: 5 }}
        transition={{ duration: 0.3 }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/5 h-3/5"
        >
          {/* Eye icon representing "Cheki" (Look/Check) */}
          <circle
            cx="50"
            cy="50"
            r="35"
            stroke="#0ea5e9"
            strokeWidth="5"
            fill="none"
          />
          <circle cx="50" cy="50" r="18" fill="#0ea5e9" />
          <circle cx="50" cy="50" r="10" fill="white" />
          <circle cx="55" cy="45" r="4" fill="white" opacity="0.6" />
          
          {/* Ticket notch */}
          <path
            d="M 20 35 L 25 35 L 25 30 L 30 30 L 30 35 L 35 35"
            stroke="#0ea5e9"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </motion.div>
      
      {showText && (
        <div className="flex flex-col">
          <motion.h1
            className={`${textSizeClasses[size]} tracking-tight`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="text-black">Cheki</span>
            <span className="text-sky-500"> Events</span>
          </motion.h1>
        </div>
      )}
    </div>
  );
}

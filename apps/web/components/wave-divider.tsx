import React from "react";

/**
 * WaveDivider
 * A custom sinusoidal flowing wave divider that replaces harsh straight dividers
 * with a thematic accent water wave.
 */
export function WaveDivider({ className }: { className?: string }) {
  return (
    <div className={`cascade-wave-divider flex w-full justify-center overflow-hidden py-4 ${className ?? ""}`}>
      <svg 
        className="w-full h-5" 
        viewBox="0 0 1200 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        preserveAspectRatio="none"
      >
        <path 
          d="M0,12 C150,24 150,0 300,12 C450,24 450,0 600,12 C750,24 750,0 900,12 C1050,24 1050,0 1200,12" 
          stroke="currentColor" 
          strokeWidth="4" 
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-8 pb-12 overflow-hidden">
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Logo - groot */}
        <div className="w-72 h-72 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] relative mb-8 animate-fade-in">
          <Image
            src="/logo-limoncello.png"
            alt="Limoncello Edizione Limitata"
            fill
            className="object-contain drop-shadow-[0_0_40px_rgba(212,168,67,0.3)]"
            priority
          />
        </div>

        {/* Title */}
        <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-wider mb-3 animate-fade-in-up">
          LIMONCELLO
        </h1>

        <p className="font-playfair text-lg md:text-xl text-[#D4A843] tracking-widest mb-4 animate-fade-in-up animation-delay-200">
          Tavola Rotonda 92
        </p>

        <div className="flex items-center gap-3 text-[#B8C0D4] text-sm md:text-base tracking-wide animate-fade-in-up animation-delay-400">
          <span>Edizione Limitata</span>
          <span className="w-1 h-1 rounded-full bg-[#D4A843]" />
          <span>92 Bottiglie</span>
          <span className="w-1 h-1 rounded-full bg-[#D4A843]" />
          <span>32% Alcohol</span>
        </div>

        {/* Scroll indicator */}
        <div className="mt-12 animate-bounce">
          <svg
            className="w-6 h-6 text-[#D4A843] opacity-60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

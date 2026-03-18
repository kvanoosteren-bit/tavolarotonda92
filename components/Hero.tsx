"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center px-4 pt-10 pb-4 md:pt-14 md:pb-6">
      <div className="flex flex-col items-center text-center">
        {/* Logo */}
        <div className="w-56 h-56 md:w-72 md:h-72 relative mb-4 animate-fade-in">
          <Image
            src="/logo-limoncello.png"
            alt="Limoncello Edizione Limitata"
            fill
            className="object-contain drop-shadow-[0_0_40px_rgba(212,168,67,0.3)]"
            priority
          />
        </div>

        {/* Title */}
        <h1 className="font-playfair text-4xl md:text-6xl font-bold text-white tracking-wider mb-2 animate-fade-in-up">
          LIMONCELLO
        </h1>

        <p className="font-playfair text-base md:text-lg text-[#D4A843] tracking-widest mb-3 animate-fade-in-up animation-delay-200">
          Tavola Rotonda 92
        </p>

        <div className="flex items-center gap-2 text-[#B8C0D4] text-xs md:text-sm tracking-wide animate-fade-in-up animation-delay-400">
          <span>Edizione Limitata</span>
          <span className="w-1 h-1 rounded-full bg-[#D4A843]" />
          <span>92 Bottiglie</span>
          <span className="w-1 h-1 rounded-full bg-[#D4A843]" />
          <span>32% Alcohol</span>
        </div>
      </div>
    </section>
  );
}

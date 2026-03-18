"use client";

import { useEffect, useState } from "react";

interface SuccessMessageProps {
  naam: string;
  aantal: number;
  totaal: number;
  onClose: () => void;
}

export default function SuccessMessage({
  naam,
  aantal,
  totaal,
  onClose,
}: SuccessMessageProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const flessenText = aantal === 1 ? "fles" : "flessen";

  return (
    <div
      className={`transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="bg-[rgba(27,36,68,0.95)] border border-[#4CAF50] rounded-2xl p-8 text-center max-w-md mx-auto shadow-[0_0_40px_rgba(76,175,80,0.15)]">
        {/* Checkmark */}
        <div className="w-16 h-16 rounded-full bg-[#4CAF50]/20 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-[#4CAF50]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h3 className="font-playfair text-2xl text-white mb-2">
          Salute, {naam}! 🥂
        </h3>

        <p className="text-[#B8C0D4] mb-4">
          Je reservering van{" "}
          <strong className="text-white">
            {aantal} {flessenText}
          </strong>{" "}
          is bevestigd!
        </p>

        <div className="bg-[rgba(212,168,67,0.08)] border border-[rgba(212,168,67,0.3)] rounded-xl p-4 mb-4">
          <p className="font-playfair text-[#D4A843]">
            <span className="text-3xl font-bold">
              &euro;{totaal.toFixed(2).replace(".", ",")}
            </span>
          </p>
        </div>

        <p className="text-[#B8C0D4] text-sm mb-6">
          Je ontvangt een bevestigingsmail en binnenkort een Tikkie voor
          betaling.
        </p>

        <button
          onClick={onClose}
          className="text-[#D4A843] hover:text-[#E8C45A] transition-colors text-sm underline underline-offset-4"
        >
          Sluiten
        </button>
      </div>
    </div>
  );
}

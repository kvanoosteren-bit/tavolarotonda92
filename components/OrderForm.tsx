"use client";

import { useState } from "react";
import PriceDisplay from "./PriceDisplay";
import SuccessMessage from "./SuccessMessage";
import { OrderFormData } from "@/lib/types";

interface OrderFormProps {
  available: number;
  onOrderSuccess: (newStock: number) => void;
}

export default function OrderForm({ available, onOrderSuccess }: OrderFormProps) {
  const [formData, setFormData] = useState<OrderFormData>({
    naam: "",
    email: "",
    telefoon: "",
    aantal: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    naam: string;
    aantal: number;
    totaal: number;
  } | null>(null);

  const isSoldOut = available <= 0;
  const maxAantal = Math.min(10, available);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!formData.naam.trim()) {
      setError("Vul je naam in");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Vul een geldig e-mailadres in");
      return;
    }
    if (formData.telefoon.replace(/\D/g, "").length < 10) {
      setError("Vul een geldig telefoonnummer in (minimaal 10 cijfers)");
      return;
    }
    if (formData.aantal < 1 || formData.aantal > maxAantal) {
      setError(`Kies tussen 1 en ${maxAantal} flessen`);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Er is iets misgegaan");
        return;
      }

      // Success
      const totaal =
        Math.round(formData.aantal * 22.92 * 100) / 100;
      setSuccess({
        naam: formData.naam,
        aantal: formData.aantal,
        totaal,
      });
      onOrderSuccess(data.available);
      setFormData({ naam: "", email: "", telefoon: "", aantal: 1 });
    } catch {
      setError("Verbindingsfout. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section className="py-12 md:py-16 px-4">
        <SuccessMessage
          naam={success.naam}
          aantal={success.aantal}
          totaal={success.totaal}
          onClose={() => setSuccess(null)}
        />
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 px-4" id="bestel">
      <div className="max-w-md mx-auto">
        <div className="bg-[rgba(27,36,68,0.8)] border border-[rgba(212,168,67,0.3)] rounded-2xl p-6 md:p-8 shadow-[0_0_60px_rgba(212,168,67,0.08)]">
          <h2 className="font-playfair text-2xl md:text-3xl text-white text-center mb-8">
            {isSoldOut ? "Uitverkocht" : "Reserveer Nu"}
          </h2>

          {isSoldOut ? (
            <div className="text-center py-8">
              <p className="text-[#E74C3C] text-xl font-bold mb-2">
                UITVERKOCHT
              </p>
              <p className="text-[#B8C0D4] text-sm">
                Alle 92 flessen zijn gereserveerd.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Aantal selector */}
              <div>
                <label className="block text-[#B8C0D4] text-sm mb-2">
                  Aantal flessen
                </label>
                <div className="flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((d) => ({
                        ...d,
                        aantal: Math.max(1, d.aantal - 1),
                      }))
                    }
                    className="w-12 h-12 rounded-xl border border-[rgba(212,168,67,0.3)] bg-[rgba(212,168,67,0.08)] text-[#D4A843] text-xl font-bold hover:bg-[rgba(212,168,67,0.15)] transition-colors flex items-center justify-center"
                    disabled={loading}
                  >
                    &minus;
                  </button>
                  <span className="font-playfair text-4xl text-white w-16 text-center tabular-nums">
                    {formData.aantal}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((d) => ({
                        ...d,
                        aantal: Math.min(maxAantal, d.aantal + 1),
                      }))
                    }
                    className="w-12 h-12 rounded-xl border border-[rgba(212,168,67,0.3)] bg-[rgba(212,168,67,0.08)] text-[#D4A843] text-xl font-bold hover:bg-[rgba(212,168,67,0.15)] transition-colors flex items-center justify-center"
                    disabled={loading}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Live price calculation */}
              <PriceDisplay aantal={formData.aantal} />

              {/* Naam */}
              <div>
                <label
                  htmlFor="naam"
                  className="block text-[#B8C0D4] text-sm mb-2"
                >
                  Naam
                </label>
                <input
                  id="naam"
                  type="text"
                  required
                  value={formData.naam}
                  onChange={(e) =>
                    setFormData((d) => ({ ...d, naam: e.target.value }))
                  }
                  className="w-full bg-[rgba(19,27,51,0.6)] border border-[rgba(212,168,67,0.2)] rounded-xl px-4 py-3 text-white placeholder-[#B8C0D4]/40 focus:outline-none focus:border-[#D4A843] focus:ring-1 focus:ring-[#D4A843]/50 transition-all"
                  placeholder="Je volledige naam"
                  disabled={loading}
                />
              </div>

              {/* Telefoon */}
              <div>
                <label
                  htmlFor="telefoon"
                  className="block text-[#B8C0D4] text-sm mb-2"
                >
                  Telefoonnummer
                </label>
                <input
                  id="telefoon"
                  type="tel"
                  required
                  value={formData.telefoon}
                  onChange={(e) =>
                    setFormData((d) => ({ ...d, telefoon: e.target.value }))
                  }
                  className="w-full bg-[rgba(19,27,51,0.6)] border border-[rgba(212,168,67,0.2)] rounded-xl px-4 py-3 text-white placeholder-[#B8C0D4]/40 focus:outline-none focus:border-[#D4A843] focus:ring-1 focus:ring-[#D4A843]/50 transition-all"
                  placeholder="06 1234 5678"
                  disabled={loading}
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-[#B8C0D4] text-sm mb-2"
                >
                  E-mailadres
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((d) => ({ ...d, email: e.target.value }))
                  }
                  className="w-full bg-[rgba(19,27,51,0.6)] border border-[rgba(212,168,67,0.2)] rounded-xl px-4 py-3 text-white placeholder-[#B8C0D4]/40 focus:outline-none focus:border-[#D4A843] focus:ring-1 focus:ring-[#D4A843]/50 transition-all"
                  placeholder="je@email.nl"
                  disabled={loading}
                />
              </div>

              {/* Error */}
              {error && (
                <div className="bg-[#E74C3C]/10 border border-[#E74C3C]/30 rounded-xl p-3 text-center">
                  <p className="text-[#E74C3C] text-sm">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4A843] to-[#E8C45A] text-[#1B2444] font-bold text-lg tracking-wide hover:shadow-[0_0_30px_rgba(212,168,67,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <span className={loading ? "opacity-0" : ""}>
                  Reserveer Nu
                </span>
                {loading && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="animate-spin h-6 w-6 text-[#1B2444]"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  </span>
                )}
                {/* Glow effect on hover */}
                <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

interface PriceDisplayProps {
  aantal: number;
}

const PRICE_PER_BOTTLE = 22.92;

export default function PriceDisplay({ aantal }: PriceDisplayProps) {
  const totaal = Math.round(aantal * PRICE_PER_BOTTLE * 100) / 100;
  const [euros, centen] = totaal.toFixed(2).split(".");

  return (
    <div className="bg-[rgba(212,168,67,0.08)] border border-[rgba(212,168,67,0.3)] rounded-xl p-4 text-center">
      <p className="text-[#B8C0D4] text-sm mb-1">
        {aantal} &times; &euro;22,92
      </p>
      <p className="font-playfair text-[#D4A843]">
        <span className="text-3xl md:text-4xl font-bold">&euro;{euros}</span>
        <span className="text-xl md:text-2xl font-bold">,{centen}</span>
      </p>
    </div>
  );
}

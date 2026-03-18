"use client";

interface StockCounterProps {
  available: number;
  total: number;
  loading: boolean;
}

export default function StockCounter({
  available,
  total,
  loading,
}: StockCounterProps) {
  const percentage = (available / total) * 100;
  const isLow = available <= 10;
  const isSoldOut = available <= 0;

  return (
    <section className="py-6 md:py-8 px-4">
      <div className="max-w-md mx-auto text-center">
        {/* Stock number */}
        <div className="mb-6">
          {loading ? (
            <>
              <p className="text-[#B8C0D4] text-sm uppercase tracking-widest mb-2">
                Nog beschikbaar
              </p>
              <p className="font-playfair text-6xl md:text-7xl font-bold text-[#D4A843]">
                ···
                <span className="text-2xl md:text-3xl text-[#B8C0D4]">
                  {" "}
                  / {total}
                </span>
              </p>
              <p className="text-[#B8C0D4] text-sm mt-1">flessen beschikbaar</p>
            </>
          ) : isSoldOut ? (
            <p className="font-playfair text-4xl md:text-5xl font-bold text-[#E74C3C]">
              UITVERKOCHT
            </p>
          ) : (
            <>
              <p className="text-[#B8C0D4] text-sm uppercase tracking-widest mb-2">
                Nog beschikbaar
              </p>
              <p className="font-playfair text-6xl md:text-7xl font-bold text-[#D4A843] tabular-nums">
                {available}
                <span className="text-2xl md:text-3xl text-[#B8C0D4]">
                  {" "}
                  / {total}
                </span>
              </p>
              <p className="text-[#B8C0D4] text-sm mt-1">flessen beschikbaar</p>
            </>
          )}
        </div>

        {/* Progress bar */}
        {!loading && !isSoldOut && (
          <div className="w-full h-2 bg-[rgba(212,168,67,0.15)] rounded-full overflow-hidden mb-8">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${percentage}%`,
                backgroundColor: isLow ? "#E74C3C" : "#D4A843",
              }}
            />
          </div>
        )}

        {/* Low stock warning */}
        {!loading && isLow && !isSoldOut && (
          <p className="text-[#E74C3C] text-sm font-medium animate-pulse">
            Bijna uitverkocht — bestel snel!
          </p>
        )}
      </div>
    </section>
  );
}

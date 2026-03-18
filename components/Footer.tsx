export default function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-[rgba(212,168,67,0.15)]">
      <div className="max-w-md mx-auto text-center">
        <p className="font-playfair text-[#D4A843] text-lg mb-3">
          Tavola Rotonda 92
        </p>
        <p className="text-[#B8C0D4] text-sm mb-1">Veenendaal</p>
        <div className="w-8 h-px bg-[rgba(212,168,67,0.3)] mx-auto my-4" />
        <p className="text-[#B8C0D4] text-xs mb-2">
          Na reservering ontvang je een Tikkie voor betaling
        </p>
        <p className="text-[#B8C0D4]/60 text-xs">
          Vragen? Mail naar{" "}
          <a
            href="mailto:info@tafelronde92.nl"
            className="text-[#D4A843] hover:text-[#E8C45A] transition-colors"
          >
            info@tafelronde92.nl
          </a>
        </p>
      </div>
    </footer>
  );
}

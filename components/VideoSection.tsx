"use client";

export default function VideoSection() {
  return (
    <section className="py-12 md:py-16 px-4">
      <div className="max-w-lg mx-auto rounded-2xl overflow-hidden shadow-2xl border border-[rgba(212,168,67,0.2)]">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full"
        >
          <source src="/commercial.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}

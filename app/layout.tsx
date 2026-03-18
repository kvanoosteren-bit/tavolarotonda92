import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Limoncello Edizione Limitata — Tavola Rotonda 92",
  description:
    "Ambachtelijk geproduceerde Limoncello. Limited edition van slechts 92 flessen. Reserveer nu jouw fles.",
  openGraph: {
    title: "Limoncello Edizione Limitata — Tavola Rotonda 92",
    description:
      "Ambachtelijk geproduceerde Limoncello. Limited edition van slechts 92 flessen.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kilau Songket | Busana Songket Premium Anak & Dewasa",
  description: "Koleksi busana songket eksklusif anak-anak dan dewasa dengan furing katun lembut anti-gatal, tenunan benang emas presisi, dan desain modern. Pesan via WhatsApp & Shopee.",
  keywords: ["songket anak", "baju adat songket", "songket palembang", "sarimbit songket keluarga", "kebaya songket modern", "kemeja songket pria", "kilau songket"],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Kilau Songket - Keanggunan Warisan Songket untuk Seluruh Generasi",
    description: "Katalog setelan songket anak dan dewasa berkelas premium. Nyaman, elegan, dan siap kirim ke seluruh Indonesia.",
    type: "website",
    locale: "id_ID",
    siteName: "Kilau Songket",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col selection:bg-gold/30 selection:text-forest-dark font-sans">
        {children}
      </body>
    </html>
  );
}

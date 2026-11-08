import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ivory-warm flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-forest/10 flex items-center justify-center text-forest mb-4">
        <Home className="w-8 h-8 text-forest" />
      </div>
      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-dark mb-2">
        Halaman Tidak Ditemukan
      </h1>
      <p className="text-sm text-charcoal-light max-w-md mb-6">
        Maaf, halaman atau produk yang Anda cari tidak ditemukan atau telah dipindahkan.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-forest hover:bg-forest-light text-white font-semibold text-sm rounded-full shadow-md transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Beranda</span>
      </Link>
    </div>
  );
}


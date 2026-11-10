export interface Product {
  id: string;
  name: string;
  category: 'anak' | 'dewasa' | 'sarimbit';
  subCategory: 'anak-laki' | 'anak-perempuan' | 'dewasa-wanita' | 'dewasa-pria' | 'sarimbit';
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  images: string[];
  motif: string;
  material: string;
  furing: string;
  availableSizes: string[];
  colors: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  rating: number;
  soldCount: number;
  description: string;
  specs: {
    label: string;
    value: string;
  }[];
  shopeeUrl: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "ks-01",
    name: "Setelan Songket Cilik Panglima Emas (Anak Laki-laki)",
    category: "anak",
    subCategory: "anak-laki",
    categoryLabel: "Songket Anak Laki-laki",
    price: 385000,
    originalPrice: 450000,
    images: [
      "/images/logo.jpg",
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80",
    ],
    motif: "Lepus Bintang Berlian Klasik",
    material: "Songket Tenun Halus Grade A & Benang Emas Metalik",
    furing: "Katun Silky Lembut (Hypoallergenic, Dingin & Anti Gatal)",
    availableSizes: ["1-2 Th (XS)", "3-4 Th (S)", "5-6 Th (M)", "7-8 Th (L)", "9-11 Th (XL)"],
    colors: ["Deep Emerald Green", "Maroon Royal", "Navy Gold"],
    isFeatured: true,
    isBestSeller: true,
    rating: 4.9,
    soldCount: 142,
    description: "Setelan baju adat songket mewah khusus anak laki-laki yang dirancang dengan furing katun silky super lembut. Tidak kaku, tidak menusuk, dan sangat nyaman dipakai berjam-jam saat acara pawai adat, khitanan, pernikahan keluarga, maupun hari raya. Dilengkapi dengan peci/tanjak senada.",
    specs: [
      { label: "Paket Termasuk", value: "Baju Atasan Songket, Celana Senada, Tanjak Cilik" },
      { label: "Bahan Furing", value: "Katun Silky Premium Adem" },
      { label: "Pinggang Celana", value: "Full Karet Elastis Nyaman" },
      { label: "Rekomendasi Acara", value: "Karnaval TK/SD, Sunatan, Pendamping Pengantin, Acara Adat" }
    ],
    shopeeUrl: "https://shopee.co.id/kilausongket"
  },
  {
    id: "ks-02",
    name: "Baju Kurung Songket Putri Mayang (Anak Perempuan)",
    category: "anak",
    subCategory: "anak-perempuan",
    categoryLabel: "Songket Anak Perempuan",
    price: 395000,
    originalPrice: 475000,
    images: [
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80",
    ],
    motif: "Tabur Bunga Melati Emas",
    material: "Tenun Songket Sutra Sintetis Lemas Jatuh",
    furing: "Full Double-Lining Furing Katun Adem",
    availableSizes: ["2-3 Th (XS)", "4-5 Th (S)", "6-7 Th (M)", "8-9 Th (L)", "10-12 Th (XL)"],
    colors: ["Champagne Gold", "Blush Peach", "Emerald Green", "Ruby Maroon"],
    isFeatured: true,
    isBestSeller: true,
    rating: 5.0,
    soldCount: 189,
    description: "Keanggunan busana songket cilik untuk putri tercinta. Menggunakan kombinasi tenun motif bunga melati berkilau dengan furing ganda yang mencegah rasa gatal pada kulit sensitif anak. Model kurung modern praktis dengan resleting jepang di belakang dan rok lipit depan elastis.",
    specs: [
      { label: "Paket Termasuk", value: "Baju Kurung Songket, Rok Span Lipit, Selendang Kecil" },
      { label: "Furing", value: "Katun Ero Lembut Anti-Alergi" },
      { label: "Resleting", value: "YKK Invisible Back Zipper" },
      { label: "Rekomendasi Acara", value: "Hari Kartini, Pentas Seni, Pesta Keluarga, Foto Studio" }
    ],
    shopeeUrl: "https://shopee.co.id/kilausongket"
  },
  {
    id: "ks-03",
    name: "Koleksi Sarimbit Songket Keluarga Kirana Dirgahayu",
    category: "sarimbit",
    subCategory: "sarimbit",
    categoryLabel: "Sarimbit Keluarga",
    price: 1350000,
    originalPrice: 1580000,
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    ],
    motif: "Pucuk Rebung Raja & Limar Kencana",
    material: "Songket Tenun Benang Tembaga Emas Eksklusif",
    furing: "Premium Silk Habutai & Katun Silky",
    availableSizes: ["Ayah (M, L, XL, XXL)", "Ibu (S, M, L, XL)", "Anak Laki (1-10 Th)", "Anak Perempuan (1-10 Th)", "Custom Size"],
    colors: ["Deep Forest Green & Gold", "Midnight Navy & Silver", "Royal Maroon & Gold"],
    isFeatured: true,
    isNew: true,
    rating: 5.0,
    soldCount: 78,
    description: "Paket serasi keluarga mewah untuk momen sakral dan hajatan besar. Terdiri dari Kemeja Songket Ayah, Kurung Modern Songket Ibu, serta setelan senada untuk Anak Laki-laki atau Anak Perempuan. Tampil harmonis penuh wibawa dengan kilauan benang tenun khas warisan nusantara.",
    specs: [
      { label: "Pilihan Set", value: "Bisa pesan 3 pcs (Ayah + Ibu + 1 Anak) atau 4 pcs (+ 2 Anak)" },
      { label: "Layanan Khusus", value: "Bisa Custom Ukuran Tubuh (Bust / Waist / Panjang Celana)" },
      { label: "Kemasan", value: "Exclusive Hardbox & Greeting Card Kilau Songket" },
      { label: "Waktu Jahit Custom", value: "Ready Stock & Fast Pre-Order (3-5 Hari)" }
    ],
    shopeeUrl: "https://shopee.co.id/kilausongket"
  },
  {
    id: "ks-04",
    name: "Setelan Kebaya Kurung Songket Anggun Nirmala (Dewasa Wanita)",
    category: "dewasa",
    subCategory: "dewasa-wanita",
    categoryLabel: "Songket Wanita Dewasa",
    price: 680000,
    originalPrice: 799000,
    images: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80",
    ],
    motif: "Cantik Manis Palembang Serat Kilau",
    material: "Songket ATBM Tradisional Kombinasi Sutra Halus",
    furing: "Trikot Furing Halus Menempel di Badan",
    availableSizes: ["S", "M", "L", "XL", "XXL", "Custom Size"],
    colors: ["Deep Forest Green", "Champagne Gold", "Rose Gold", "Onyx Black Gold"],
    isFeatured: true,
    isBestSeller: true,
    rating: 4.9,
    soldCount: 230,
    description: "Busana kurung modern wanita dengan potongan fitted yang melangsingkan dan siluet elegan. Memadukan tenunan benang emas motif Cantik Manis yang memantulkan kilau anggun saat terkena cahaya ruangan. Cocok untuk wisuda, kondangan, resepsi pernikahan, dan acara kenegaraan.",
    specs: [
      { label: "Paket Termasuk", value: "Tunik Songket, Rok Span Belah Belakang, Selendang Senada" },
      { label: "Detail Jahitan", value: "Kupnat Depan & Belakang, Resleting Jepang" },
      { label: "Panjang Baju", value: "90 cm (Tutup Pinggul)" },
      { label: "Panjang Rok", value: "98 cm dengan Karet Pinggang Kiri-Kanan" }
    ],
    shopeeUrl: "https://shopee.co.id/kilausongket"
  },
  {
    id: "ks-05",
    name: "Kemeja Songket Tenun Satria Bangsawan (Dewasa Pria)",
    category: "dewasa",
    subCategory: "dewasa-pria",
    categoryLabel: "Songket Pria Dewasa",
    price: 495000,
    originalPrice: 575000,
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    ],
    motif: "Geometris Songket Rantai Raja",
    material: "Kombinasi Katun Primisima Lembut & Panel Songket Tenun",
    furing: "Full Furing Hero Adem Menyerap Keringat",
    availableSizes: ["M", "L", "XL", "XXL"],
    colors: ["Emerald Green Gold", "Charcoal Black Gold", "Navy Silver"],
    isFeatured: true,
    rating: 4.8,
    soldCount: 165,
    description: "Kemeja pria formal eksklusif beraksen panel songket tenun tangan di bagian dada dan manset lengan. Didesain berstruktur gagah dan tegak namun tetap sejuk dipakai seharian berkat lapisan furing katun hero penyerap keringat. Wajib dimiliki untuk menghadiri resepsi dan acara formal.",
    specs: [
      { label: "Kerah", value: "Mandarin Collar (Kerah Shanghai) Berdiri Kokoh" },
      { label: "Kancing", value: "Kancing Tersembunyi (Fly Front) Rapi Minimalis" },
      { label: "Lengan", value: "Lengan Panjang Berkancing Songket" },
      { label: "Kantong", value: "Kantong Paspol Depan Presisi" }
    ],
    shopeeUrl: "https://shopee.co.id/kilausongket"
  },
  {
    id: "ks-06",
    name: "Setelan Songket Balita Pangeran Kecil (6 Bln - 2 Tahun)",
    category: "anak",
    subCategory: "anak-laki",
    categoryLabel: "Songket Balita & Batita",
    price: 295000,
    originalPrice: 345000,
    images: [
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80",
    ],
    motif: "Miniatur Songket Melati Emas",
    material: "Songket Katun Tenun Super Soft Anti-Iritasi",
    furing: "100% Katun Bambu Organik Extra Soft",
    availableSizes: ["6-12 Bulan", "12-18 Bulan", "18-24 Bulan"],
    colors: ["Ivory Gold", "Forest Green Gold", "Royal Navy"],
    isNew: true,
    rating: 5.0,
    soldCount: 94,
    description: "Spesial untuk si kecil batita/balita! Kami mengerti kulit bayi sangat sensitif, karena itu setelan ini menggunakan furing katun bambu yang luar biasa lembut tanpa benang kasar yang menyentuh kulit. Si kecil tampil ganteng menggemaskan tanpa rewel.",
    specs: [
      { label: "Bahan Khusus", value: "Ultra-Soft Cotton Songket ramah kulit bayi" },
      { label: "Bukaan", value: "Kancing snap leher lebar agar mudah dipakaikan" },
      { label: "Celana", value: "Desain elastis longgar muat popok/diapers" },
      { label: "Aksesoris", value: "Termasuk topi tanjak mini karet elastis" }
    ],
    shopeeUrl: "https://shopee.co.id/kilausongket"
  },
  {
    id: "ks-07",
    name: "Set Baju Adat Songket Dara Jelita Cilik (Anak Perempuan)",
    category: "anak",
    subCategory: "anak-perempuan",
    categoryLabel: "Songket Anak Perempuan",
    price: 420000,
    originalPrice: 490000,
    images: [
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    ],
    motif: "Naga Besaung & Bunga Cina Emas",
    material: "Tenun Songket Gradasi Halus Lemas",
    furing: "Double Katun Jepang Adem",
    availableSizes: ["3-4 Th (S)", "5-6 Th (M)", "7-8 Th (L)", "9-10 Th (XL)"],
    colors: ["Ruby Red Gold", "Champagne Gold", "Emerald Teal"],
    rating: 4.9,
    soldCount: 112,
    description: "Pilihan terbaik untuk foto keluarga, pentas seni sekolah, dan karnaval busana adat anak. Model atasan bervariasi aksen obi songket mewah dan rok instan yang memudahkan anak bergerak lincah dan bermain riang.",
    specs: [
      { label: "Bahan Furing", value: "Katun Jepang Dingin Menyerap Keringat" },
      { label: "Rok", value: "Model Rok Span Instan dengan Belahan Lipat Tertutup" },
      { label: "Aksesoris", value: "Termasuk Selendang Bahu Cilik Senada" }
    ],
    shopeeUrl: "https://shopee.co.id/kilausongket"
  },
  {
    id: "ks-08",
    name: "Setelan Beskap & Kain Songket Sampin Bangsawan (Pria Dewasa)",
    category: "dewasa",
    subCategory: "dewasa-pria",
    categoryLabel: "Songket Pria Dewasa",
    price: 890000,
    originalPrice: 1050000,
    images: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
    ],
    motif: "Lepus Bintang Penuh & Pucuk Rebung Tembaga",
    material: "Kain Songket Tenun Tangan Asli & Wool Semi-Formal Beskap",
    furing: "Full Satin Silk Suiting",
    availableSizes: ["M", "L", "XL", "XXL", "Custom Size"],
    colors: ["Deep Emerald & Gold", "Classic Black & Gold", "Royal Navy & Silver"],
    isNew: true,
    rating: 4.9,
    soldCount: 63,
    description: "Set busana adat pria premium lengkap: Jas Beskap modern berpotongan rapi, dipadukan dengan Kain Sampin Songket lipat praktis serta Tanjak / Tengkolok berstruktur tegap. Tampilan khas raja Melayu nusantara yang memancarkan kharisma dan kemegahan.",
    specs: [
      { label: "Kelengkapan", value: "Jas Beskap, Kain Sampin Songket Instan, Tanjak Kepala, Rantai Hiasan" },
      { label: "Kain Sampin", value: "Dilengkapi resleting dan perekat velcro praktis" },
      { label: "Ukuran Tanjak", value: "Bisa disesuaikan dengan lingkar kepala" }
    ],
    shopeeUrl: "https://shopee.co.id/kilausongket"
  }
];

export const CATEGORIES = [
  {
    id: "all",
    label: "Semua Koleksi",
    count: 8,
    description: "Seluruh pilihan busana songket eksklusif anak dan dewasa"
  },
  {
    id: "anak",
    label: "Songket Anak (1-12 Th)",
    count: 4,
    description: "Pakaian adat anak nyaman, furing katun adem anti-gatal",
    badge: "Terlaris"
  },
  {
    id: "dewasa",
    label: "Songket Dewasa (Pria & Wanita)",
    count: 3,
    description: "Setelan kurung wanita elegan & kemeja pria berwibawa",
    badge: "Elegan"
  },
  {
    id: "sarimbit",
    label: "Sarimbit Keluarga",
    count: 1,
    description: "Koleksi serasi ayah, ibu, dan anak untuk hari istimewa",
    badge: "Eksklusif"
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "dr. Amanda Kartika",
    city: "Jakarta Selatan",
    role: "Pelanggan Sarimbit Keluarga",
    event: "Resepsi Pernikahan Keluarga",
    rating: 5,
    content: "Awalnya ragu beli songket untuk anak umur 4 tahun karena takut gerah dan gatal. Ternyata baju Kilau Songket bagian dalamnya furing katun super halus dan adem banget! Anak saya nyaman seharian di acara kondangan. Baju saya dan suami juga pas banget di badan.",
    productPurchased: "Sarimbit Keluarga Kirana Dirgahayu"
  },
  {
    id: 2,
    name: "Rian Hidayat, S.T.",
    city: "Palembang",
    role: "Pelanggan Songket Pria",
    event: "Acara Lamaran Adat",
    rating: 5,
    content: "Kemeja songketnya berkelas sekali! Kilauan benang emasnya mewah tapi tidak norak. Jahitannya rapi setara butik ternama. Konsultasi via WhatsApp sangat responsif dan ramah, dipandu memilih ukuran yang presisi.",
    productPurchased: "Kemeja Songket Satria Bangsawan"
  },
  {
    id: 3,
    name: "Ibu Nurul Fadilah",
    city: "Bandung",
    role: "Orang Tua Siswa TK",
    event: "Karnaval Hari Kartini Sekolah",
    rating: 5,
    content: "Baju Kurung Puteri Mayang cantik banget waktu dipakai putri saya. Semua guru dan wali murid memuji penampilannya. Paling senang karena pemesanannya praktis bisa lewat Shopee dan barang sampai cepat!",
    productPurchased: "Baju Kurung Songket Putri Mayang"
  },
  {
    id: 4,
    name: "Siti Rahmawati, M.Pd.",
    city: "Surabaya",
    role: "Pelanggan Kebaya Wisuda",
    event: "Wisuda Pascasarjana",
    rating: 5,
    content: "Jatuh cinta sama motif Cantik Manisnya! Potongannya bikin siluet tubuh kelihatan ramping dan anggun. Banyak yang ngira ini songket jutaan rupiah dari butik desainer. Sangat memuaskan!",
    productPurchased: "Kebaya Kurung Songket Anggun Nirmala"
  }
];

export const FAQS = [
  {
    question: "Apakah bahan songket Kilau Songket aman dan tidak gatal untuk anak-anak?",
    answer: "Sangat aman! Seluruh koleksi songket anak Kilau Songket kami lapisi dengan furing katun silky / katun Jepang ganda yang berserat halus dan hypoallergenic. Benang songket tidak akan langsung bersentuhan dengan kulit anak, sehingga bebas gatal, tidak panas, dan sangat nyaman dipakai si kecil beraktivitas."
  },
  {
    question: "Bagaimana cara memesan lewat WhatsApp dan Shopee?",
    answer: "Sangat mudah! Pada halaman produk, Anda cukup klik tombol 'Pesan via WhatsApp' untuk langsung terhubung dengan admin kami (detail nama produk dan ukuran otomatis terisi dalam chat). Atau klik tombol 'Beli di Shopee' untuk transaksi aman dengan jaminan marketplace Shopee."
  },
  {
    question: "Apakah bisa request ukuran khusus (Custom Size) atau seragam keluarga?",
    answer: "Bisa! Kami melayani Custom Size untuk dewasa maupun anak-anak, serta pemesanan seragam Sarimbit Keluarga dalam jumlah tertentu. Silakan hubungi admin WhatsApp kami untuk berkonsultasi mengenai panduan ukur badan (LD, LP, dll)."
  },
  {
    question: "Berapa lama proses pengiriman?",
    answer: "Untuk produk Ready Stock, pesanan dikirim dalam 1x24 jam setelah pembayaran dikonfirmasi. Untuk Custom Size / Pre-Order, pengerjaan berkisar 3-5 hari kerja. Kami bekerja sama dengan ekspedisi kilat (J&T, SiCepat, JNE) ke seluruh Indonesia."
  },
  {
    question: "Apakah ada garansi jika ukuran yang diterima tidak pas?",
    answer: "Ada! Kami menyediakan Garansi Tukar Ukuran dalam 3 hari setelah barang diterima, asalkan label belum dilepas dan pakaian belum dicuci. Kepuasan Anda adalah prioritas kami."
  }
];

export const STORE_INFO = {
  name: "Kilau Songket",
  tagline: "Keanggunan Warisan Songket Nusantara untuk Seluruh Generasi",
  whatsappNumber: "6281234567890",
  whatsappDisplay: "+62 812-3456-7890",
  shopeeUrl: "https://shopee.co.id/kilausongket",
  instagramUrl: "https://instagram.com/kilausongket",
  tiktokUrl: "https://tiktok.com/@kilausongket",
  email: "halo@kilausongket.com",
  operationalHours: "Senin - Minggu: 08.00 - 21.00 WIB",
  address: "Sentra Tenun & Butik Kilau Songket, Jl. Kebangsaan No. 88, Indonesia",
};

export function getWhatsAppProductUrl(productName: string, selectedSize?: string): string {
  const sizeText = selectedSize ? ` (Ukuran: ${selectedSize})` : "";
  const text = `Halo Kilau Songket, saya tertarik dengan produk ${productName}${sizeText}. Apakah produk ini masih tersedia dan bisa konsultasi detailnya?`;
  return `https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}


"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Package,
  Tags,
  MessageSquareQuote,
  HelpCircle,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Sparkles,
  User,
  ShieldCheck,
  ChevronRight,
  Store,
  Clock,
  AlertCircle,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";

interface AdminUser {
  id: string;
  username: string;
  name: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Login form state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/auth");
      const data = await res.json();
      if (data.success && data.data) {
        setAdmin(data.data);
      } else {
        setAdmin(null);
      }
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, []);

  // Stealth protection: if not logged in and visitor tries direct /admin (without /Teedud), redirect to home
  useEffect(() => {
    if (mounted && !loading && !admin && typeof window !== "undefined") {
      const currentPath = window.location.pathname.toLowerCase();
      if (currentPath === "/admin" || currentPath === "/admin/") {
        router.replace("/");
      }
    }
  }, [mounted, loading, admin, router]);

  // Inactivity timeout: Auto-logout after 1 hour (3600 seconds) of no user activity
  const INACTIVITY_TIMEOUT_MS = 60 * 60 * 1000; // 1 hour

  useEffect(() => {
    if (!admin) return;

    let timeoutId: NodeJS.Timeout;

    const performAutoLogout = async () => {
      try {
        await fetch("/api/admin/auth/logout", { method: "POST" });
      } catch (err) {
        console.error("Auto logout failed", err);
      }
      setAdmin(null);
      setLoginError("Sesi Anda telah berakhir karena tidak ada aktivitas selama lebih dari 1 jam. Silakan login kembali untuk melanjutkan.");
    };

    const resetInactivityTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(performAutoLogout, INACTIVITY_TIMEOUT_MS);
    };

    // User activity events to reset inactivity timer
    const activityEvents = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];
    activityEvents.forEach((evt) => {
      window.addEventListener(evt, resetInactivityTimer, { passive: true });
    });

    // Start 1-hour countdown timer on initial load/login
    resetInactivityTimer();

    return () => {
      clearTimeout(timeoutId);
      activityEvents.forEach((evt) => {
        window.removeEventListener(evt, resetInactivityTimer);
      });
    };
  }, [admin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAdmin(data.data);
        setLoginUsername("");
        setLoginPassword("");
      } else {
        setLoginError(data.error || "Gagal masuk. Periksa kembali username & password.");
      }
    } catch (err: any) {
      setLoginError("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      setAdmin(null);
      router.push("/Teedud/Login");
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-forest border-t-gold rounded-full animate-spin" />
          <p className="text-sm font-medium text-stone-600">Memuat panel admin...</p>
        </div>
      </div>
    );
  }

  // Not authenticated: Show Modern Luxury Login Card
  if (!admin) {
    return (
      <div className="min-h-screen bg-[#07130F] relative overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-gold/30">
        {/* Ambient Decorative Luxury Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-forest/40 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gold/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-96 bg-forest-dark/30 rounded-full blur-[150px] pointer-events-none" />

        <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] border border-stone-200/90 p-7 sm:p-9 relative z-10 overflow-hidden">
          {/* Subtle Top Gold Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gold/30 via-gold to-gold/30" />

          {/* Header Brand */}
          <div className="text-center mb-6 pt-1">
            <div className="w-16 h-16 mx-auto mb-3.5 rounded-2xl bg-white p-2 border-2 border-gold/40 shadow-md flex items-center justify-center relative">
              <Image
                src="/images/logo.jpg"
                alt="Kilau Songket"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-gold-dark uppercase bg-gold/10 px-2.5 py-0.5 rounded-full border border-gold/25 mb-1.5">
              <Sparkles className="w-3 h-3 text-gold-dark" />
              <span>Admin Management</span>
            </div>
            <h1 className="text-xl font-serif font-bold text-forest-dark tracking-wide">
              Kilau Songket
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Masuk untuk mengelola katalog, banner, dan pengaturan toko.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className={`p-3.5 rounded-xl text-xs font-medium flex items-start gap-2.5 ${
                loginError.includes("1 jam") || loginError.includes("berakhir")
                  ? "bg-amber-50 border border-amber-200 text-amber-900"
                  : "bg-red-50 border border-red-200 text-red-600"
              }`}>
                {loginError.includes("1 jam") || loginError.includes("berakhir") ? (
                  <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <span className="leading-relaxed">{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-stone-50/80 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-stone-50/80 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 focus:outline-none"
                  title={showPassword ? "Sembunyikan password" : "Lihat password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-stone-400 mt-1.5 flex items-center justify-between">
                <span>Default: <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-stone-600">admin</code> / <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-stone-600">admin123</code></span>
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-forest hover:bg-forest-light active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition duration-200 shadow-lg shadow-forest/20 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              <ShieldCheck className="w-4 h-4 text-gold-light" />
              <span>{isSubmitting ? "Memverifikasi..." : "Masuk ke Dashboard"}</span>
            </button>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
              <span className="flex items-center gap-1 font-medium text-stone-500">
                <Clock className="w-3.5 h-3.5 text-gold-dark" />
                Sesi Aman 1 Jam
              </span>
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-stone-500 hover:text-forest transition font-medium"
              >
                <span>Website Utama</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Navigation Items
  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Katalog Produk", href: "/admin/produk", icon: Package },
    { label: "Kategori", href: "/admin/kategori", icon: Tags },
    { label: "Testimoni", href: "/admin/testimoni", icon: MessageSquareQuote },
    { label: "FAQ Tanya Jawab", href: "/admin/faq", icon: HelpCircle },
    { label: "Pengaturan Toko", href: "/admin/pengaturan", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-stone-50/70 flex">
      {/* Sidebar Desktop - Fixed/Sticky Height & Never Scrolls Away */}
      <aside className="hidden lg:flex w-60 bg-forest text-white flex-col flex-shrink-0 z-30 shadow-xl border-r border-stone-800 h-screen sticky top-0">
        {/* Brand Header */}
        <div className="p-4 border-b border-forest-light flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white p-1 flex-shrink-0 relative shadow-sm">
            <Image
              src="/images/logo.jpg"
              alt="Kilau Songket"
              fill
              className="object-contain p-0.5"
            />
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-bold tracking-wider text-gold-light uppercase font-display truncate">
              Kilau Songket
            </div>
            <div className="text-[10px] text-stone-300 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-gold" />
              <span>Admin Center</span>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-2.5 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-forest-light text-white border-l-4 border-gold shadow-sm font-bold"
                    : "text-stone-300 hover:text-white hover:bg-forest-light/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-gold" : "text-stone-400"}`} />
                <span>{item.label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-gold" />}
              </Link>
            );
          })}

          <div className="pt-3 mt-3 border-t border-forest-light/60 space-y-1">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-300 hover:text-white hover:bg-forest-light/60 transition"
            >
              <Store className="w-4 h-4 text-stone-400" />
              <span>Buka Website</span>
              <ExternalLink className="w-3.5 h-3.5 ml-auto text-stone-400" />
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-300 hover:text-red-100 hover:bg-red-900/30 transition text-left"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span>Keluar</span>
            </button>
          </div>
        </nav>

        {/* Admin info footer */}
        <div className="p-3 border-t border-forest-light bg-forest-dark/40 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center text-gold-light font-bold text-xs">
            <User className="w-3.5 h-3.5" />
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-bold text-white truncate">{admin.name}</div>
            <div className="text-[10px] text-stone-400 truncate">@{admin.username}</div>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-64 max-w-[80vw] bg-forest text-white h-full flex flex-col z-10 shadow-2xl">
            <div className="p-4 border-b border-forest-light flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white relative">
                  <Image src="/images/logo.jpg" alt="Logo" fill className="object-contain p-0.5" />
                </div>
                <span className="font-bold text-xs text-gold-light">KILAU SONGKET</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-lg text-stone-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-2.5 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold ${
                      isActive ? "bg-forest-light text-white border-l-4 border-gold font-bold" : "text-stone-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <div className="pt-3 border-t border-forest-light">
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-300"
                >
                  <Store className="w-4 h-4" />
                  <span>Buka Website</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-300 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar - Compact & Fitted */}
        <header className="relative z-20 bg-white border-b border-stone-200/80 px-4 sm:px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1.5 text-stone-600 hover:bg-stone-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-charcoal leading-tight">
                Panel Kontrol Toko
              </h1>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                Kelola produk, katalog, harga, kontak WA & link Shopee secara langsung
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-forest bg-forest/10 hover:bg-forest/15 rounded-full transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Pratinjau Toko</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-stone-600 hover:text-red-600 hover:bg-red-50 rounded-full transition"
              title="Keluar dari akun admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-5 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}


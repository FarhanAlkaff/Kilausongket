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
  AlertCircle
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

  // Not authenticated: Show Login Card
  if (!admin) {
    return (
      <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
          {/* Header banner */}
          <div className="bg-forest px-6 py-8 text-center text-white relative">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/10 p-1 flex items-center justify-center border border-gold/40 shadow-inner">
              <div className="w-12 h-12 relative rounded-full overflow-hidden bg-white">
                <Image
                  src="/images/logo.jpg"
                  alt="Kilau Songket"
                  fill
                  className="object-contain p-1"
                />
              </div>
            </div>
            <h1 className="text-xl font-bold tracking-wider text-gold-light uppercase font-display">
              Kilau Songket
            </h1>
            <p className="text-xs text-stone-300 mt-1">Admin Dashboard Management</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-charcoal">Masuk ke Dashboard</h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Kelola katalog produk, banner, dan pengaturan landing page.
              </p>
            </div>

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
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest transition"
              />
              <p className="text-[11px] text-stone-400 mt-1.5">
                Default: username <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">admin</code> / password <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">admin123</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-forest hover:bg-forest-light text-white font-semibold text-sm rounded-xl transition duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4 text-gold-light" />
              <span>{isSubmitting ? "Memverifikasi..." : "Masuk Dashboard"}</span>
            </button>

            <div className="pt-2 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-forest transition font-medium"
              >
                <span>Lihat Website Utama</span>
                <ExternalLink className="w-3.5 h-3.5" />
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
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-64 bg-forest text-white flex-col flex-shrink-0 z-30 shadow-xl border-r border-stone-800">
        {/* Brand Header */}
        <div className="p-5 border-b border-forest-light flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white p-1 flex-shrink-0 relative shadow-sm">
            <Image
              src="/images/logo.jpg"
              alt="Kilau Songket"
              fill
              className="object-contain p-0.5"
            />
          </div>
          <div className="overflow-hidden">
            <div className="text-sm font-bold tracking-wider text-gold-light uppercase font-display truncate">
              Kilau Songket
            </div>
            <div className="text-[11px] text-stone-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-gold" />
              <span>Admin Center</span>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
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

          <div className="pt-4 mt-4 border-t border-forest-light space-y-1">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-stone-300 hover:text-white hover:bg-forest-light/60 transition"
            >
              <Store className="w-4 h-4 text-stone-400" />
              <span>Buka Website</span>
              <ExternalLink className="w-3.5 h-3.5 ml-auto text-stone-400" />
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-300 hover:text-red-100 hover:bg-red-900/30 transition text-left"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span>Keluar</span>
            </button>
          </div>
        </nav>

        {/* Admin info footer */}
        <div className="p-4 border-t border-forest-light bg-forest-dark/40 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold-light font-bold text-xs">
            <User className="w-4 h-4" />
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
          <div className="relative w-72 max-w-[80vw] bg-forest text-white h-full flex flex-col z-10 shadow-2xl">
            <div className="p-4 border-b border-forest-light flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white relative">
                  <Image src="/images/logo.jpg" alt="Logo" fill className="object-contain p-0.5" />
                </div>
                <span className="font-bold text-sm text-gold-light">KILAU SONGKET</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-lg text-stone-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                      isActive ? "bg-forest-light text-white border-l-4 border-gold" : "text-stone-300"
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
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-stone-300"
                >
                  <Store className="w-4 h-4" />
                  <span>Buka Website</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-300 text-left"
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
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 bg-white border-b border-stone-200 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-stone-600 hover:bg-stone-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-charcoal">
                Panel Kontrol Toko
              </h1>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                Kelola produk, katalog, harga, kontak WA & link Shopee secara langsung
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-forest bg-forest/10 hover:bg-forest/15 rounded-full transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Pratinjau Toko</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-red-600 hover:bg-red-50 rounded-full transition"
              title="Keluar dari akun admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}


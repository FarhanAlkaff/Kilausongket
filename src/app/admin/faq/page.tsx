"use client";

import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  X,
  AlertCircle
} from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  isActive: boolean;
  sortOrder: number;
}

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const [formQuestion, setFormQuestion] = useState("");
  const [formAnswer, setFormAnswer] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadFaqs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/faqs");
      const data = await res.json();
      if (data.success) {
        setFaqs(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormQuestion("");
    setFormAnswer("");
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const openEditModal = (f: FAQ) => {
    setIsEditing(true);
    setCurrentId(f.id);
    setFormQuestion(f.question);
    setFormAnswer(f.answer);
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestion.trim() || !formAnswer.trim()) {
      setErrorMessage("Pertanyaan dan jawaban wajib diisi");
      return;
    }

    setSaving(true);
    setErrorMessage("");

    try {
      const url = isEditing ? `/api/admin/faqs/${currentId}` : "/api/admin/faqs";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: formQuestion,
          answer: formAnswer,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        loadFaqs();
      } else {
        setErrorMessage(data.error || "Gagal menyimpan FAQ");
      }
    } catch {
      setErrorMessage("Terjadi kesalahan jaringan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, q: string) => {
    if (!confirm(`Hapus pertanyaan: "${q}"?`)) return;

    try {
      const res = await fetch(`/api/admin/faqs/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        loadFaqs();
      } else {
        alert(data.error || "Gagal menghapus FAQ");
      }
    } catch {
      alert("Terjadi kesalahan jaringan");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-charcoal">FAQ (Tanya Jawab Pembeli)</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Daftar pertanyaan yang sering ditanyakan pembeli seputar furing, ukuran & pemesanan
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-forest hover:bg-forest-light text-white font-bold text-xs rounded-xl shadow-md transition"
        >
          <Plus className="w-4 h-4 text-gold-light" />
          <span>Tambah FAQ</span>
        </button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="py-12 text-center text-xs text-stone-400">
            Memuat FAQ...
          </div>
        ) : faqs.length === 0 ? (
          <div className="py-12 text-center text-xs text-stone-400">
            Belum ada pertanyaan FAQ.
          </div>
        ) : (
          faqs.map((f, i) => (
            <div
              key={f.id}
              className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm flex items-start justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-forest/10 text-forest font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                    Q
                  </span>
                  <h3 className="text-xs font-bold text-charcoal">{f.question}</h3>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed pl-7">
                  {f.answer}
                </p>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0 pt-0.5">
                <button
                  onClick={() => openEditModal(f)}
                  className="p-1.5 text-stone-500 hover:text-forest hover:bg-stone-100 rounded-lg transition"
                  title="Edit FAQ"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(f.id, f.question)}
                  className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Hapus FAQ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-sm font-bold text-charcoal">
                {isEditing ? "Edit Pertanyaan FAQ" : "Tambah Pertanyaan FAQ Baru"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="mt-3 p-2.5 bg-red-50 border border-red-200 text-xs text-red-600 rounded-xl">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSave} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Pertanyaan Pembeli *
                </label>
                <input
                  type="text"
                  required
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  placeholder="Contoh: Apakah bahan songket aman untuk kulit bayi/anak?"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Jawaban Lengkap *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formAnswer}
                  onChange={(e) => setFormAnswer(e.target.value)}
                  placeholder="Jelaskan secara ramah, lengkap, dan meyakinkan..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-600 rounded-xl hover:bg-stone-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-forest hover:bg-forest-light text-white font-bold rounded-xl shadow-md disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


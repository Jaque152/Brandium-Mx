"use client";

import { ArrowLeft, Lock, Globe } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/context/I18nContext";

export default function CancelacionesPage() {
  const { t, lang, toggleLanguage } = useI18n();

  return (
    <main className="min-h-screen bg-background gradient-mesh relative overflow-hidden pt-24 pb-20">
      <div className="grain" />
      
      <header className="fixed top-0 left-0 right-0 z-50 glass-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo Brandium Mx" className="h-10 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="hidden sm:flex items-center gap-2">
              <Lock className="w-4 h-4" /> {t.checkout.header.secure}
            </div>
            <button onClick={toggleLanguage} className="p-2 glass-card rounded-full flex items-center gap-2 text-sm hover:text-primary transition-colors">
              <Globe className="w-4 h-4" />
              {lang === "es" ? "EN" : "ES"}
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>

        <h1 className="text-3xl md:text-5xl font-normal mb-12 text-gradient">
          {t.legal.cancellations.title}
        </h1>

        <div className="glass-card rounded-3xl p-8 md:p-12 space-y-12">
          {t.legal.cancellations.sections.map((section, idx) => (
            <div key={idx}>
              <h2 className="text-xl font-medium mb-4 text-primary">
                {section.title}
              </h2>
              <div className="space-y-4 text-muted-foreground">
                {section.content.map((paragraph, pIdx) => (
                  <p key={pIdx} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
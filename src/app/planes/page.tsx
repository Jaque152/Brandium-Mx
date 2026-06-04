"use client";

import { ArrowRight, Check, Sparkles, Zap, Globe } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useI18n } from "@/context/I18nContext";
import { useState } from "react";


interface ProductItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: string;
}
export default function PlanesPage() {
  const { addItem, isInCart } = useCart();
  const { t, lang, toggleLanguage } = useI18n();
  const [addedItems, setAddedItems] = useState<string[]>([]);

  const handleAddToCart = (item: ProductItem) => {
    addItem({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      type: item.type as "plan" | "service" | "addon",
    });
    setAddedItems((prev) => [...prev, item.id]);
    setTimeout(() => {
      setAddedItems((prev) => prev.filter((id) => id !== item.id));
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-background gradient-mesh relative overflow-hidden pt-24 pb-20">
      <div className="grain" />
      
      {/* Header con botón de idioma */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Logo Brandium Mx" 
              className="h-10 w-auto object-contain" 
            />
            <span className="text-xl font-semibold tracking-tight">Brandium Mx</span>
          </Link>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/#services" className="text-muted-foreground hover:text-foreground text-sm">{t.nav.services}</Link>
              <Link href="/planes" className="text-foreground text-sm">{t.nav.plans}</Link>
            </nav>
            <button onClick={toggleLanguage} className="p-2 glass-card rounded-full flex items-center gap-2 text-sm hover:text-primary transition-colors">
              <Globe className="w-4 h-4" />
              {lang === "es" ? "EN" : "ES"}
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal mb-6">
            <span className="text-gradient italic">{t.nav.services}</span>
          </h1>
        </div>

        {/* Iteración del Diccionario de Productos */}
        <div className="space-y-16 mb-20">
          {Object.entries(t.products).map(([categoryKey, category]) => (
            <div key={categoryKey}>
              <h2 className="text-3xl font-medium mb-8 pb-2 border-b border-white/10">{category.title}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item) => {
                  const inCart = isInCart(item.id);
                  const justAdded = addedItems.includes(item.id);

                  return (
                    <div key={item.id} className="relative glass-card rounded-3xl p-8 flex flex-col hover:border-primary/50 transition-colors">
                      <h3 className="text-2xl mb-2">{item.name}</h3>
                      <p className="text-muted-foreground text-sm mb-6 flex-1">{item.description}</p>
                      <div className="mb-6">
                        <span className="text-3xl font-normal text-gradient">${item.price.toLocaleString()}</span>
                        <span className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
                          MXN <span className="text-xs border border-white/20 px-2 py-0.5 rounded-full">{t.cart.plusIva}</span>
                        </span>
                      </div>
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={inCart}
                        className={`w-full py-4 rounded-full font-medium flex items-center justify-center gap-2 transition-all ${
                          inCart ? "bg-muted text-muted-foreground cursor-not-allowed"
                          : justAdded ? "bg-green-500 text-white"
                          : "glass-card hover:bg-white/5"
                        }`}
                      >
                        {inCart ? (lang === "es" ? "Ya en carrito" : "In Cart") 
                         : justAdded ? <><Check className="w-5 h-5"/> {lang === "es" ? "Agregado" : "Added"}</> 
                         : <><Sparkles className="w-5 h-5"/> {lang === "es" ? "Agregar" : "Add"}</>}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {/* Custom Plan CTA */}
        <div className="glass-card rounded-3xl p-8 md:p-12 mb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-normal mb-4">
                {t.customPlan.title1}{" "}
                <span className="text-gradient italic">{t.customPlan.title2}</span>
              </h2>
              <p className="text-muted-foreground max-w-xl">
                {t.customPlan.desc}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Link
                href="/cotizacion"
                className="px-8 py-4 rounded-full glass-card hover:bg-white/5 font-medium flex items-center justify-center gap-2 whitespace-nowrap transition-all text-center"
              >
                {t.customPlan.btnPay}
              </Link>
              <Link
                href="/contacto"
                className="px-8 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium flex items-center justify-center gap-2 whitespace-nowrap hover:glow-coral transition-all text-center"
              >
                {t.customPlan.btnCreate}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
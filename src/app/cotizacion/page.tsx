"use client";

import { useState } from "react";
import { ArrowLeft, Check, Lock, Search, ShoppingCart, Zap, Globe } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useI18n } from "@/context/I18nContext";

export default function CotizacionPage() {
  const router = useRouter();
  const { addItem, isInCart } = useCart();
  const { t, lang, toggleLanguage } = useI18n();
  
  const [formData, setFormData] = useState({
    id: "",
    phone: "",
    email: "",
    amount: "",
  });

  const [isAdded, setIsAdded] = useState(false);

  // Cálculos dinámicos basados en el input
  const numericAmount = parseFloat(formData.amount) || 0;
  const iva = numericAmount * 0.16;
  const total = numericAmount + iva;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Si es amount, permitimos solo números y un punto decimal
    if (name === "amount") {
      const sanitized = value.replace(/[^0-9.]/g, '');
      setFormData(prev => ({ ...prev, [name]: sanitized }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const isFormValid = formData.id && formData.phone && formData.email && numericAmount > 0;

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    // Agregar producto personalizado al carrito
    addItem({
      id: `cotizacion-${formData.id}`,
      name: `${t.quote.title} #${formData.id}`,
      description: `Servicio integral personalizado (Folio: ${formData.id})`,
      price: numericAmount,
      type: "service",
    });

    setIsAdded(true);
    
    // Redirigir al checkout después de 1 segundo
    setTimeout(() => {
      router.push("/checkout");
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-background gradient-mesh relative overflow-hidden pt-24 pb-20">
      <div className="grain" />

      {/* Header Minimalista */}
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

      <div className="container mx-auto px-6 max-w-6xl">
        <Link href="/planes" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" />
          {t.checkout.header.back}
        </Link>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Lado Izquierdo: Ilustración y Textos */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <Search className="w-8 h-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-normal">
                {t.quote.title}
              </h1>
            </div>
            
            <div className="space-y-6 text-lg text-muted-foreground mb-12">
              <p>{t.quote.desc1}</p>
              <p>{t.quote.desc2}</p>
            </div>

            {/* Ilustración Vectorial Adaptada a Dark Mode */}
            <div className="relative w-full max-w-md mx-auto aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl opacity-50" />
              <div className="relative z-10 glass-card rounded-3xl p-8 h-full flex flex-col items-center justify-center border-border">
                <div className="w-32 h-32 mb-6 relative">
                  <div className="absolute inset-0 border-4 border-primary rounded-xl rotate-12" />
                  <div className="absolute inset-0 border-4 border-secondary rounded-xl -rotate-6" />
                  <div className="absolute inset-0 glass-card rounded-xl flex items-center justify-center">
                    <Zap className="w-12 h-12 text-gradient" />
                  </div>
                </div>
                <div className="w-full space-y-4">
                  <div className="h-3 w-3/4 bg-border rounded-full mx-auto" />
                  <div className="h-3 w-1/2 bg-border rounded-full mx-auto" />
                  <div className="h-3 w-5/6 bg-border rounded-full mx-auto" />
                </div>
              </div>
            </div>
          </div>

          {/* Lado Derecho: Formulario y Carrito */}
          <div className="glass-card rounded-[2rem] overflow-hidden flex flex-col md:flex-row relative">
            
            {/* Campos del Formulario */}
            <div className="flex-1 p-8 md:p-10 space-y-6">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  {t.quote.form.id}
                </label>
                <input
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  placeholder="Ej: 123"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  {t.quote.form.phone}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="5555555555"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  {t.quote.form.email}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="usuario@email.com"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  {t.quote.form.amount}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <input
                    type="text"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="100.00"
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Resumen Interno */}
              <div className="pt-6 mt-6 border-t border-border space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.quote.form.subtotal}</span>
                  <span>${numericAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.quote.form.taxes}</span>
                  <span>${iva.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-medium pt-3">
                  <span>{t.quote.form.total}</span>
                  <span className="text-gradient">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Panel Lateral: Botón Añadir al carrito */}
            <div className="bg-[#121212] md:w-32 flex flex-col items-center justify-center p-6 border-t md:border-t-0 md:border-l border-border">
              <button
                onClick={handleAddToCart}
                disabled={!isFormValid || isAdded}
                className={`w-full md:h-full py-6 md:py-0 rounded-2xl md:rounded-none flex flex-row md:flex-col items-center justify-center gap-3 transition-all ${
                  isAdded 
                    ? "text-green-500" 
                    : isFormValid 
                      ? "text-foreground hover:text-primary hover:bg-white/5 cursor-pointer" 
                      : "text-muted-foreground opacity-50 cursor-not-allowed"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-6 h-6" />
                    <span className="font-medium text-sm text-center tracking-wide">{t.quote.form.added}</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-6 h-6" />
                    <span className="font-medium text-sm text-center md:-rotate-90 md:translate-y-12 tracking-wide md:whitespace-nowrap">
                      {t.quote.form.add}
                    </span>
                  </>
                )}
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </main>
  );
}
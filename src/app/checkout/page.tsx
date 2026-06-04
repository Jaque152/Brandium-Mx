"use client";

import { ArrowLeft, Check, CreditCard, Lock, Zap, Globe } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useI18n } from "@/context/I18nContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const { t, lang, toggleLanguage } = useI18n();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const [formData, setFormData] = useState({
    email: "", name: "", phone: "",
    address1: "", address2: "", city: "", state: "", zip: "",
    cardNumber: "", cardExpiry: "", cardCvc: "", cardName: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const total = getTotal();
  const iva = total * 0.16;
  const grandTotal = total + iva;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim().slice(0, 19);
    }
    if (name === "cardExpiry") {
      formattedValue = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2").slice(0, 5);
    }
    if (name === "cardCvc") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    }
    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = lang === "es" ? "Requerido" : "Required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = lang === "es" ? "Inválido" : "Invalid";
    if (!formData.name) newErrors.name = lang === "es" ? "Requerido" : "Required";
    if (!formData.phone) newErrors.phone = lang === "es" ? "Requerido" : "Required";
    if (!formData.cardNumber) newErrors.cardNumber = lang === "es" ? "Requerido" : "Required";
    else if (formData.cardNumber.replace(/\s/g, "").length < 15) newErrors.cardNumber = lang === "es" ? "Incompleto" : "Incomplete";
    if (!formData.cardExpiry) newErrors.cardExpiry = lang === "es" ? "Requerido" : "Required";
    if (!formData.cardCvc) newErrors.cardCvc = lang === "es" ? "Requerido" : "Required";
    if (!formData.cardName) newErrors.cardName = lang === "es" ? "Requerido" : "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsProcessing(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData,
          amount: grandTotal,
          description: `Compra de ${items.length} servicios en Brandium Mx`,
        }),
      });
      const result = await res.json();
      
      if (result.success) {
        await fetch('/api/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'checkout', lang, data: { ...formData, grandTotal } })
        });
        setIsProcessing(false);
        setIsComplete(true);
        clearCart();
      } else {
        alert("Hubo un problema con tu pago: " + result.error);
        setIsProcessing(false);
      }
    } catch (error) {
      alert("Error de conexión al procesar el pago.");
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && !isComplete) {
    return (
      <main className="min-h-screen bg-background gradient-mesh relative overflow-hidden pt-24 pb-20">
        <div className="grain" />
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto text-center py-20">
            <h1 className="text-3xl font-normal mb-4">{t.checkout.empty.title}</h1>
            <p className="text-muted-foreground mb-8">{t.checkout.empty.desc}</p>
            <Link href="/planes" className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium inline-flex items-center gap-2">
              {t.checkout.empty.btn}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (isComplete) {
    return (
      <main className="min-h-screen bg-background gradient-mesh relative overflow-hidden pt-24 pb-20">
        <div className="grain" />
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto text-center py-20">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-normal mb-4">
              {t.checkout.success.title1} <span className="text-gradient">{t.checkout.success.title2}</span>
            </h1>
            <p className="text-muted-foreground mb-8">{t.checkout.success.desc}</p>
            <div className="glass-card rounded-2xl p-6 mb-8 text-left">
              <h3 className="font-medium mb-4">{t.checkout.success.stepsTitle}</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3"><span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0">1</span>{t.checkout.success.step1}</li>
                <li className="flex items-start gap-3"><span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0">2</span>{t.checkout.success.step2}</li>
                <li className="flex items-start gap-3"><span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0">3</span>{t.checkout.success.step3}</li>
              </ul>
            </div>
            <Link href="/" className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium inline-flex items-center gap-2">
              {t.checkout.success.btn}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background gradient-mesh relative overflow-hidden pt-24 pb-20">
      <div className="grain" />

      <header className="fixed top-0 left-0 right-0 z-50 glass-card">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Logo Brandium Mx" 
              className="h-10 w-auto object-contain" 
            />
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

      <div className="container mx-auto px-6">
        <Link href="/planes" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          {t.checkout.header.back}
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Formularios */}
          <div>
            <h1 className="text-3xl font-normal mb-8">
              {t.checkout.form.title1} <span className="text-gradient">{t.checkout.form.title2}</span>
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Información de contacto */}
              <div className="glass-card rounded-3xl p-8">
                <h2 className="text-xl mb-6">{t.checkout.form.contactInfo}</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">{t.checkout.form.email}</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl bg-background border ${errors.email ? "border-destructive" : "border-border"} focus:border-primary focus:outline-none`} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">{t.checkout.form.name}</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl bg-background border ${errors.name ? "border-destructive" : "border-border"} focus:border-primary focus:outline-none`} />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">{t.checkout.form.phone}</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl bg-background border ${errors.phone ? "border-destructive" : "border-border"} focus:border-primary focus:outline-none`} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dirección de Facturación */}
              <div className="glass-card rounded-3xl p-8">
                <h2 className="text-xl mb-6">{t.checkout.form.billingInfo}</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">{t.checkout.form.address}</label>
                    <input type="text" name="address1" value={formData.address1} onChange={handleInputChange} placeholder={t.checkout.form.addressPH} className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">{t.checkout.form.address}</label>
                    <input type="text" name="address2" value={formData.address2} onChange={handleInputChange} placeholder={t.checkout.form.addressPH} className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div><label className="block text-sm text-muted-foreground mb-2">{t.checkout.form.city}</label><input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none" /></div>
                    <div><label className="block text-sm text-muted-foreground mb-2">{t.checkout.form.state}</label><input type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none" /></div>
                    <div><label className="block text-sm text-muted-foreground mb-2">{t.checkout.form.zip}</label><input type="text" name="zip" value={formData.zip} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none" /></div>
                  </div>
                </div>
              </div>

              {/* Información de Pago */}
              <div className="glass-card rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6"><CreditCard className="w-6 h-6 text-primary" /><h2 className="text-xl">{t.checkout.form.paymentInfo}</h2></div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">{t.checkout.form.cardNumber}</label>
                    <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl bg-background border ${errors.cardNumber ? "border-destructive" : "border-border"} focus:border-primary focus:outline-none`} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">{t.checkout.form.expiry}</label>
                      <input type="text" name="cardExpiry" value={formData.cardExpiry} onChange={handleInputChange} placeholder="MM/YY" className={`w-full px-4 py-3 rounded-xl bg-background border ${errors.cardExpiry ? "border-destructive" : "border-border"} focus:border-primary focus:outline-none`} />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">{t.checkout.form.cvc}</label>
                      <input type="text" name="cardCvc" value={formData.cardCvc} onChange={handleInputChange} className={`w-full px-4 py-3 rounded-xl bg-background border ${errors.cardCvc ? "border-destructive" : "border-border"} focus:border-primary focus:outline-none`} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">{t.checkout.form.cardName}</label>
                    <input type="text" name="cardName" value={formData.cardName} onChange={handleInputChange} placeholder={t.checkout.form.cardNamePH} className={`w-full px-4 py-3 rounded-xl bg-background border ${errors.cardName ? "border-destructive" : "border-border"} focus:border-primary focus:outline-none`} />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={isProcessing} className="w-full py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:glow-coral transition-all disabled:opacity-50">
                {isProcessing ? (
                  <><div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> {t.checkout.form.processing}</>
                ) : (
                  <><Lock className="w-5 h-5" /> {t.checkout.form.pay} ${grandTotal.toLocaleString()} MXN</>
                )}
              </button>

              {/* Sección de insignias de Etomin en formato SVG */}
              <div className="mt-8 flex flex-col items-center gap-6 pt-6 border-t border-border">
                <div className="flex items-center justify-center gap-4">
                  <img 
                    src="/etomin_secbadge.svg" 
                    alt="Pago Seguro Etomin" 
                    className="h-10 w-auto opacity-80" 
                  />
                  <img 
                    src="/etomin_logo.svg" 
                    alt="Etomin" 
                    className="h-6 w-auto opacity-80" 
                  />
                </div>
                {/* Payment Icons */}
                <div className="flex gap-2">
                  <div className="px-3 py-1.5 bg-white rounded flex items-center justify-center">
                    <svg className="h-4" viewBox="0 0 780 500" fill="none"><rect width="780" height="500" rx="40" fill="white"/><path fill="#1434CB" d="M293.2 348.7l33.3-190.4h53.3l-33.3 190.4h-53.3zM500.8 163c-10.5-3.9-27-8.1-47.6-8.1-52.4 0-89.3 26.4-89.6 64.2-.3 28 26.5 43.6 46.7 52.9 20.7 9.5 27.7 15.6 27.6 24.1-.1 13-16.6 19-31.9 19-21.3 0-32.6-3-50.1-10.3l-6.9-3.1-7.5 43.8c12.4 5.4 35.5 10.1 59.4 10.4 55.7 0 91.9-26.1 92.3-66.5.2-22.2-14-39.1-44.6-53-18.6-9-30-15-29.9-24.1 0-8.1 9.6-16.7 30.5-16.7 17.4-.3 30 3.5 39.8 7.5l4.8 2.3 7.2-42.4h.8zM581.8 158.3h-41c-12.7 0-22.2 3.5-27.8 16.2l-78.8 178.2h55.7l11.1-29.1h68.1l6.5 29.1H624l-42.2-194.4zm-65.6 125.2c4.4-11.2 21.3-54.4 21.3-54.4-.3.5 4.4-11.4 7.1-18.7l3.6 16.9s10.2 46.6 12.4 56.2h-44.4z"/><path fill="#1434CB" d="M239.5 158.3L187.4 289l-5.5-26.8c-9.6-30.7-39.5-64-73-80.6l47.5 166.9h56l83.2-190.2h-56.1z"/><path fill="#F7B600" d="M146.9 158.3H61.3l-.6 3.5c66.4 16 110.3 54.7 128.5 101.2l-18.5-88.8c-3.2-12.1-12.5-15.5-23.8-15.9z"/></svg>
                  </div>
                  <div className="px-3 py-1.5 bg-white rounded flex items-center justify-center">
                    <svg className="h-4" viewBox="0 0 152 100" fill="none"><rect width="152" height="100" rx="8" fill="white"/><circle cx="55" cy="50" r="30" fill="#EB001B"/><circle cx="97" cy="50" r="30" fill="#F79E1B"/><path d="M76 27.5C82.6 32.8 87 40.8 87 50C87 59.2 82.6 67.2 76 72.5C69.4 67.2 65 59.2 65 50C65 40.8 69.4 32.8 76 27.5Z" fill="#FF5F00"/></svg>
                  </div>
                </div>
              </div>

            </form>
          </div>

          {/* Resumen del Pedido */}
          <div>
            <div className="glass-card rounded-3xl p-8 sticky top-24">
              <h2 className="text-xl mb-6">{t.checkout.summary.title}</h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.quantity > 1 && `${item.quantity}x `}{item.description}</p>
                    </div>
                    <span className="font-medium">${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t.cart.subtotal}</span><span>${total.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t.cart.iva}</span><span>${iva.toLocaleString()}</span></div>
                <div className="flex justify-between text-lg font-medium pt-2 border-t border-border"><span>{t.cart.total}</span><span className="text-gradient">${grandTotal.toLocaleString()} MXN</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
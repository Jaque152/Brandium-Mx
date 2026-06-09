"use client";

import { ArrowRight, Check, Clock, Mail, MapPin, MessageSquare, Phone, Send, Sparkles, Zap, Globe } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/context/I18nContext";

export default function ContactoPage() {
  const { t, lang, toggleLanguage } = useI18n();
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = lang === "es" ? "Requerido" : "Required";
    if (!formData.email) newErrors.email = lang === "es" ? "Requerido" : "Required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = lang === "es" ? "Inválido" : "Invalid";
    if (!formData.message) newErrors.message = lang === "es" ? "Requerido" : "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'contact', lang, data: formData })
      });
      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (error) {
      alert(lang === "es" ? "Hubo un error al enviar tu mensaje." : "There was an error sending your message.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background gradient-mesh relative overflow-hidden pt-24 pb-20">
      <div className="grain" />

      {/* Header */}
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
              <Link href="/#services" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t.nav.services}</Link>
              <Link href="/planes" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t.nav.plans}</Link>
              <Link href="/contacto" className="text-foreground text-sm">{t.nav.contact}</Link>
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
            {t.contact.title1} <span className="text-gradient italic">{t.contact.title2}</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t.contact.desc}</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            {isSubmitted ? (
              <div className="glass-card rounded-3xl p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-normal mb-4">
                  {t.contact.success.title} <span className="text-gradient">{t.contact.success.title2}</span>
                </h2>
                <p className="text-muted-foreground mb-8">{t.contact.success.desc}</p>
                <button
                  onClick={() => { setIsSubmitted(false); setFormData({ name: "", email: "", phone: "", message: "" }); }}
                  className="px-6 py-3 rounded-full glass-card hover:bg-white/5 transition-colors"
                >
                  {t.contact.success.btn}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8">
                <h2 className="text-2xl mb-8">{t.contact.form.title}</h2>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">{t.contact.form.name}</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder={t.contact.form.placeholderName} className={`w-full px-4 py-3 rounded-xl bg-background border ${errors.name ? "border-destructive" : "border-border"} focus:border-primary focus:outline-none transition-colors`} />
                    {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">{t.contact.form.email}</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder={t.contact.form.placeholderEmail} className={`w-full px-4 py-3 rounded-xl bg-background border ${errors.email ? "border-destructive" : "border-border"} focus:border-primary focus:outline-none transition-colors`} />
                    {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm text-muted-foreground mb-2">{t.contact.form.phone}</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+52 55 1234 5678" className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:outline-none transition-colors" />
                </div>

                <div className="mb-6">
                  <label className="block text-sm text-muted-foreground mb-2">{t.contact.form.message}</label>
                  <textarea name="message" value={formData.message} onChange={handleInputChange} rows={5} placeholder={t.contact.form.placeholderMessage} className={`w-full px-4 py-3 rounded-xl bg-background border ${errors.message ? "border-destructive" : "border-border"} focus:border-primary focus:outline-none transition-colors resize-none`} />
                  {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:glow-coral transition-all disabled:opacity-50">
                  {isSubmitting ? (
                    <><div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> {t.contact.form.sending}</>
                  ) : (
                    <><Send className="w-5 h-5" /> {t.contact.form.submit}</>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-3xl p-8">
              <h3 className="text-xl mb-6">{t.contact.info.title}</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><Phone className="w-5 h-5 text-primary" /></div>
                  <div><p className="text-sm text-muted-foreground">{t.contact.info.phone}</p><p className="font-medium">+52 1 55 5553 0454</p></div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><Mail className="w-5 h-5 text-primary" /></div>
                  <div><p className="text-sm text-muted-foreground">{t.contact.info.email}</p><p className="font-medium">techdesk@brandiumx.com</p></div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"><MapPin className="w-5 h-5 text-primary" /></div>
                  <div><p className="text-sm text-muted-foreground">{t.contact.info.office}</p><p className="font-medium">Av. Tamaulipas 150, Piso 18<br />Col. Hipódromo, CDMX 06100</p></div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
              <div className="relative z-10">
                <Sparkles className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl mb-3">{t.contact.cta.title}</h3>
                <p className="text-muted-foreground text-sm mb-6">{t.contact.cta.desc}</p>
                <Link href="/planes" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium hover:glow-coral transition-all">
                  {t.contact.cta.btn}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
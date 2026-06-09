"use client";

import { ArrowRight, BarChart3, Bell, CheckCircle2, Lightbulb, Mail, MapPin, Menu, MessageSquare, Phone, Sparkles, Target, TrendingUp, Users, Globe } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/context/I18nContext";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const { t, lang, toggleLanguage } = useI18n();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#services", label: t.nav.services },
    { href: "/planes", label: t.nav.plans },
    { href: "#about", label: t.nav.about },
    { href: "/contacto", label: t.nav.contact },
  ];

  return (
    <main className="min-h-screen bg-background gradient-mesh relative overflow-hidden">
      <div className="grain" />

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass-card shadow-lg" : "bg-transparent"}`}>
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Logo Brandium Mx" 
              className="h-10 w-auto object-contain" 
            />
            <span className="text-xl font-semibold tracking-tight">Brandium Mx</span>
          </div>
          
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground transition-colors text-sm relative group">
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-4">
              <button onClick={toggleLanguage} className="p-2 glass-card rounded-full flex items-center gap-2 text-sm hover:text-primary transition-colors">
                <Globe className="w-4 h-4" />
                {lang === "es" ? "EN" : "ES"}
              </button>
              <Link href="/planes" className="hidden sm:block px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity">
                {t.nav.start}
              </Link>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <button className="md:hidden p-2 rounded-lg glass-card">
                    <Menu className="w-5 h-5" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] bg-background border-border">
                  <div className="flex flex-col gap-8 mt-8">
                    <nav className="flex flex-col gap-4">
                      {navLinks.map((link) => (
                        <SheetClose asChild key={link.href}>
                          <Link href={link.href} className="text-lg text-muted-foreground hover:text-foreground transition-colors py-2 border-b border-border">
                            {link.label}
                          </Link>
                        </SheetClose>
                      ))}
                    </nav>
                    <SheetClose asChild>
                      <Link href="/planes" className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium text-center">
                        {t.nav.startNow}
                      </Link>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-44 md:pb-32 relative">
        <div className="absolute top-40 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-glow mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">{t.home.hero.badge}</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-normal leading-[0.95] mb-6">
              {t.home.hero.title1}{" "}
              <span className="text-gradient italic">{t.home.hero.title2}</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              {t.home.hero.desc}
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 md:py-32 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
              <Target className="w-4 h-4 text-secondary" />
              <span className="text-sm text-muted-foreground">{t.home.services.badge}</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal mb-6">
              {t.home.services.title1}{" "}
              <span className="text-gradient">{t.home.services.title2}</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t.home.services.desc}
            </p>
          </div>

          <div className="mt-20 relative">
            <div className="max-w-3xl mx-auto">
              <div className="glass-card rounded-3xl p-6 md:p-8 glow-coral floating">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <div className="w-3 h-3 rounded-full bg-secondary" />
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                </div>
                <div className="grid grid-cols-3 gap-3 md:gap-6">
                  <div className="glass-card rounded-2xl p-4 md:p-6 text-center">
                    <div className="text-2xl md:text-3xl font-normal text-gradient mb-2">{t.home.services.card1Title}</div>
                    <p className="text-xs md:text-sm text-muted-foreground">{t.home.services.card1Desc}</p>
                  </div>
                  <div className="glass-card rounded-2xl p-4 md:p-6 text-center">
                    <div className="text-2xl md:text-3xl font-normal text-gradient mb-2">{t.home.services.card2Title}</div>
                    <p className="text-xs md:text-sm text-muted-foreground">{t.home.services.card2Desc}</p>
                  </div>
                  <div className="glass-card rounded-2xl p-4 md:p-6 text-center">
                    <div className="text-2xl md:text-3xl font-normal text-gradient mb-2">{t.home.services.card3Title}</div>
                    <p className="text-xs md:text-sm text-muted-foreground">{t.home.services.card3Desc}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 md:py-32 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">{t.home.about.badge}</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-normal mb-8 leading-tight">
                {t.home.about.title1}{" "}
                <span className="text-gradient italic">{t.home.about.title2}</span>
              </h2>

              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>{t.home.about.desc1}</p>
                <p>{t.home.about.desc2}</p>
              </div>

              <Link href="/contacto" className="group mt-10 px-8 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium flex items-center gap-3 inline-flex">
                {t.home.about.btn}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="order-1 lg:order-2 relative">
              <div className="glass-card rounded-3xl p-6 relative z-10">
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800&auto=format&fit=crop" 
                    alt="Analítica y estrategia de redes sociales"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 md:py-32 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">{t.home.features.badge}</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal mb-6 max-w-4xl mx-auto leading-tight">
              {t.home.features.title1} {" "}
              <span className="text-gradient">{t.home.features.title2}</span>
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              {t.home.features.desc}
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="group glass-card rounded-3xl p-8 flex items-start gap-6 hover:glow-coral transition-all duration-500 relative overflow-hidden">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl mb-3">{t.home.features.f1Title}</h3>
                <p className="text-muted-foreground leading-relaxed">{t.home.features.f1Desc}</p>
              </div>
            </div>

            <div className="group glass-card rounded-3xl p-8 flex items-start gap-6 hover:glow-gold transition-all duration-500">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <h3 className="text-2xl mb-3">{t.home.features.f2Title}</h3>
                <p className="text-muted-foreground leading-relaxed">{t.home.features.f2Desc}</p>
              </div>
            </div>

            <div className="group glass-card rounded-3xl p-8 flex items-start gap-6 hover:glow-coral transition-all duration-500">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl mb-3">{t.home.features.f3Title}</h3>
                <p className="text-muted-foreground leading-relaxed">{t.home.features.f3Desc}</p>
              </div>
            </div>

            <div className="group glass-card rounded-3xl p-8 flex items-start gap-6 hover:glow-gold transition-all duration-500">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <h3 className="text-2xl mb-3">{t.home.features.f4Title}</h3>
                <p className="text-muted-foreground leading-relaxed">{t.home.features.f4Desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 relative">
        <div className="container mx-auto px-6">
          <div className="glass-card rounded-[2.5rem] p-12 md:p-16 lg:p-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">{t.home.cta.badge}</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal mb-8">
                {t.home.cta.title1}{" "}
                <span className="text-gradient italic">{t.home.cta.title2}</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
                {t.home.cta.desc}
              </p>
              <Link href="/planes" className="group px-10 py-5 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium text-lg flex items-center gap-3 mx-auto hover:glow-coral transition-all">
                {t.nav.startNow}
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-16 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img 
                  src="/logo.png" 
                  alt="Logo Brandium Mx" 
                  className="h-10 w-auto object-contain" 
                />
                <span className="text-xl font-semibold tracking-tight">Brandium Mx</span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md">
                {t.home.footer.desc}
              </p>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-6">{t.nav.contact}</h4>
              <div className="space-y-4">
                <a href="tel:+525555530454" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>+52 1 55 5553 0454</span>
                </a>
                <a href="mailto:techdesk@brandiumx.com" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>techdesk@brandiumx.com</span>
                </a>
                <div className="flex items-start gap-3 text-muted-foreground">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Avenida Tamaulipas, No. 150, Piso 18, Colonia Hipodromo, CDMX</span>
                </div>
              </div>
            </div>

            {/* SECCIÓN LEGAL ACTUALIZADA CON ENLACES */}
            <div>
              <h4 className="text-lg font-medium mb-6">{t.home.footer.legal}</h4>
              <div className="space-y-4">
                <Link href="/privacidad" className="block text-muted-foreground hover:text-foreground transition-colors">
                  {t.home.footer.privacy}
                </Link>
                <Link href="/terminos" className="block text-muted-foreground hover:text-foreground transition-colors">
                  {t.home.footer.terms}
                </Link>
                <Link href="/cancelaciones" className="block text-muted-foreground hover:text-foreground transition-colors">
                  {t.home.footer.cancel}
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} <span className="font-medium text-foreground">Brandium Mx</span>. {t.home.footer.rights}
            </p>
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
        </div>
      </footer>

    </main>
  );
}
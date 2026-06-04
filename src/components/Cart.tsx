"use client";

import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { useI18n } from "@/context/I18nContext";
import Link from "next/link";

export function Cart() {
  const { items, removeItem, updateQuantity, getTotal, getItemCount, clearCart } = useCart();
  const { t, lang } = useI18n();
  
  const itemCount = getItemCount();
  
  // Cálculo de IVA
  const subtotal = getTotal();
  const iva = subtotal * 0.16;
  const grandTotal = subtotal + iva;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:glow-coral transition-all group">
          <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-secondary text-secondary-foreground text-xs font-bold flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[400px] bg-background border-border flex flex-col">
        <div className="flex items-center justify-between mb-6 mt-4">
          <h2 className="text-2xl font-normal">
            {lang === "es" ? "Tu Carrito" : "Your Cart"}
          </h2>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-sm text-muted-foreground hover:text-destructive transition-colors"
            >
              {lang === "es" ? "Vaciar carrito" : "Clear cart"}
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <ShoppingCart className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-2">{t.cart.empty}</p>
            <p className="text-sm text-muted-foreground/70">
              {t.cart.explore}
            </p>
            <SheetClose asChild>
              <Link
                href="/planes"
                className="mt-6 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium"
              >
                {lang === "es" ? "Ver planes" : "View plans"}
              </Link>
            </SheetClose>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="glass-card rounded-2xl p-4 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {item.features && item.features.length > 0 && (
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {item.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg glass-card flex items-center justify-center hover:bg-white/10 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg glass-card flex items-center justify-center hover:bg-white/10 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-gradient font-medium">
                      ${(item.price * item.quantity).toLocaleString()} MXN
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desglose de Totales e IVA */}
            <div className="border-t border-border pt-4 mt-4 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{t.cart.subtotal}</span>
                <span className="font-medium">${subtotal.toLocaleString()} MXN</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">{t.cart.iva}</span>
                <span className="font-medium">${iva.toLocaleString()} MXN</span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-muted-foreground font-medium">{t.cart.total}</span>
                <span className="text-xl font-medium text-gradient">
                  ${grandTotal.toLocaleString()} MXN
                </span>
              </div>
            
              
              <SheetClose asChild>
                <Link
                  href="/checkout"
                  className="w-full mt-4 px-6 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:glow-coral transition-all"
                >
                  {t.cart.checkout}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </SheetClose>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
import type { Metadata } from "next";
import "./globals.css";
import { ClientBody } from "./ClientBody";
import { CartProvider } from "@/context/CartContext";
import { Cart } from "@/components/Cart";
import { I18nProvider } from "@/context/I18nContext";

export const metadata: Metadata = {
  title: "Brandium Mx | Publicidad y marketing de impacto",
  description: "Impulsa tu marca con estrategias digitales basadas en datos. En Brandium Mx optimizamos campañas, automatizamos procesos y diseñamos publicidad que genera resultados medibles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <I18nProvider>
        <ClientBody>
          <CartProvider>
            {children}
            <Cart />
          </CartProvider>
        </ClientBody>
      </I18nProvider>
    </html>
  );
}


import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AeroSearch - Agregador de Passagens Aéreas",
  description: "Encontre voos reais com transparência e redirecionamento direto para compra.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased min-h-screen flex flex-col">{children}</body>
    </html>
  );
}


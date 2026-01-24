import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Para-plus.tn - Marketplace Parapharmacie et Matériel Médical",
  description: "Marketplace tunisienne pour produits parapharmacie, pharmacie, matériel médical et location de matériel paramédical",
  keywords: ["parapharmacie", "pharmacie", "matériel médical", "Tunisie", "location matériel"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

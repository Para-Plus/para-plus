import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Header from "@/components/Header";

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
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  return (
    <html lang="fr">
      <body className={`${inter.variable} font-sans antialiased`}>
        <GoogleOAuthProvider clientId={googleClientId}>
          <AuthProvider>
            <Header />
            {children}
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}

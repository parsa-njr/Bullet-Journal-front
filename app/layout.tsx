import type { Metadata } from "next";
import { Vazirmatn, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/features/auth/AuthContext";

// Vazirmatn فونتی مدرن با پشتیبانی کامل از فارسی است؛
// برای هدرها با وزن بالاتر و برای متن بدنه با وزن معمولی استفاده می‌شود
const display = Vazirmatn({
  subsets: ["arabic"],
  weight: ["600", "800"],
  variable: "--font-display",
});
const body = Vazirmatn({ subsets: ["arabic"], weight: ["400", "500"], variable: "--font-body" });
// JetBrains Mono فقط برای اعداد/تاریخ لاتین (مثلا نمایش تاریخ میلادی) به کار می‌رود
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "بولت ژورنال من",
  description: "برنامه‌ریز روزانه، هفتگی و ماهانه به سبک بولت ژورنال",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${display.variable} ${body.variable} ${mono.variable} font-body`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

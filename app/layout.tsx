import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Mono, Instrument_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { SITE } from "@/lib/site";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-display",
});
const body = Instrument_Sans({ subsets: ["latin"], display: "swap", variable: "--font-body" });
const mono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: SITE.title,
  description: SITE.description,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#E6E9E8" },
    { media: "(prefers-color-scheme: dark)", color: "#0E1514" },
  ],
};

/* Runs before first paint. "seen" skips the lift intro on a repeat visit in the same tab,
   "anim" arms the entrance animations unless reduced motion is on, and "go" releases the
   hero once the intro is out of the way. Without JavaScript none are set and the page
   is simply visible. */
const boot = `(function(){var d=document.documentElement,s=false,r=false;try{r=matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){}try{if(sessionStorage.getItem("jc-seen")){s=true}else{sessionStorage.setItem("jc-seen","1")}}catch(e){}if(s)d.classList.add("seen");if(!r)d.classList.add("anim");setTimeout(function(){d.classList.add("go")},r||s?60:1250)})()`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

import "./globals.css";

export const metadata = { title: "Its-tech — Editorial Research Engine", description: "Source-first technology research and editorial workflow" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
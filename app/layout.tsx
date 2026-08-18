import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import SmoothScrolling from "@/components/SmoothScrolling";
import SiteLoader from "@/components/SiteLoader";

export const metadata: Metadata = {
  title: "SAPHEX Labs — Magic as a Service",
  description:
    "SAPHEX Labs is an engineering team that specializes in AI & Video Technology. Based in Bangalore, India. Tinkering since 2022.",
  openGraph: {
    title: "SAPHEX Labs — Magic as a Service",
    description:
      "SAPHEX Labs is an engineering team that specializes in AI & Video Technology.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,300;1,400;1,600&family=Instrument+Sans:wght@300;400;500&family=Fraunces:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SiteLoader>
          <SmoothScrolling>
            <CustomCursor />
            {children}
          </SmoothScrolling>
        </SiteLoader>
      </body>
    </html>
  );
}

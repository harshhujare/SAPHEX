import SaphexHero from "@/components/clone/SaphexHero";
import WhatWeDo from "@/components/WhatWeDo";
import AILandscape from "@/components/AILandscape";
import ProcessSection from "@/components/ProcessSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <SaphexHero />
      <WhatWeDo />
      <AILandscape />
      <ProcessSection />
      <ContactSection />
      <Footer />
    </main>
  );
}

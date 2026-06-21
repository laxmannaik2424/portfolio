import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Works from "@/components/sections/Works";
import Services from "@/components/sections/Services";
import Exhibitions from "@/components/sections/Exhibitions";
import Footer from "@/components/sections/Footer";
import FloatingInstagram from "@/components/FloatingInstagram";
import FloatingWhatsapp from "@/components/FloatingWhatsapp";
import connectToDatabase from "@/lib/mongodb";
import { PortfolioContent } from "@/lib/models";
import ClientAppWrapper from "@/components/ClientAppWrapper";

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Force dynamic rendering so updates reflect instantly without rebuilding

export default async function Home() {
  let content = null;
  
  try {
    await connectToDatabase();
    const doc = await PortfolioContent.findOne();
    if (doc) {
      // Convert mongoose document to plain object to pass as props safely
      content = JSON.parse(JSON.stringify(doc));
    }
  } catch (error) {
    console.warn("Failed to fetch MongoDB content.");
  }

  // Fallback to empty objects if content missing
  const data = content || {};

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Prince Lucky',
    image: 'https://princelucky.co.in/icon.svg',
    description: 'Expert mobile videographer & cinematographer based in Gokak, Belagavi, Karnataka.',
    url: 'https://princelucky.co.in',
    telephone: data.socials?.whatsapp ? data.socials.whatsapp.split('/').pop() : '+910000000000',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Gokak',
      addressRegion: 'Karnataka',
      addressCountry: 'IN'
    },
    sameAs: [
      data.socials?.instagram || 'https://instagram.com/prince_lucky_42'
    ]
  };

  return (
    <ClientAppWrapper>
      <main className="w-full min-h-screen relative flex flex-col overflow-x-hidden bg-[#c0c0c0]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <Hero data={data.hero} />
        
        {/* About Section */}
        <About data={data.about} />
        
        {/* Works Section */}
        <Works data={data.works} />
        
        {/* Services Section */}
        <Services data={data.services} />
        
        {/* Exhibitions Section */}
        <Exhibitions data={data.exhibitions} />

        {/* Footer Section */}
        <Footer data={data.footer} socials={data.socials} />

        {data.socials?.enableInstagram !== false && (
          <FloatingInstagram link={data.socials?.instagram} />
        )}
        {data.socials?.enableWhatsapp !== false && (
          <FloatingWhatsapp link={data.socials?.whatsapp} />
        )}
      </main>
    </ClientAppWrapper>
  );
}




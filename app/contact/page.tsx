import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#c0c0c0] text-black flex flex-col relative overflow-hidden">
      {/* Back Button */}
      <div className="absolute top-8 left-8 md:top-12 md:left-12 z-10">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-sm font-bold tracking-widest uppercase hover:text-[#cc0000] transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-0">
        <h1 className="text-[12vw] leading-none font-bold tracking-tighter uppercase mb-8 hover:scale-105 transition-transform duration-500">
          CONTACT
        </h1>
        
        <div className="max-w-md w-full space-y-6">
          <p className="text-lg font-medium tracking-wide">
            Let&apos;s create something extraordinary together.
          </p>
          
          <a 
            href="mailto:contact@princelucky.com" 
            className="block w-full py-4 px-8 bg-black text-white text-xl font-bold tracking-widest uppercase hover:bg-[#cc0000] transition-colors rounded-full"
          >
            Send an Email
          </a>
          
          <div className="pt-8">
            <div className="font-['Brush_Script_MT','Brush_Script_Std',cursive] text-4xl text-[#cc0000]">
              Guent
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

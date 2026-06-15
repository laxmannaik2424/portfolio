import Image from 'next/image'
import Link from 'next/link'

export interface FooterProps {
  data?: {
    mediaUrl?: string;
    mediaPublicId?: string;
    mobileMediaUrl?: string;
    mobileMediaPublicId?: string;
    email?: string;
    mobile?: string;
  };
  socials?: {
    instagram?: string;
    whatsapp?: string;
    enableWhatsapp?: boolean;
  };
}

export default function Footer({ data, socials }: FooterProps) {
  const mediaUrl = data?.mediaUrl || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600&grayscale=true"
  const isVideo = mediaUrl.match(/\.(mp4|webm|ogg)$/i)
  
  const mobileMediaUrl = data?.mobileMediaUrl || mediaUrl
  const isMobileVideo = mobileMediaUrl.match(/\.(mp4|webm|ogg)$/i)

  return (
    <footer id="contact" className="relative w-full min-h-[50vh] md:min-h-[70vh] bg-black overflow-hidden flex flex-col justify-end">
      
      {/* 
        LAYER 1: The Wide Angled Image 
        This is the absolute lowest layer. It replaces the old black background entirely.
        Because it fills the footer, it acts as the background for the bottom half AND shows through the text!
      */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Desktop Media */}
        <div className="hidden md:block w-full h-full absolute inset-0">
          {isVideo ? (
            <video 
              src={mediaUrl}
              className="w-full h-full object-cover object-center md:object-bottom grayscale"
              autoPlay muted loop playsInline
            />
          ) : (
            <Image 
              src={mediaUrl} 
              alt="Contact Background" 
              fill 
              className="object-cover object-center md:object-bottom grayscale"
            />
          )}
        </div>

        {/* Mobile Media */}
        <div className="block md:hidden w-full h-full absolute inset-0">
          {isMobileVideo ? (
            <video 
              src={mobileMediaUrl}
              className="w-full h-full object-cover object-center grayscale"
              autoPlay muted loop playsInline
            />
          ) : (
            <Image 
              src={mobileMediaUrl} 
              alt="Contact Background Mobile" 
              fill 
              className="object-cover object-center grayscale"
            />
          )}
        </div>
      </div>

      {/* 
        LAYER 2: SVG Masked Gray Background & Red Circle
        This sits on top of the image. The text "CONTACT" is punched out as a transparent hole.
        The Gray background is drawn ONLY down to the text baseline, 
        meaning the bottom half of the footer exposes the raw image seamlessly!
      */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* ClipPath ensures the gray background and red circle STRICTLY end just above the text baseline (47.5%),
                which completely eliminates any gray subpixel border under the flat letters (NTAT) */}
            <clipPath id="topHalfClip">
              <rect width="100%" height="47.5%" />
            </clipPath>

            <mask id="contactMask">
              {/* White makes the mask solid (Gray layer is visible) */}
              <rect width="100%" height="100%" fill="white" />
              
              {/* Black punches a hole (Opacity 0), revealing the image underneath.
                  y="48%" acts as the exact bottom baseline of the text. */}
              <text 
                x="50%" 
                y="48%" 
                textAnchor="middle" 
                className="text-[22.5vw] md:text-[21.5vw] font-black tracking-tighter font-sans"
                fontWeight="900"
                fill="black"
                letterSpacing="-0.02em"
              >
                CONTACT
              </text>
            </mask>
          </defs>
          
          <g mask="url(#contactMask)" clipPath="url(#topHalfClip)">
            {/* Solid Gray Background. The clipPath chops it exactly at 47.5% */}
            <rect width="100%" height="100%" fill="#c0c0c0" />
            
            {/* Mobile Red Circle 
                Increased size (12vw), moved downwards (cy 35%) */}
            <ellipse 
              className="md:hidden"
              cx="75%" 
              cy="35%" 
              rx="12vw" 
              ry="12vw" 
              fill="#cc0000" 
            />
            
            {/* Desktop Red Circle 
                Increased size (9vw), moved upwards (cy 24%) */}
            <ellipse 
              className="hidden md:inline"
              cx="74%" 
              cy="24%" 
              rx="9vw" 
              ry="9vw" 
              fill="#cc0000" 
            />
          </g>
        </svg>
      </div>

      {/* 
        LAYER 3: Contact Cards & Info (Mobile) & Email/Phone
      */}
      <div className="relative z-40 w-full flex flex-col items-center justify-end px-6 md:px-16 mt-auto">
        
        {/* Email & Phone Text (Centered) */}
        <div className="flex flex-col items-center gap-2 mb-12 md:mb-16 mt-32 md:mt-48 mix-blend-difference text-white">
          {data?.email && (
            <a href={`mailto:${data.email}`} className="text-sm md:text-xl font-bold tracking-widest hover:text-[#cc0000] transition-colors uppercase">
              {data.email}
            </a>
          )}
          {data?.mobile && (
            <a href={`tel:${data.mobile.replace(/ /g,'')}`} className="text-sm md:text-xl font-bold tracking-widest hover:text-[#cc0000] transition-colors uppercase">
              {data.mobile}
            </a>
          )}
        </div>

        {/* Mobile-only Big Social Cards */}
        <div className="flex md:hidden w-full gap-4 mb-10 max-w-[400px]">
          <a 
            href={socials?.instagram || "https://instagram.com"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-white/20 transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            <span className="text-white text-xs font-bold tracking-widest uppercase">Instagram</span>
          </a>
          <a 
            href={socials?.whatsapp || "https://wa.me/"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 bg-[#25D366]/80 backdrop-blur-md border border-[#25D366] rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-[#25D366] transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            <span className="text-white text-xs font-bold tracking-widest uppercase">WhatsApp</span>
          </a>
        </div>

        {/* 
          LAYER 4: Footer Navigation 
        */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center pb-12 gap-8 md:gap-0">
          <div className="flex flex-wrap justify-center md:flex-nowrap md:justify-between w-full text-white/70 hover:text-white text-[10px] md:text-xs font-bold tracking-widest uppercase gap-x-8 gap-y-6 md:gap-0">
            <Link href="#about" className="hover:text-white transition-colors">ABOUT ME</Link>
            <Link href="#works" className="hover:text-white transition-colors">MY WORKS</Link>
            <Link href="#services" className="hover:text-white transition-colors">MY SERVICES</Link>
            <Link href="#contact" className="hover:text-white transition-colors">CONTACT ME</Link>
          </div>
        </div>
      </div>

    </footer>
  )
}

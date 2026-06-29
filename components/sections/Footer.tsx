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
  const isVideo = mediaUrl.match(/(\/video\/upload\/|\.(mp4|webm|ogg|mov|avi|mkv|qt)$)/i)
  
  const mobileMediaUrl = data?.mobileMediaUrl || ""
  const isMobileVideo = mobileMediaUrl ? mobileMediaUrl.match(/(\/video\/upload\/|\.(mp4|webm|ogg|mov|avi|mkv|qt)$)/i) : false

  return (
    <footer id="contact" className="relative w-full min-h-[50vh] md:min-h-[70vh] bg-black flex flex-col justify-end">
      
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
          {mobileMediaUrl ? (
            isMobileVideo ? (
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
            )
          ) : (
            <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700 text-xs tracking-widest uppercase">
              No Mobile Media
            </div>
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
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
          <defs>
            {/* ClipPath ensures the gray background and red circle STRICTLY end just above the text baseline (47.5%),
                but we allow it to extend upwards infinitely (y="-50%") so the circles can overlap the top section */}
            <clipPath id="topHalfClip">
              <rect x="-50%" y="-50%" width="200%" height="97.5%" />
            </clipPath>

            <mask id="contactMask">
              {/* White makes the mask solid. We extend it to -50% y so it doesn't mask out the top overlaps */}
              <rect x="-50%" y="-50%" width="200%" height="200%" fill="white" />
              
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
                Moved upwards and leftwards via transform */}
            <ellipse 
              className="md:hidden"
              cx="75%" 
              cy="35%" 
              rx="12vw" 
              ry="12vw" 
              fill="#cc0000" 
              style={{ transform: 'translate(-20px, -10px)' }}
            />
            
            {/* Desktop Red Circle 
                Moved upwards and leftwards via transform */}
            <ellipse 
              className="hidden md:inline"
              cx="74%" 
              cy="24%" 
              rx="9vw" 
              ry="9vw" 
              fill="#cc0000" 
              style={{ transform: 'translate(-20px, -10px)' }}
            />
          </g>
        </svg>
      </div>

      {/* 
        LAYER 3: Footer Navigation 
        Sits on top of the image at the very bottom.
      */}
      <div className="relative z-40 w-full flex flex-col md:flex-row justify-between items-center px-8 md:px-16 pb-12 gap-8 md:gap-0 mt-auto">
        <div className="flex flex-wrap justify-center md:flex-nowrap md:justify-between w-full text-white/70 hover:text-white text-[10px] md:text-xs font-bold tracking-widest uppercase gap-x-8 gap-y-6 md:gap-0">
          <Link href="#about" className="hover:text-white transition-colors">ABOUT ME</Link>
          <Link href="#works" className="hover:text-white transition-colors">MY WORKS</Link>
          <Link href="#services" className="hover:text-white transition-colors">MY SERVICES</Link>
          <Link href="#contact" className="hover:text-white transition-colors">CONTACT ME</Link>
        </div>
      </div>

    </footer>
  )
}

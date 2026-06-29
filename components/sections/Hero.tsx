'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export interface HeroProps {
  data?: {
    topSubheading?: string;
    mainTitle?: string;
    signature?: string;
    signatureSubtext?: string;
    mediaUrl?: string;
    mediaPublicId?: string;
    mobileMediaUrl?: string;
    mobileMediaPublicId?: string;
  }
}

export default function Hero({ data }: HeroProps) {
  // Hardcoded to strictly prevent admin from changing the main hero text
  const mainTitle = "LUCKY"
  const signature = "LS"
  const topSubheadingLines = (data?.topSubheading || "AN AWARD-WINNING\nPHOTOGRAPHER WHOSE LENS\nTRANSFORMS MOMENTS INTO\nTIMELESS MASTERPIECES").split('\n')
  const signatureSubtextLines = (data?.signatureSubtext || "SCROLL\nMORE").split('\n')
  const mediaUrl = data?.mediaUrl || "/hero.jpeg"
  const isVideo = mediaUrl.match(/(\/video\/upload\/|\.(mp4|webm|ogg|mov|avi|mkv|qt)$)/i)
  
  const mobileMediaUrl = data?.mobileMediaUrl || ""
  const isMobileVideo = mobileMediaUrl ? mobileMediaUrl.match(/(\/video\/upload\/|\.(mp4|webm|ogg|mov|avi|mkv|qt)$)/i) : false

  return (
    <section 
      id="home" 
      className="relative w-full min-h-[calc(100vh-110px)] md:min-h-screen flex flex-col justify-center text-white"
    >
      {/* Left Text Block */}
      <div className="absolute top-32 left-8 md:left-16 z-20 text-[10px] md:text-[11px] leading-relaxed tracking-wider uppercase text-[#a3a3a3] font-semibold flex flex-col">
        {topSubheadingLines.map((line, i) => <span key={i}>{line}</span>)}
      </div>
      
      {/* Right Text Block */}
      <div className="absolute top-[45%] right-8 md:right-16 z-20 text-[10px] md:text-[11px] leading-snug tracking-wider uppercase text-[#a3a3a3] font-semibold text-right">
        {signatureSubtextLines.map((line, i) => <span key={i}>{line}<br/></span>)}
      </div>

      {/* Main Portrait - FULL WIDTH */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative w-full h-full"
        >
          {/* Desktop Media */}
          <div className="hidden md:block w-full h-full absolute inset-0">
            {isVideo ? (
              <video 
                src={mediaUrl}
                className="w-full h-full object-cover object-top grayscale brightness-50 contrast-125"
                autoPlay muted loop playsInline
              />
            ) : (
              <Image 
                src={mediaUrl} 
                alt="Hero Portrait" 
                fill 
                className="object-cover object-top grayscale brightness-50 contrast-125"
                priority
              />
            )}
          </div>
          
          {/* Mobile Media */}
          <div className="block md:hidden w-full h-full absolute inset-0">
            {isMobileVideo ? (
              <video 
                src={mobileMediaUrl}
                className="w-full h-full object-cover object-top grayscale brightness-50 contrast-125"
                autoPlay muted loop playsInline
              />
            ) : (
              <Image 
                src={mobileMediaUrl} 
                alt="Hero Portrait Mobile" 
                fill 
                className="object-cover object-top grayscale brightness-50 contrast-125"
                priority
              />
            )}
          </div>
        </motion.div>
      </div>

      {/* Huge Cutout Title & Red Circle container */}
      <div className="absolute bottom-0 left-0 w-full z-40 pointer-events-none flex flex-col items-center justify-end">
        
        {/* Text container for precise signature positioning */}
        <div className="relative w-full">
          {/* SVG Mask for Cutout Text */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-full"
          >
            <svg className="w-full h-[35vw] md:h-[18vw] overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 230">
              <defs>
                <mask id="textMask">
                  {/* White rect to reveal text cutout */}
                  <rect x="-50%" y="-100%" width="200%" height="500%" fill="white" />
                  
                  {/* Mobile Text - Stretched horizontally to touch the screen edges */}
                  <text 
                    className="md:hidden"
                    x="50%" 
                    y="52%" 
                    textAnchor="middle" 
                    dominantBaseline="middle" 
                    fill="black" 
                    fontSize="320" 
                    fontWeight="900" 
                    fontFamily="sans-serif"
                    letterSpacing="-0.02em"
                    lengthAdjust="spacingAndGlyphs"
                    textLength="1080"
                  >
                    {mainTitle}
                  </text>

                  {/* Desktop Text */}
                  <text 
                    className="hidden md:inline"
                    x="50%" 
                    y="52%" 
                    textAnchor="middle" 
                    dominantBaseline="middle" 
                    fill="black" 
                    fontSize="320" 
                    fontWeight="900" 
                    fontFamily="sans-serif"
                    letterSpacing="-0.02em"
                    lengthAdjust="spacingAndGlyphs"
                    textLength="1000"
                  >
                    {mainTitle}
                  </text>
                </mask>
              </defs>
              
              {/* Gray Background masked by text */}
              <rect width="100%" height="105%" fill="#c0c0c0" mask="url(#textMask)" />

              {/* Red Circle Accent (Mobile) */}
              <motion.ellipse 
                className="md:hidden"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.8, type: "spring" }}
                cx="630"
                cy="230"
                rx="160"
                ry="105"
                fill="#cc0000"
                mask="url(#textMask)"
                style={{ transformOrigin: "630px 230px" }}
              />

              {/* Red Circle Accent (Desktop) */}
              <motion.ellipse 
                className="hidden md:inline"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.8, type: "spring" }}
                cx="750"
                cy="230"
                rx="98"
                ry="125"
                fill="#cc0000"
                mask="url(#textMask)"
                style={{ transformOrigin: "750px 230px" }}
              />
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  )
}





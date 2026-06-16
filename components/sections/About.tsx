'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const IMAGES = [
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800&grayscale=true",
  "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=800&grayscale=true",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800&grayscale=true",
  "https://images.unsplash.com/photo-1555952517-2e8e729e0b44?auto=format&fit=crop&q=80&w=800&grayscale=true",
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800&grayscale=true"
]

export interface AboutProps {
  data?: {
    title?: string;
    description?: string;
    mediaList?: { url: string }[];
  }
}

export default function About({ data }: AboutProps) {
  const title = data?.title || "About Me"
  const descriptionLines = (data?.description || "DISTINGUISHED BY A MYRIAD OF\nACCOLADES AND INTERNATIONAL\nRECOGNITION, SQUIDWOD STANDS\nAS A LUMINARY IN THE REALM OF\nVISUAL STORYTELLING").split('\n')
  const IMAGES = data?.mediaList?.map(m => m.url) || [
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800&grayscale=true",
    "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=800&grayscale=true",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800&grayscale=true",
    "https://images.unsplash.com/photo-1555952517-2e8e729e0b44?auto=format&fit=crop&q=80&w=800&grayscale=true",
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800&grayscale=true"
  ]

  const [activeIndex, setActiveIndex] = useState(0)

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % IMAGES.length)
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + IMAGES.length) % IMAGES.length)
  }

  return (
    <section id="about" className="w-full min-h-0 md:min-h-screen bg-[#c0c0c0] relative px-8 md:px-16 pt-24 md:pt-[20vh] pb-12 md:pb-16 text-black flex flex-col md:flex-row">
      
      {/* Left Column: Text Content */}
      <div className="flex-1 flex flex-col z-10 pt-10 md:pt-10 order-1">
        <div className="max-w-md translate-x-0 translate-y-[-90px] md:translate-x-[30px] md:translate-y-[-50px]">
          <h2 className="text-4xl md:text-5xl font-light uppercase tracking-tighter mb-6">
            {title}
          </h2>
          <p className="text-[11px] md:text-lg font-semibold tracking-wider leading-snug uppercase">
            {descriptionLines.map((line, i) => <span key={i}>{line} <br /></span>)}
          </p>
        </div>
      </div>

      {/* Right Column: Image Stack */}
      <div className="md:absolute md:right-[290px] md:top-[calc(50%+90px)] md:-translate-y-1/2 relative w-full md:w-auto flex justify-center items-center mt-[-40px] md:mt-0 min-h-[50vh] md:min-h-0 z-20 order-2">

        <div className="relative w-full md:w-[450px] max-w-[450px] aspect-[4/5] md:aspect-square">
          <AnimatePresence mode="popLayout">
            {IMAGES.map((img, index) => {
              // Calculate relative position. 
              // 0 = front, 1 = back, etc.
              const diff = (index - activeIndex + IMAGES.length) % IMAGES.length;

              // Only render the front card and the one immediately behind it
              if (diff > 1 && diff !== IMAGES.length - 1) return null;

              // diff === 0 -> Front Card
              // diff === 1 -> Back Card
              // diff === IMAGES.length - 1 -> Card that just left (animating out)

              let initial = {};
              let animate = {};
              let exit = {};
              let zIndex = 0;

              if (diff === 0) {
                // Front card
                initial = { scale: 0.95, x: 60, y: 30, rotate: 15, opacity: 0 };
                animate = { scale: 1, x: 0, y: 0, rotate: 0, opacity: 1 };
                exit = { scale: 1.05, x: -100, opacity: 0 };
                zIndex = 10;
              } else if (diff === 1) {
                // Back card (stacked)
                initial = { opacity: 0, scale: 0.9, x: 80, y: 40, rotate: 20 };
                animate = { opacity: 1, scale: 0.95, x: 60, y: 30, rotate: 15 };
                exit = { opacity: 0 };
                zIndex = 0;
              } else {
                // Animating out
                initial = { scale: 1, x: 0, y: 0, rotate: 0, opacity: 1 };
                animate = { scale: 1.05, x: 100, opacity: 0 };
                exit = { opacity: 0 };
                zIndex = 20;
              }

              return (
                <motion.div
                  key={img}
                  layoutId={`card-${img}`}
                  initial={initial}
                  animate={animate}
                  exit={exit}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="absolute inset-0 bg-white border-[3px] md:border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_#cc0000] transition-shadow duration-300 p-[5%] pb-[15%]"
                  style={{ zIndex }}
                >
                  <div className="relative w-full h-full border-[3px] md:border-4 border-black bg-zinc-200 overflow-hidden">
                    {img.match(/\.(mp4|webm|ogg)$/i) ? (
                      <video 
                        src={img} 
                        className="w-full h-full object-cover grayscale" 
                        autoPlay muted loop playsInline 
                      />
                    ) : (
                      <Image
                        src={img}
                        alt={`Gallery image ${index + 1}`}
                        fill
                        className="object-cover grayscale"
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                    )}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex flex-col items-center md:items-start w-full md:w-auto mt-[70px] md:mt-0 md:absolute md:bottom-16 md:left-16 md:translate-x-[60px] z-20 order-3 pb-16 md:pb-0">
        <p className="text-xs font-bold tracking-widest uppercase mb-4">Until . Now</p>
        <div className="flex items-center gap-6">
          <button 
            onClick={handlePrev}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-black flex justify-center items-center hover:bg-black hover:text-white transition-colors"
            aria-label="Previous image"
          >
            <ArrowLeft size={24} />
          </button>

          <div className="flex gap-2">
            {IMAGES.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-1 h-1 rounded-full ${idx === activeIndex ? 'bg-black' : 'bg-black/30'}`}
              />
            ))}
          </div>

          <button 
            onClick={handleNext}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-black flex justify-center items-center hover:bg-black hover:text-white transition-colors"
            aria-label="Next image"
          >
            <ArrowRight size={24} />
          </button>
        </div>
      </div>

      {/* EST 2002 Label - Anchored to section right edge */}
      <div className="absolute right-[40px] top-[calc(50%+120px)] -translate-y-1/2 hidden lg:block z-20">
        <p className="text-sm font-black tracking-widest uppercase">
          Est. 2002
        </p>
      </div>
    </section>
  )
}

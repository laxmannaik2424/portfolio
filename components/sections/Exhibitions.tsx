'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

export interface ExhibitionsProps {
  data?: {
    year?: string;
    title?: string;
    description?: string;
    list?: { text: string; mediaUrl: string }[];
  }
}

export default function Exhibitions({ data }: ExhibitionsProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const year = data?.year || "2024"
  const title = data?.title || "My Exhibitions"
  const descriptionLines = (data?.description || "The artist's ability to transcend\nboundaries and connect with a\nglobal audience is a testament to\nthe universal language of\nvisual storytelling").split('\n')

  const defaultExhibitionsData = [
    { text: "MADRID, JAN 2024\nFEEL FREE PHOTOGRAPHY", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600&grayscale=true" },
    { text: "PARIS, MAR 2024\nLUMIERE STUDIOS", image: "https://images.unsplash.com/photo-1518998053401-b2b9187313bd?auto=format&fit=crop&q=80&w=1600&grayscale=true" },
    { text: "TOKYO, JUL 2024\nNEON VISIONS", image: "https://images.unsplash.com/photo-1541123437800-1bb1317bc920?auto=format&fit=crop&q=80&w=1600&grayscale=true" }
  ]

  const exhibitionsData = data?.list && data.list.length > 0
    ? data.list.map((item, i) => {
        const textParts = (item?.text || "").split('\n')
        return {
          id: i,
          location: textParts[0] || "",
          studio: textParts[1] || "",
          image: item?.mediaUrl || defaultExhibitionsData[i%defaultExhibitionsData.length].image
        }
      })
    : defaultExhibitionsData.map((item, i) => {
        const textParts = (item.text || "").split('\n')
        return {
          id: i,
          location: textParts[0] || "",
          studio: textParts[1] || "",
          image: item.image
        }
      })

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % exhibitionsData.length)
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + exhibitionsData.length) % exhibitionsData.length)

  const current = exhibitionsData[activeIndex]

  return (
    <section id="exhibitions" className="w-full min-h-0 md:min-h-screen bg-[#c0c0c0] relative px-4 md:px-16 pt-16 md:pt-24 pb-0 md:pb-16 text-black flex flex-col justify-center">
      
      {/* Header Area */}
      <div className="w-full flex justify-between items-start mb-8 md:mb-12 max-w-[1200px] mx-auto">
        {/* Left Side: Year and Arrows */}
        <div className="flex flex-col gap-8 md:gap-16">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tighter">{year}</h2>
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={handlePrev}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-black flex justify-center items-center hover:bg-black hover:text-white transition-colors"
            >
              <ArrowLeft size={18} strokeWidth={1.5} />
            </button>
            <div className="flex gap-1.5 md:gap-2">
              {exhibitionsData.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-1 h-1 rounded-full ${idx === activeIndex ? 'bg-black' : 'bg-black/30'}`}
                />
              ))}
            </div>
            <button 
              onClick={handleNext}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-black flex justify-center items-center hover:bg-black hover:text-white transition-colors"
            >
              <ArrowRight size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Right Side: Title and Paragraph */}
        <div className="flex flex-col items-end text-right max-w-[200px] md:max-w-[400px]">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter uppercase mb-4 md:mb-6">{title}</h2>
          <p className="text-[7px] md:text-[10px] font-bold tracking-[0.1em] leading-[1.6] uppercase">
            {descriptionLines.map((line, i) => <span key={i}>{line} <br/></span>)}
          </p>
        </div>
      </div>

      {/* Main Exhibition Image */}
      <div className="w-full max-w-[1200px] mx-auto relative mt-4 md:mt-8 aspect-[4/3] md:aspect-[16/9] border-2 md:border-4 border-white bg-black group overflow-hidden shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            {!current.image ? (
              <div className="w-full h-full bg-zinc-900 object-cover group-hover:scale-105 transition-transform duration-1000 opacity-90" />
            ) : current.image.match(/(\/video\/upload\/|\.(mp4|webm|ogg|mov|avi|mkv|qt)$)/i) ? (
              <video 
                src={current.image} 
                autoPlay muted loop playsInline 
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-1000 opacity-90"
              />
            ) : (
              <Image 
                src={current.image} 
                alt={current.location} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-1000 opacity-90"
              />
            )}
            
            {/* Overlays (Bottom Right) */}
            <div className="absolute bottom-4 right-4 md:bottom-10 md:right-10 flex flex-col items-end z-10 pointer-events-none">
              <p className="text-white text-[9px] md:text-sm font-bold tracking-widest uppercase mb-1 drop-shadow-md">
                {current.location}
              </p>
              <p className="text-white/60 text-[6px] md:text-[9px] font-semibold tracking-[0.2em] uppercase">
                {current.studio}
              </p>
            </div>
            
            <div className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 origin-right text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase text-black bg-white/80 px-2 py-1 rounded">
              Exhibition
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

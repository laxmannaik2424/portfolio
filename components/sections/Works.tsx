/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useState } from 'react'

export interface WorksProps {
  data?: {
    year?: string;
    title?: string;
    description?: string;
    grids?: {
      mediaList?: { url: string }[];
    }[];
  }
}

export default function Works({ data }: WorksProps) {
  const [currentGridIndex, setCurrentGridIndex] = useState(0);

  const year = data?.year || "2023"
  const title = data?.title || "My Works"
  const descriptionLines = (data?.description || "Every image is a meticulous\ncomposition, carefully curated to\nevoke emotion and provoke thought.\nWhether it's a candid moment frozen\nin time or the grandeur of nature's\nspectacle").split('\n')
  
  const defaultImages = [
    "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&q=80&w=800&grayscale=true",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800&grayscale=true",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800&grayscale=true",
    "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&q=80&w=800&grayscale=true",
    "https://images.unsplash.com/photo-1548625361-ec8492067568?auto=format&fit=crop&q=80&w=800&grayscale=true",
    "https://images.unsplash.com/photo-1618090584126-129cd1f3f316?auto=format&fit=crop&q=80&w=800&grayscale=true",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800&grayscale=true",
    "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=800&grayscale=true"
  ]

  const totalGrids = Math.max(1, data?.grids?.length || 1);
  const currentGridData = data?.grids?.[currentGridIndex]?.mediaList || [];
  
  const gridImages = currentGridData.length >= 8 
    ? currentGridData.map((m: any) => m.url) 
    : [
      ...currentGridData.map((m: any) => m.url), 
      ...defaultImages
    ].slice(0, 8)

  const handlePrev = () => setCurrentGridIndex(prev => Math.max(0, prev - 1));
  const handleNext = () => setCurrentGridIndex(prev => Math.min(totalGrids - 1, prev + 1));

  return (
    <section id="works" className="w-full min-h-0 md:min-h-screen bg-[#c0c0c0] relative px-4 md:px-16 pt-16 md:pt-24 pb-8 md:pb-16 text-black flex flex-col">
      
      {/* Header Area */}
      <div className="w-full flex justify-between items-start mb-8 md:mb-12 max-w-[1000px] mx-auto">
        {/* Left Side: Year and Arrows */}
        <div className="flex flex-col gap-8 md:gap-16">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tighter">{year}</h2>
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={handlePrev}
              disabled={currentGridIndex === 0}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-black flex justify-center items-center hover:bg-black hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-black"
            >
              <ArrowLeft size={18} strokeWidth={1.5} />
            </button>
            <div className="flex gap-1.5 md:gap-2 opacity-50">
              {Array.from({ length: totalGrids }).map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === currentGridIndex ? 'bg-black scale-150' : 'bg-black/50'} transition-all`} />
              ))}
            </div>
            <button 
              onClick={handleNext}
              disabled={currentGridIndex >= totalGrids - 1}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-black flex justify-center items-center hover:bg-black hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-black"
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

      {/* Bento Grid - Reduced max width on desktop to prevent excessive height */}
      <div className="grid grid-cols-3 gap-1 md:gap-2 w-full max-w-[850px] mx-auto mt-4 md:mt-8">
        {/* Row 1 */}
        {/* 1. Wide Bridge */}
        <div className="col-span-2 relative aspect-[2/1] bg-black overflow-hidden group">
          <Image src={gridImages[0]} alt="Works 1" fill sizes="(max-width: 768px) 100vw, 800px" className="object-cover group-hover:scale-105 transition-transform duration-700" />
        </div>
        {/* 2. Portrait */}
        <div className="col-span-1 row-span-2 relative aspect-[1/2] bg-black overflow-hidden group">
          <Image src={gridImages[1]} alt="Works 2" fill sizes="(max-width: 768px) 50vw, 400px" className="object-cover group-hover:scale-105 transition-transform duration-700" />
        </div>

        {/* Row 2 */}
        {/* 3. Curves */}
        <div className="col-span-1 relative aspect-square bg-black overflow-hidden group">
          <Image src={gridImages[2]} alt="Works 3" fill sizes="(max-width: 768px) 50vw, 400px" className="object-cover group-hover:scale-105 transition-transform duration-700" />
        </div>
        {/* 4. Faces */}
        <div className="col-span-1 relative aspect-square bg-black overflow-hidden group">
          <Image src={gridImages[3]} alt="Works 4" fill sizes="(max-width: 768px) 50vw, 400px" className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
        </div>

        {/* Row 3 */}
        {/* 5. Window */}
        <div className="col-span-1 row-span-2 relative aspect-[1/2] bg-black overflow-hidden group">
          <Image src={gridImages[4]} alt="Works 5" fill sizes="(max-width: 768px) 50vw, 400px" className="object-cover group-hover:scale-105 transition-transform duration-700" />
        </div>
        {/* 6. Red Square + Tilted Image */}
        <div className="col-span-1 relative aspect-square bg-[#cc0000]">
          <div className="absolute w-[125%] h-[125%] -left-[15%] -top-[20%] -rotate-[12deg] z-20 border-[3px] md:border-4 border-white shadow-2xl bg-black overflow-hidden group">
            <Image src={gridImages[5]} alt="Works 6" fill sizes="(max-width: 768px) 50vw, 400px" className="object-cover grayscale group-hover:scale-105 transition-transform duration-700" />
          </div>
        </div>
        {/* 7. Tower */}
        <div className="col-span-1 relative aspect-square bg-black overflow-hidden group">
          <Image src={gridImages[6]} alt="Works 7" fill sizes="(max-width: 768px) 50vw, 400px" className="object-cover group-hover:scale-105 transition-transform duration-700" />
        </div>

        {/* Row 4 */}
        {/* 8. Wide Silhouette */}
        <div className="col-span-2 relative aspect-[2/1] bg-black overflow-hidden group">
          <Image src={gridImages[7]} alt="Works 8" fill sizes="(max-width: 768px) 100vw, 800px" className="object-cover group-hover:scale-105 transition-transform duration-700" />
        </div>
      </div>
    </section>
  )
}

/**
 * Logo Design Options Page
 * 
 * HTML/CSS rendered logo concepts for ARKHITEKTON branding
 */

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Star, ThumbsUp, ArrowLeft, Moon, Sun } from 'lucide-react';
import { Link } from 'wouter';

// ... [Existing Logos 1-18 remain unchanged] ...
// I will include them in the full file write to preserve them

// Logo Option 1: Stacked Layers A-Peak
function Logo1({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const scales = { sm: 0.5, md: 1, lg: 1.5 };
  const s = scales[size];
  return (
    <div className="relative" style={{ width: 64 * s, height: 64 * s }}>
      <div className="absolute bg-gradient-to-r from-orange-600 to-orange-700"
        style={{ width: 56 * s, height: 12 * s, left: 4 * s, top: 44 * s, transform: 'perspective(100px) rotateX(45deg)', borderRadius: 4 * s }} />
      <div className="absolute bg-gradient-to-r from-orange-500 to-orange-600"
        style={{ width: 44 * s, height: 12 * s, left: 10 * s, top: 30 * s, transform: 'perspective(100px) rotateX(45deg)', borderRadius: 4 * s }} />
      <div className="absolute bg-gradient-to-r from-orange-400 to-orange-500"
        style={{ width: 32 * s, height: 12 * s, left: 16 * s, top: 16 * s, transform: 'perspective(100px) rotateX(45deg)', borderRadius: 4 * s }} />
      <div className="absolute"
        style={{ width: 0, height: 0, left: 24 * s, top: 4 * s, borderLeft: `${8 * s}px solid transparent`, borderRight: `${8 * s}px solid transparent`, borderBottom: `${14 * s}px solid #f97316` }} />
    </div>
  );
}

// Logo Option 2: 3D Isometric Cube A
function Logo2({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const scales = { sm: 0.5, md: 1, lg: 1.5 };
  const s = scales[size];
  return (
    <div className="relative" style={{ width: 64 * s, height: 64 * s }}>
      <div className="absolute bg-gradient-to-b from-orange-600 to-orange-800"
        style={{ width: 28 * s, height: 40 * s, left: 4 * s, top: 16 * s, transform: 'skewY(30deg)', borderRadius: `${2 * s}px 0 0 ${2 * s}px` }} />
      <div className="absolute bg-gradient-to-b from-orange-400 to-orange-500"
        style={{ width: 28 * s, height: 40 * s, right: 4 * s, top: 16 * s, transform: 'skewY(-30deg)', borderRadius: `0 ${2 * s}px ${2 * s}px 0` }} />
      <div className="absolute bg-gradient-to-r from-orange-300 to-orange-400"
        style={{ width: 40 * s, height: 24 * s, left: 12 * s, top: 2 * s, transform: 'rotate(-45deg) skewX(15deg) skewY(15deg)', borderRadius: 4 * s }} />
      <div className="absolute font-black text-white flex items-center justify-center"
        style={{ width: 32 * s, height: 32 * s, left: 16 * s, top: 20 * s, fontSize: 24 * s, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>A</div>
    </div>
  );
}

// Logo Option 3: Nested Diamonds
function Logo3({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const scales = { sm: 0.5, md: 1, lg: 1.5 };
  const s = scales[size];
  return (
    <div className="relative" style={{ width: 64 * s, height: 64 * s }}>
      <div className="absolute bg-gradient-to-br from-orange-500 to-orange-700"
        style={{ width: 44 * s, height: 44 * s, left: 10 * s, top: 10 * s, transform: 'rotate(45deg)', borderRadius: 6 * s }} />
      <div className="absolute bg-gradient-to-br from-orange-400 to-orange-500"
        style={{ width: 28 * s, height: 28 * s, left: 18 * s, top: 18 * s, transform: 'rotate(45deg)', borderRadius: 4 * s }} />
      <div className="absolute bg-gradient-to-br from-orange-300 to-orange-400"
        style={{ width: 14 * s, height: 14 * s, left: 25 * s, top: 25 * s, transform: 'rotate(45deg)', borderRadius: 2 * s }} />
    </div>
  );
}

// Logo Option 4: Architectural Arch
function Logo4({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const scales = { sm: 0.5, md: 1, lg: 1.5 };
  const s = scales[size];
  return (
    <div className="relative" style={{ width: 64 * s, height: 64 * s }}>
      <div className="absolute bg-gradient-to-b from-orange-500 to-orange-700"
        style={{ width: 12 * s, height: 40 * s, left: 10 * s, top: 20 * s, borderRadius: `${4 * s}px ${4 * s}px 0 0` }} />
      <div className="absolute bg-gradient-to-b from-orange-500 to-orange-700"
        style={{ width: 12 * s, height: 40 * s, right: 10 * s, top: 20 * s, borderRadius: `${4 * s}px ${4 * s}px 0 0` }} />
      <div className="absolute bg-gradient-to-b from-orange-400 to-orange-500"
        style={{ width: 44 * s, height: 22 * s, left: 10 * s, top: 6 * s, borderRadius: `${22 * s}px ${22 * s}px 0 0` }} />
      <div className="absolute bg-white dark:bg-slate-900"
        style={{ width: 20 * s, height: 34 * s, left: 22 * s, top: 26 * s, borderRadius: `${10 * s}px ${10 * s}px 0 0` }} />
      <div className="absolute bg-gradient-to-b from-orange-300 to-orange-400"
        style={{ width: 10 * s, height: 10 * s, left: 27 * s, top: 4 * s, borderRadius: 2 * s }} />
    </div>
  );
}

// Logo Option 5: Hexagonal Stack
function Logo5({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const scales = { sm: 0.5, md: 1, lg: 1.5 };
  const s = scales[size];
  return (
    <div className="relative" style={{ width: 64 * s, height: 64 * s }}>
      <div className="absolute bg-gradient-to-br from-orange-600 to-orange-700"
        style={{ width: 56 * s, height: 50 * s, left: 4 * s, top: 7 * s, clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }} />
      <div className="absolute bg-gradient-to-br from-orange-500 to-orange-600"
        style={{ width: 40 * s, height: 36 * s, left: 12 * s, top: 14 * s, clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }} />
      <div className="absolute bg-gradient-to-br from-orange-400 to-orange-500"
        style={{ width: 24 * s, height: 22 * s, left: 20 * s, top: 21 * s, clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }} />
    </div>
  );
}

// Logo Option 6: Layered Chevron V
function Logo6({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const scales = { sm: 0.5, md: 1, lg: 1.5 };
  const s = scales[size];
  return (
    <div className="relative" style={{ width: 64 * s, height: 64 * s }}>
      <div className="absolute"
        style={{ width: 0, height: 0, left: 4 * s, top: 8 * s, borderLeft: `${28 * s}px solid transparent`, borderRight: `${28 * s}px solid transparent`, borderTop: `${48 * s}px solid #c2410c` }} />
      <div className="absolute"
        style={{ width: 0, height: 0, left: 10 * s, top: 8 * s, borderLeft: `${22 * s}px solid transparent`, borderRight: `${22 * s}px solid transparent`, borderTop: `${38 * s}px solid #ea580c` }} />
      <div className="absolute"
        style={{ width: 0, height: 0, left: 16 * s, top: 8 * s, borderLeft: `${16 * s}px solid transparent`, borderRight: `${16 * s}px solid transparent`, borderTop: `${28 * s}px solid #fb923c` }} />
      <div className="absolute bg-gradient-to-r from-orange-300 to-orange-400"
        style={{ width: 48 * s, height: 6 * s, left: 8 * s, top: 4 * s, borderRadius: 3 * s }} />
    </div>
  );
}

// Logo Option 7: Luxe Monogram (Gold/Black)
function Logo7({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const scales = { sm: 0.5, md: 1, lg: 1.5 };
  const s = scales[size];
  return (
    <div className="relative bg-black rounded-full" style={{ width: 64 * s, height: 64 * s, overflow: 'hidden' }}>
      <div className="absolute bg-gradient-to-b from-[#D4AF37] to-[#AA8822]"
        style={{ width: 6 * s, height: 40 * s, left: 20 * s, top: 12 * s, transform: 'rotate(20deg)', borderRadius: s }} />
      <div className="absolute bg-gradient-to-b from-[#F2D06B] to-[#C5A028]"
        style={{ width: 8 * s, height: 40 * s, left: 34 * s, top: 12 * s, transform: 'rotate(-20deg)', borderRadius: s }} />
      <div className="absolute bg-[#D4AF37]"
        style={{ width: 14 * s, height: 2 * s, left: 25 * s, top: 36 * s }} />
      <div className="absolute border border-[#D4AF37]"
        style={{ width: 48 * s, height: 48 * s, left: 8 * s, top: 8 * s, borderRadius: '50%', opacity: 0.5 }} />
    </div>
  );
}

// Logo Option 8: Ethereal Glass Prism
function Logo8({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const scales = { sm: 0.5, md: 1, lg: 1.5 };
  const s = scales[size];
  return (
    <div className="relative" style={{ width: 64 * s, height: 64 * s }}>
      <div className="absolute bg-blue-500/30 blur-md rounded-full"
        style={{ width: 40 * s, height: 40 * s, left: 12 * s, top: 12 * s }} />
      <div className="absolute bg-white/10 backdrop-blur-sm border border-white/40"
        style={{ width: 32 * s, height: 32 * s, left: 8 * s, top: 24 * s, transform: 'rotate(15deg)', borderRadius: 8 * s }} />
      <div className="absolute bg-white/20 backdrop-blur-sm border border-white/60"
        style={{ width: 32 * s, height: 32 * s, left: 24 * s, top: 16 * s, transform: 'rotate(-15deg)', borderRadius: 8 * s }} />
      <div className="absolute bg-white/30 backdrop-blur-md border border-white/80 shadow-xl"
        style={{ width: 32 * s, height: 32 * s, left: 16 * s, top: 8 * s, transform: 'rotate(45deg)', borderRadius: 8 * s }} />
    </div>
  );
}

// Logo Option 9: Midnight Spire
function Logo9({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const scales = { sm: 0.5, md: 1, lg: 1.5 };
  const s = scales[size];
  return (
    <div className="relative" style={{ width: 64 * s, height: 64 * s }}>
      <div className="absolute bg-gradient-to-t from-slate-900 via-slate-700 to-slate-400"
        style={{ width: 2 * s, height: 56 * s, left: 31 * s, top: 4 * s, borderRadius: s }} />
      <div className="absolute bg-gradient-to-t from-slate-800 to-slate-500"
        style={{ width: 2 * s, height: 40 * s, left: 20 * s, top: 20 * s, transform: 'rotate(10deg)', borderRadius: s }} />
      <div className="absolute bg-gradient-to-t from-slate-800 to-slate-500"
        style={{ width: 2 * s, height: 40 * s, left: 42 * s, top: 20 * s, transform: 'rotate(-10deg)', borderRadius: s }} />
      <div className="absolute bg-slate-900"
        style={{ width: 32 * s, height: 2 * s, left: 16 * s, top: 56 * s, borderRadius: s }} />
    </div>
  );
}

// Logo Option 10: Golden Ratio Spiral
function Logo10({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const scales = { sm: 0.5, md: 1, lg: 1.5 };
  const s = scales[size];
  return (
    <div className="relative" style={{ width: 64 * s, height: 64 * s }}>
      <div className="absolute border border-[#C5A028] bg-[#F9F5E3]"
        style={{ width: 34 * s, height: 34 * s, left: 4 * s, top: 26 * s }} />
      <div className="absolute border border-[#C5A028] bg-[#F2D06B]"
        style={{ width: 21 * s, height: 21 * s, left: 38 * s, top: 26 * s }} />
      <div className="absolute border border-[#C5A028] bg-[#D4AF37]"
        style={{ width: 13 * s, height: 13 * s, left: 46 * s, top: 13 * s }} />
      <div className="absolute border border-[#C5A028] bg-[#AA8822]"
        style={{ width: 8 * s, height: 8 * s, left: 38 * s, top: 13 * s }} />
      <div className="absolute border-2 border-[#AA8822] rounded-tr-[100%]"
        style={{ width: 34 * s, height: 34 * s, left: 4 * s, top: 26 * s, borderLeft: 'none', borderBottom: 'none', borderRadius: '0 34px 0 0' }} />
    </div>
  );
}

// Logo Option 11: Kinetic Ribbon (Chrome)
function Logo11({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const scales = { sm: 0.5, md: 1, lg: 1.5 };
  const s = scales[size];
  return (
    <div className="relative" style={{ width: 64 * s, height: 64 * s }}>
      <div className="absolute bg-gradient-to-tr from-gray-400 to-gray-200"
        style={{ width: 40 * s, height: 40 * s, left: 12 * s, top: 12 * s, borderRadius: '50% 0 50% 50%', transform: 'rotate(45deg)' }} />
      <div className="absolute bg-gradient-to-bl from-white via-gray-300 to-gray-500 shadow-xl"
        style={{ width: 40 * s, height: 40 * s, left: 12 * s, top: 12 * s, borderRadius: '50% 50% 0 50%', transform: 'rotate(45deg) scale(0.8)' }} />
      <div className="absolute bg-gray-800"
        style={{ width: 28 * s, height: 2 * s, left: 18 * s, top: 32 * s, transform: 'rotate(-45deg)', opacity: 0.5 }} />
    </div>
  );
}

// Logo Option 12: Void Keystone (High Contrast)
function Logo12({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const scales = { sm: 0.5, md: 1, lg: 1.5 };
  const s = scales[size];
  return (
    <div className="relative bg-black" style={{ width: 64 * s, height: 64 * s, borderRadius: 12 * s }}>
      <div className="absolute bg-white rounded-full"
        style={{ width: 48 * s, height: 48 * s, left: 8 * s, top: 8 * s }} />
      <div className="absolute bg-black"
        style={{ width: 0, height: 0, left: 20 * s, top: 20 * s, borderLeft: `${12 * s}px solid transparent`, borderRight: `${12 * s}px solid transparent`, borderBottom: `${24 * s}px solid black` }} />
      <div className="absolute bg-black"
        style={{ width: 16 * s, height: 8 * s, left: 24 * s, top: 4 * s }} />
    </div>
  );
}

// Logo Option 13: The Drafting Compass
function Logo13({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const scales = { sm: 0.5, md: 1, lg: 1.5 };
  const s = scales[size];
  return (
    <div className="relative" style={{ width: 64 * s, height: 64 * s }}>
      <div className="absolute bg-slate-800 border-2 border-slate-300 shadow-md z-20"
        style={{ width: 12 * s, height: 12 * s, left: 26 * s, top: 4 * s, borderRadius: '50%' }} />
      <div className="absolute bg-gradient-to-b from-slate-400 to-slate-600 rounded-full"
        style={{ width: 6 * s, height: 50 * s, left: 18 * s, top: 10 * s, transform: 'rotate(20deg)', transformOrigin: 'top center' }} />
      <div className="absolute bg-gradient-to-b from-slate-400 to-slate-600 rounded-full"
        style={{ width: 6 * s, height: 50 * s, left: 40 * s, top: 10 * s, transform: 'rotate(-20deg)', transformOrigin: 'top center' }} />
      <div className="absolute bg-slate-900"
        style={{ width: 4 * s, height: 8 * s, left: 48 * s, top: 52 * s, transform: 'rotate(-20deg)' }} />
      <div className="absolute bg-slate-300 border border-slate-400"
        style={{ width: 24 * s, height: 3 * s, left: 20 * s, top: 36 * s, borderRadius: s }} />
    </div>
  );
}

// Logo Option 14: The Blueprint Core
function Logo14({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const scales = { sm: 0.5, md: 1, lg: 1.5 };
  const s = scales[size];
  return (
    <div className="relative bg-[#0055A4] overflow-hidden" style={{ width: 64 * s, height: 64 * s, borderRadius: 4 * s }}>
      <div className="absolute border-[0.5px] border-white/20 w-full h-full"
        style={{ backgroundSize: `${8 * s}px ${8 * s}px`, backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)' }} />
      <div className="absolute border-2 border-white/80"
        style={{ width: 32 * s, height: 32 * s, left: 16 * s, top: 16 * s, transform: 'rotate(45deg)' }} />
      <div className="absolute border border-white/40"
        style={{ width: 24 * s, height: 24 * s, left: 20 * s, top: 20 * s, transform: 'rotate(45deg)' }} />
      <div className="absolute bg-white rounded-full"
        style={{ width: 4 * s, height: 4 * s, left: 30 * s, top: 30 * s }} />
    </div>
  );
}

// Logo Option 15: The Golden Capstone
function Logo15({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const scales = { sm: 0.5, md: 1, lg: 1.5 };
  const s = scales[size];
  return (
    <div className="relative" style={{ width: 64 * s, height: 64 * s }}>
      <div className="absolute"
        style={{ width: 0, height: 0, left: 4 * s, top: 24 * s, borderLeft: `${28 * s}px solid transparent`, borderRight: `${28 * s}px solid transparent`, borderBottom: `${36 * s}px solid #d4a373` }} />
      <div className="absolute bg-gradient-to-tr from-yellow-300 to-yellow-100 shadow-[0_0_15px_rgba(253,224,71,0.6)] z-10"
        style={{ width: 0, height: 0, left: 22 * s, top: 4 * s, borderLeft: `${10 * s}px solid transparent`, borderRight: `${10 * s}px solid transparent`, borderBottom: `${14 * s}px solid #fcd34d` }} />
      <div className="absolute bg-black/20"
        style={{ width: 36 * s, height: 2 * s, left: 14 * s, top: 22 * s }} />
    </div>
  );
}

// Logo Option 16: The Sovereign Pillar
function Logo16({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const scales = { sm: 0.5, md: 1, lg: 1.5 };
  const s = scales[size];
  return (
    <div className="relative" style={{ width: 64 * s, height: 64 * s }}>
      <div className="absolute bg-stone-300 border border-stone-400"
        style={{ width: 40 * s, height: 8 * s, left: 12 * s, top: 52 * s, borderRadius: 2 * s }} />
      <div className="absolute bg-stone-200 border-x border-stone-300 flex justify-around"
        style={{ width: 28 * s, height: 40 * s, left: 18 * s, top: 12 * s }}>
        <div className="w-[1px] h-full bg-stone-300" />
        <div className="w-[1px] h-full bg-stone-300" />
        <div className="w-[1px] h-full bg-stone-300" />
      </div>
      <div className="absolute bg-stone-300 border border-stone-400"
        style={{ width: 44 * s, height: 10 * s, left: 10 * s, top: 4 * s, borderRadius: 2 * s }} />
      <div className="absolute bg-stone-400 rounded-full"
        style={{ width: 8 * s, height: 8 * s, left: 12 * s, top: 8 * s }} />
      <div className="absolute bg-stone-400 rounded-full"
        style={{ width: 8 * s, height: 8 * s, right: 12 * s, top: 8 * s }} />
    </div>
  );
}

// Logo Option 17: The Divine Geometry
function Logo17({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const scales = { sm: 0.5, md: 1, lg: 1.5 };
  const s = scales[size];
  return (
    <div className="relative" style={{ width: 64 * s, height: 64 * s }}>
      <div className="absolute border-2 border-slate-800 dark:border-slate-200 rounded-full"
        style={{ width: 56 * s, height: 56 * s, left: 4 * s, top: 4 * s }} />
      <div className="absolute"
        style={{ width: 0, height: 0, left: 12 * s, top: 14 * s, borderLeft: `${20 * s}px solid transparent`, borderRight: `${20 * s}px solid transparent`, borderBottom: `${34 * s}px solid rgba(100,116,139,0.5)` }} />
      <div className="absolute border-2 border-orange-500 transform rotate-45 mix-blend-multiply dark:mix-blend-screen"
        style={{ width: 28 * s, height: 28 * s, left: 18 * s, top: 18 * s }} />
      <div className="absolute bg-red-500 rounded-full"
        style={{ width: 4 * s, height: 4 * s, left: 30 * s, top: 30 * s }} />
    </div>
  );
}

// Logo Option 18: The Keystone Arch
function Logo18({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const scales = { sm: 0.5, md: 1, lg: 1.5 };
  const s = scales[size];
  return (
    <div className="relative" style={{ width: 64 * s, height: 64 * s }}>
      <div className="absolute bg-slate-600"
        style={{ width: 12 * s, height: 16 * s, left: 8 * s, top: 28 * s, transform: 'rotate(15deg)' }} />
      <div className="absolute bg-slate-500"
        style={{ width: 12 * s, height: 16 * s, left: 14 * s, top: 16 * s, transform: 'rotate(30deg)' }} />
      <div className="absolute bg-slate-600"
        style={{ width: 12 * s, height: 16 * s, right: 8 * s, top: 28 * s, transform: 'rotate(-15deg)' }} />
      <div className="absolute bg-slate-500"
        style={{ width: 12 * s, height: 16 * s, right: 14 * s, top: 16 * s, transform: 'rotate(-30deg)' }} />
      <div className="absolute bg-red-600 shadow-lg z-10"
        style={{ width: 14 * s, height: 18 * s, left: 25 * s, top: 6 * s, clipPath: 'polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)' }} />
    </div>
  );
}

// Logo Option 19: The Neural Weave
function Logo19({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const scales = { sm: 0.5, md: 1, lg: 1.5 };
  const s = scales[size];
  return (
    <div className="relative" style={{ width: 64 * s, height: 64 * s }}>
      {[...Array(8)].map((_, i) => (
        <div key={i} className="absolute border-slate-800 dark:border-slate-200"
          style={{
            width: 40 * s,
            height: 40 * s,
            left: 12 * s,
            top: 12 * s,
            borderRadius: '50%',
            borderWidth: '1px',
            transform: `rotate(${i * 22.5}deg) scaleX(0.5)`,
            opacity: 0.7
          }} />
      ))}
      <div className="absolute bg-orange-500 rounded-full blur-[1px]"
        style={{ width: 6 * s, height: 6 * s, left: 29 * s, top: 29 * s }} />
    </div>
  );
}

// Logo Option 20: The Golden Compiler
function Logo20({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const scales = { sm: 0.5, md: 1, lg: 1.5 };
  const s = scales[size];
  return (
    <div className="relative" style={{ width: 64 * s, height: 64 * s }}>
      <div className="absolute bg-black rounded-lg shadow-xl"
        style={{ width: 48 * s, height: 48 * s, left: 8 * s, top: 8 * s }} />
      <div className="absolute bg-gradient-to-br from-[#D4AF37] to-[#AA8822]"
        style={{ 
          width: 24 * s, 
          height: 24 * s, 
          left: 20 * s, 
          top: 20 * s,
          clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)'
        }} />
      <div className="absolute bg-black"
        style={{ width: 8 * s, height: 8 * s, left: 28 * s, top: 32 * s, clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }} />
    </div>
  );
}

// Logo Option 21: The Prism of Logic
function Logo21({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const scales = { sm: 0.5, md: 1, lg: 1.5 };
  const s = scales[size];
  return (
    <div className="relative" style={{ width: 64 * s, height: 64 * s }}>
      {/* Light Beam */}
      <div className="absolute bg-white/50 blur-[2px]"
        style={{ width: 2 * s, height: 30 * s, left: 31 * s, top: 0 }} />
      {/* Prism Triangle */}
      <div className="absolute bg-slate-900/90 border border-slate-700 backdrop-blur-sm"
        style={{ 
          width: 40 * s, 
          height: 34 * s, 
          left: 12 * s, 
          top: 15 * s,
          clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)'
        }} />
      {/* Spectral Output */}
      <div className="absolute bg-gradient-to-r from-red-500 via-green-500 to-blue-500 opacity-80"
        style={{ width: 40 * s, height: 4 * s, left: 12 * s, top: 52 * s, filter: 'blur(4px)' }} />
    </div>
  );
}

// Logo Option 22: The Sovereign Keystone
function Logo22({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const scales = { sm: 0.5, md: 1, lg: 1.5 };
  const s = scales[size];
  return (
    <div className="relative" style={{ width: 64 * s, height: 64 * s }}>
      {/* Keystone Shape */}
      <div className="absolute bg-stone-900 border border-[#D4AF37]"
        style={{ 
          width: 40 * s, 
          height: 48 * s, 
          left: 12 * s, 
          top: 8 * s,
          clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)'
        }} />
      {/* Gold Inlay */}
      <div className="absolute bg-[#D4AF37]"
        style={{ width: 2 * s, height: 30 * s, left: 31 * s, top: 17 * s }} />
    </div>
  );
}

// Logo Option 23: The Ouroboros Circuit
function Logo23({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const scales = { sm: 0.5, md: 1, lg: 1.5 };
  const s = scales[size];
  return (
    <div className="relative" style={{ width: 64 * s, height: 64 * s }}>
      {/* Outer Ring */}
      <div className="absolute border-4 border-slate-800 dark:border-slate-300 rounded-full border-t-transparent"
        style={{ width: 48 * s, height: 48 * s, left: 8 * s, top: 8 * s, transform: 'rotate(-45deg)' }} />
      {/* Circuit Dot */}
      <div className="absolute bg-orange-500 rounded-full"
        style={{ width: 8 * s, height: 8 * s, left: 44 * s, top: 8 * s }} />
      {/* Inner Trace */}
      <div className="absolute border-2 border-slate-500 rounded-full"
        style={{ width: 32 * s, height: 32 * s, left: 16 * s, top: 16 * s }} />
    </div>
  );
}

// Logo Option 24: The Architect's Monogram
function Logo24({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const scales = { sm: 0.5, md: 1, lg: 1.5 };
  const s = scales[size];
  return (
    <div className="relative" style={{ width: 64 * s, height: 64 * s }}>
      {/* Left Serif */}
      <div className="absolute bg-black dark:bg-white"
        style={{ width: 8 * s, height: 48 * s, left: 16 * s, top: 8 * s, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 85%)' }} />
      {/* Right Serif (Thin) */}
      <div className="absolute bg-black dark:bg-white"
        style={{ width: 2 * s, height: 48 * s, left: 40 * s, top: 8 * s }} />
      {/* Crossbar (Progress Bar) */}
      <div className="absolute flex gap-[2px]"
        style={{ left: 16 * s, top: 32 * s }}>
        <div className="w-[4px] h-[4px] bg-orange-500 rounded-full" />
        <div className="w-[4px] h-[4px] bg-orange-500 rounded-full" />
        <div className="w-[4px] h-[4px] bg-orange-500 rounded-full" />
      </div>
    </div>
  );
}

const logoOptions = [
  { 
    id: 'stacked-layers',
    name: 'Stacked Layers Peak',
    description: 'Horizontal layers building upward to an A-shaped peak. Represents building architecture layer by layer.',
    component: Logo1,
    tags: ['Modern', 'Layered', 'Upward'],
  },
  { 
    id: 'isometric-cube',
    name: '3D Isometric Cube',
    description: 'Modern tech-style 3D cube with bold A lettermark. Conveys structure, dimension, and technology.',
    component: Logo2,
    tags: ['3D', 'Tech', 'Bold'],
  },
  { 
    id: 'nested-diamonds',
    name: 'Nested Diamonds',
    description: 'Concentric rotated squares creating depth and focus. Elegant, geometric, and versatile.',
    component: Logo3,
    tags: ['Geometric', 'Elegant', 'Minimal'],
  },
  { 
    id: 'architectural-arch',
    name: 'Architectural Arch',
    description: 'Classic Roman arch with keystone. Timeless, strong, and directly tied to architecture.',
    component: Logo4,
    tags: ['Classic', 'Architectural', 'Strong'],
  },
  { 
    id: 'hexagonal-stack',
    name: 'Hexagonal Stack',
    description: 'Nested hexagons suggesting interconnected systems. Modern, tech-forward, scalable.',
    component: Logo5,
    tags: ['Hexagon', 'Systems', 'Modern'],
  },
  { 
    id: 'layered-v',
    name: 'Layered Chevron V',
    description: 'Inverted stacked chevrons forming a dynamic V. Suggests velocity, vision, and layers.',
    component: Logo6,
    tags: ['Dynamic', 'Chevron', 'Layered'],
  },
  { 
    id: 'luxe-monogram',
    name: 'Luxe Monogram',
    description: 'High-fashion interlocking serif aesthetics. Gold on black for premium elegance and timeless luxury.',
    component: Logo7,
    tags: ['Luxury', 'Serif', 'Gold'],
  },
  { 
    id: 'ethereal-glass',
    name: 'Ethereal Glass',
    description: 'Frosted glassmorphism layers. Modern, translucent, and sophisticated. Suggests clarity and future-tech.',
    component: Logo8,
    tags: ['Glass', 'Modern', 'Clean'],
  },
  { 
    id: 'midnight-spire',
    name: 'Midnight Spire',
    description: 'Ultra-thin vertical lines reminiscent of skyscrapers at night. Minimalist, sharp, and precise.',
    component: Logo9,
    tags: ['Minimal', 'Vertical', 'Sharp'],
  },
  { 
    id: 'golden-ratio',
    name: 'Golden Ratio Spiral',
    description: 'Mathematical perfection using the Fibonacci sequence. Intellectual, balanced, and organically correct.',
    component: Logo10,
    tags: ['Math', 'Spiral', 'Balanced'],
  },
  { 
    id: 'kinetic-ribbon',
    name: 'Kinetic Ribbon',
    description: 'Chromed metallic ribbon twisting in space. Fluid motion meets structural integrity.',
    component: Logo11,
    tags: ['Chrome', 'Fluid', '3D'],
  },
  { 
    id: 'void-keystone',
    name: 'Void Keystone',
    description: 'High-contrast negative space. Bold, stark, and memorable. Uses the void to define the structure.',
    component: Logo12,
    tags: ['Bold', 'Contrast', 'Abstract'],
  },
  { 
    id: 'drafting-compass',
    name: 'The Drafting Compass',
    description: 'Precision instrument forming the A. Symbolizes the Master Designer and exactitude.',
    component: Logo13,
    tags: ['Tools', 'Precision', 'Architect'],
  },
  { 
    id: 'blueprint-core',
    name: 'The Blueprint Core',
    description: 'Wireframe structure on blueprint blue. Represents the plan behind the reality.',
    component: Logo14,
    tags: ['Blueprint', 'Plan', 'Wireframe'],
  },
  { 
    id: 'golden-capstone',
    name: 'The Golden Capstone',
    description: 'The final glowing stone of a great pyramid. Symbolizes the ultimate achievement.',
    component: Logo15,
    tags: ['Pyramid', 'Achievement', 'Gold'],
  },
  { 
    id: 'sovereign-pillar',
    name: 'The Sovereign Pillar',
    description: 'Classical column representing stability, strength, and timeless structural mastery.',
    component: Logo16,
    tags: ['Column', 'Classic', 'Stability'],
  },
  { 
    id: 'divine-geometry',
    name: 'The Divine Geometry',
    description: 'Circle, Square, Triangle. The fundamental building blocks of all form.',
    component: Logo17,
    tags: ['Geometry', 'Sacred', 'Fundamental'],
  },
  { 
    id: 'keystone-arch',
    name: 'The Keystone Arch',
    description: 'The central stone that locks the arch. Represents structural integrity and necessity.',
    component: Logo18,
    tags: ['Structural', 'Arch', 'Integrity'],
  },
  { 
    id: 'neural-weave',
    name: 'The Neural Weave',
    description: 'Complex mesh of fine lines forming an abstract structure. Represents system interconnectedness.',
    component: Logo19,
    tags: ['Network', 'Texture', 'Complex'],
  },
  { 
    id: 'golden-compiler',
    name: 'The Golden Compiler',
    description: 'Precision cut block revealing an inner core. Represents code reduction and tailored logic.',
    component: Logo20,
    tags: ['Tailored', 'Gold', 'Precision'],
  },
  { 
    id: 'prism-logic',
    name: 'The Prism of Logic',
    description: 'Refractive prism splitting light into structured output. Represents AI processing and clarity.',
    component: Logo21,
    tags: ['AI', 'Light', 'Structure'],
  },
  { 
    id: 'sovereign-keystone',
    name: 'The Sovereign Keystone',
    description: 'Minimalist black-on-black textured keystone with gold rim. The final, critical piece.',
    component: Logo22,
    tags: ['Minimal', 'Luxury', 'Key'],
  },
  { 
    id: 'ouroboros-circuit',
    name: 'The Ouroboros Circuit',
    description: 'Infinite loop circuit trace forming an elegant seal. Represents continuous software lifecycle.',
    component: Logo23,
    tags: ['Circuit', 'Infinite', 'Cycle'],
  },
  { 
    id: 'architect-monogram',
    name: 'The Architect Monogram',
    description: 'High-contrast serif A with a digital progress bar crossbar. Blends classic typography with tech.',
    component: Logo24,
    tags: ['Typography', 'Hybrid', 'Elegant'],
  },
];

export default function LogoDesignOptions() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [previewDark, setPreviewDark] = useState(false);

  const handleVote = (id: string) => {
    setVotes(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/design-options">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Logo Design Concepts</h1>
              <p className="text-muted-foreground text-sm">
                24 HTML/CSS rendered options • From Standard to Avant-Garde
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewDark(!previewDark)}
          >
            {previewDark ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
            {previewDark ? 'Light' : 'Dark'}
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Grid of Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {logoOptions.map((option, index) => {
            const LogoComponent = option.component;
            return (
              <Card
                key={option.id}
                className={cn(
                  'overflow-hidden cursor-pointer transition-all hover:shadow-xl',
                  selectedId === option.id && 'ring-2 ring-orange-500'
                )}
                onClick={() => setSelectedId(option.id === selectedId ? null : option.id)}
              >
                <CardContent className="p-0">
                  {/* Preview Area */}
                  <div className={cn(
                    'aspect-square flex items-center justify-center transition-colors',
                    previewDark ? 'bg-slate-900' : 'bg-slate-50'
                  )}>
                    <LogoComponent size="lg" />
                  </div>
                  
                  {/* Info */}
                  <div className="p-4 border-t border-border">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-xs text-muted-foreground">Option {index + 1}</span>
                        <h3 className="font-semibold text-foreground">{option.name}</h3>
                      </div>
                      {selectedId === option.id && (
                        <Badge className="bg-orange-500">
                          <Check className="h-3 w-3 mr-1" />
                          Selected
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {option.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Vote Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVote(option.id);
                      }}
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Vote ({votes[option.id] || 0})
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Size Comparison */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Size Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-muted-foreground">
                    <th className="pb-4 pr-8">Option</th>
                    <th className="pb-4 text-center">16px</th>
                    <th className="pb-4 text-center">32px</th>
                    <th className="pb-4 text-center">48px</th>
                    <th className="pb-4 text-center">With Text</th>
                  </tr>
                </thead>
                <tbody>
                  {logoOptions.map((option, i) => {
                    const LogoComponent = option.component;
                    return (
                      <tr key={option.id} className="border-t border-border">
                        <td className="py-4 pr-8 font-medium">{i + 1}. {option.name}</td>
                        <td className="py-4">
                          <div className="flex justify-center">
                            <div className="w-8 h-8 flex items-center justify-center scale-75">
                              <LogoComponent size="sm" />
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex justify-center">
                            <LogoComponent size="md" />
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex justify-center">
                            <LogoComponent size="lg" />
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center justify-center gap-3">
                            <LogoComponent size="md" />
                            <span className="font-bold text-lg tracking-tight">ARKHITEKTON</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Dark/Light Preview */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Theme Comparison</h2>
            <div className="grid grid-cols-2 gap-6">
              {/* Light */}
              <div className="bg-white rounded-xl p-6 border">
                <span className="text-xs text-slate-500 uppercase tracking-wider mb-4 block">Light Mode</span>
                <div className="grid grid-cols-3 gap-4">
                  {logoOptions.map((option) => {
                    const LogoComponent = option.component;
                    return (
                      <div key={option.id} className="flex flex-col items-center gap-2 p-3 bg-slate-50 rounded-lg">
                        <LogoComponent size="md" />
                        <span className="text-xs text-slate-600">{option.name.split(' ')[0]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Dark */}
              <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                <span className="text-xs text-slate-400 uppercase tracking-wider mb-4 block">Dark Mode</span>
                <div className="grid grid-cols-3 gap-4">
                  {logoOptions.map((option) => {
                    const LogoComponent = option.component;
                    return (
                      <div key={option.id} className="flex flex-col items-center gap-2 p-3 bg-slate-800 rounded-lg">
                        <LogoComponent size="md" />
                        <span className="text-xs text-slate-300">{option.name.split(' ')[0]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selection Footer */}
        {selectedId && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-card border border-border shadow-2xl rounded-full px-6 py-3 flex items-center gap-4 z-50">
            <div className="flex items-center gap-3">
              {(() => {
                const option = logoOptions.find(o => o.id === selectedId);
                if (option) {
                  const LogoComponent = option.component;
                  return (
                    <>
                      <div className="w-8 h-8 flex items-center justify-center">
                        <LogoComponent size="sm" />
                      </div>
                      <span className="font-medium">{option.name}</span>
                    </>
                  );
                }
                return null;
              })()}
            </div>
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
              <Star className="h-4 w-4 mr-2" />
              Approve Selection
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

import { ArrowRight, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { SiteContent } from '../types/catalog';

const HERO_ART_URL = '/src/assets/images/hero_blue_orange_art_1795742640332.jpg';

interface HeroSectionProps {
  siteContent: SiteContent;
}

export function HeroSection({ siteContent }: HeroSectionProps) {
  const [bgFailed, setBgFailed] = useState(false);

  const highlightItems = siteContent.heroHighlights
    .split('·')
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <section
      id="inicio"
      className="relative bg-gradient-to-br from-[#081931] via-[#11315E] to-[#1A3554] text-white border-b border-[#0B1F3A]/30 overflow-hidden"
    >
      {/* Full-bleed blue and orange background artwork */}
      {!bgFailed && (
        <img
          src={HERO_ART_URL}
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          onError={() => setBgFailed(true)}
          className="pointer-events-none absolute inset-0 w-full h-full object-cover object-center"
        />
      )}

      {/* Measured contrast scrim so artwork shines through while text stays razor-sharp */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#071529]/45 via-[#091C36]/35 to-[#071529]/60"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <h1
            className="font-display font-extrabold text-white tracking-tight leading-[1.14] max-w-3xl drop-shadow-xs"
            style={{
              fontSize: 'clamp(1.85rem, 3.2vw, 2.75rem)',
              textWrap: 'balance',
            }}
          >
            {siteContent.heroTitle}
          </h1>

          <p className="mt-3 text-base sm:text-lg text-slate-100 leading-relaxed max-w-2xl drop-shadow-xs">
            &ldquo;{siteContent.heroSubtitle}&rdquo;
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5">
            <a
              href="#vitrine"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white bg-[#EA580C] hover:bg-[#F97316] rounded-lg shadow-md transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>{siteContent.heroPrimaryCta}</span>
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </a>

            <a
              href={siteContent.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-[#0B1F3A] bg-white/95 hover:bg-white rounded-lg shadow-md transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]"
            >
              <MessageCircle
                className="w-4 h-4 text-[#EA580C] shrink-0"
                aria-hidden="true"
              />
              <span>{siteContent.heroSecondaryCta}</span>
            </a>
          </div>

          {highlightItems.length > 0 && (
            <div className="mt-7 pt-4 border-t border-white/25 w-full max-w-3xl flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-slate-200">
              {highlightItems.map((item, idx) => (
                <span key={`${item}-${idx}`} className="inline-flex items-center gap-4">
                  {idx > 0 && (
                    <span aria-hidden="true" className="text-[#F97316]">
                      ·
                    </span>
                  )}
                  <span className={idx === 0 ? 'font-semibold text-white' : ''}>
                    {item}
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


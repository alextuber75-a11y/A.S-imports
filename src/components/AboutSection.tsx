import { SiteContent } from '../types/catalog';

interface AboutSectionProps {
  siteContent: SiteContent;
}

export function AboutSection({ siteContent }: AboutSectionProps) {
  return (
    <section
      id="sobre"
      className="bg-transparent border-b border-[#1B4272]/15 py-16 sm:py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/88 backdrop-blur-sm border border-[#1B4272]/12 rounded-2xl p-8 sm:p-10 lg:p-12 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold tracking-wider uppercase text-[#EA580C]">
              Institucional
            </p>
            <h2
              className="mt-2 font-display font-bold text-[#0B1F3A] text-3xl sm:text-4xl tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              {siteContent.aboutTitle}
            </h2>
          </div>

          <div className="lg:col-span-7">
            <p className="text-lg sm:text-xl text-slate-700 leading-relaxed max-w-3xl whitespace-pre-line">
              {siteContent.aboutText}
            </p>
          </div>
        </div>

        {siteContent.aboutPillars.length > 0 && (
          <div className="mt-12 pt-10 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-8">
            {siteContent.aboutPillars.map((pillar, idx) => (
              <div key={`${pillar.title}-${idx}`} className="space-y-2">
                <div className="flex items-baseline gap-2.5">
                  <span className="font-display font-bold text-sm text-[#EA580C] tabular-nums">
                    {String(idx + 1).padStart(2, '0')}.
                  </span>
                  <h3 className="font-display font-semibold text-lg text-[#0B1F3A]">
                    {pillar.title}
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {pillar.detail}
                </p>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </section>
  );
}

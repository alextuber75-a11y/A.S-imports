import { SiteContent } from '../types/catalog';

interface WhyChooseSectionProps {
  siteContent: SiteContent;
}

export function WhyChooseSection({ siteContent }: WhyChooseSectionProps) {
  return (
    <section
      id="diferenciais"
      className="relative bg-gradient-to-br from-[#0B1F3A] via-[#133566] to-[#1D3E69] text-white py-16 sm:py-20 border-b border-white/10 overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.24),transparent_58%)]"
        aria-hidden="true"
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-wider uppercase text-[#F97316]">
            Nossos diferenciais
          </p>
          <h2
            className="mt-2 font-display font-bold text-white text-3xl sm:text-4xl tracking-tight"
            style={{ textWrap: 'balance' }}
          >
            {siteContent.whyTitle}
          </h2>
          {siteContent.whySubtitle && (
            <p className="mt-3 text-base sm:text-lg text-slate-300 leading-relaxed">
              {siteContent.whySubtitle}
            </p>
          )}
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteContent.whyReasons.map((reason, idx) => (
            <div
              key={`${reason.title}-${idx}`}
              className={`p-6 rounded-xl bg-white/[0.04] border border-white/12 ${
                siteContent.whyReasons.length === 5 && idx === 4
                  ? 'md:col-span-2 lg:col-span-1'
                  : ''
              }`}
            >
              <span className="font-display font-bold text-sm text-[#F97316] tabular-nums">
                {String(idx + 1).padStart(2, '0')}.
              </span>
              <h3 className="mt-3 font-display font-bold text-xl text-white tracking-wide">
                {reason.title}
              </h3>
              <p className="mt-2.5 text-sm sm:text-base text-slate-300 leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

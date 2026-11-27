import { ArrowUpRight, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { FACEBOOK_URL } from '../data/defaultCatalog';
import { SiteContent } from '../types/catalog';

interface ContactSectionProps {
  siteContent: SiteContent;
}

export function ContactSection({ siteContent }: ContactSectionProps) {
  return (
    <section id="contato" className="bg-transparent py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Primary WhatsApp Contact Card */}
          <div className="lg:col-span-7 bg-white/95 border border-[#1B4272]/15 shadow-xs rounded-2xl p-8 sm:p-10">
            <p className="text-xs font-semibold tracking-wider uppercase text-[#EA580C]">
              Atendimento direto
            </p>
            <h2
              className="mt-2 font-display font-bold text-[#0B1F3A] text-3xl sm:text-4xl tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              {siteContent.contactTitle}
            </h2>
            {siteContent.contactSubtitle && (
              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                {siteContent.contactSubtitle}
              </p>
            )}

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href={siteContent.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 text-base font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-xl transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1F3A]"
              >
                <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>Chamar no WhatsApp</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Social Networks & Channels */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <h3 className="font-display font-bold text-xl text-[#0B1F3A]">
                Redes sociais e novidades
              </h3>
              <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                Acompanhe lançamentos, reposições e seleções especiais em nossos
                canais oficiais.
              </p>
            </div>

            <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl bg-white">
              <a
                href={siteContent.instagramUrl || 'https://instagram.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 p-5 hover:bg-slate-50 transition-colors rounded-t-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#F97316]"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-[#0B1F3A] text-white flex items-center justify-center shrink-0">
                    <Instagram className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-base text-[#0B1F3A]">
                      Instagram
                    </p>
                    <p className="text-sm text-slate-500">
                      {siteContent.instagramHandle || '@asimportsvariedades'}
                    </p>
                  </div>
                </div>
                <ArrowUpRight
                  className="w-4 h-4 text-slate-400 shrink-0"
                  aria-hidden="true"
                />
              </a>

              <a
                href={siteContent.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 p-5 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#F97316]"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-[#EA580C] text-white flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-base text-[#0B1F3A]">
                      WhatsApp Comercial
                    </p>
                    <p className="text-sm text-slate-500">
                      Atendimento rápido e personalizado
                    </p>
                  </div>
                </div>
                <ArrowUpRight
                  className="w-4 h-4 text-slate-400 shrink-0"
                  aria-hidden="true"
                />
              </a>

              <a
                href={siteContent.otherSocialUrl?.trim() || FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 p-5 rounded-b-xl bg-[#F8FAFC] hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#F97316]"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-[#1877F2] text-white flex items-center justify-center shrink-0">
                    <Facebook className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-base text-[#0B1F3A]">
                      {siteContent.otherSocialTitle &&
                      siteContent.otherSocialTitle !== 'Outras redes sociais'
                        ? siteContent.otherSocialTitle
                        : 'Facebook'}
                    </p>
                    <p className="text-sm text-slate-500">
                      {siteContent.otherSocialDescription &&
                      siteContent.otherSocialDescription !==
                        'Espaço reservado para Facebook e novos canais'
                        ? siteContent.otherSocialDescription
                        : 'Acompanhe nossa página oficial no Facebook'}
                    </p>
                  </div>
                </div>
                <ArrowUpRight
                  className="w-4 h-4 text-slate-400 shrink-0"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Facebook, Instagram, Menu, MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import { FACEBOOK_URL } from '../data/defaultCatalog';
import { SiteContent } from '../types/catalog';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  siteContent: SiteContent;
}

export function Header({ siteContent }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#inicio', label: 'Início' },
    { href: '#ofertas', label: 'Ofertas' },
    { href: '#vitrine', label: 'Vitrine' },
    { href: '#diferenciais', label: 'Diferenciais' },
    { href: '#contato', label: 'Contato' },
  ];

  const instagramHref = siteContent.instagramUrl || 'https://instagram.com';
  const facebookHref = siteContent.otherSocialUrl?.trim() || FACEBOOK_URL;

  return (
    <header className="sticky top-0 z-40 bg-white/88 backdrop-blur-md border-b border-[#1B4272]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] sm:h-[84px] flex items-center justify-between gap-3 sm:gap-6 lg:gap-8">
        {/* Zone 1: Brand wordmark (1-line) */}
        <a
          href="#inicio"
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] rounded-md whitespace-nowrap shrink-0 min-w-0"
          aria-label={`Página inicial da ${siteContent.brandName}`}
        >
          <BrandLogo
            brandName={siteContent.brandName}
            customLogoUrl={siteContent.customLogoUrl}
            size="sm"
          />
        </a>

        {/* Zone 2: Concise navigation links */}
        <nav
          aria-label="Navegação principal"
          className="hidden md:flex items-center gap-5 lg:gap-7 text-sm font-medium text-slate-600"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-[#0B1F3A] hover:underline underline-offset-4 decoration-[#F97316] decoration-2 transition-colors whitespace-nowrap shrink-0 py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Instagram + Facebook + Primary WhatsApp action + mobile menu toggle */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <a
            href={instagramHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Instagram ${siteContent.instagramHandle || siteContent.brandName}`}
            title={siteContent.instagramHandle || 'Instagram'}
            className="inline-flex items-center justify-center gap-2 w-10 h-10 xl:w-auto xl:px-3.5 xl:py-2 text-sm font-medium text-[#0B1F3A] hover:text-[#EA580C] bg-white/80 hover:bg-white border border-[#1B4272]/15 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]"
          >
            <Instagram className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="hidden xl:inline">Instagram</span>
          </a>

          <a
            href={facebookHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Facebook ${siteContent.brandName}`}
            title="Facebook"
            className="inline-flex items-center justify-center gap-2 w-10 h-10 xl:w-auto xl:px-3.5 xl:py-2 text-sm font-medium text-[#0B1F3A] hover:text-[#EA580C] bg-white/80 hover:bg-white border border-[#1B4272]/15 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]"
          >
            <Facebook className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="hidden xl:inline">Facebook</span>
          </a>

          <a
            href={siteContent.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1F3A]"
          >
            <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Fale no WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-[#0B1F3A] hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4">
          <nav aria-label="Menu mobile" className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-3 text-base font-medium text-[#0B1F3A] hover:bg-slate-50 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href={instagramHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 px-4 py-3 text-base font-semibold text-[#0B1F3A] bg-slate-50 hover:bg-slate-100 border border-[#1B4272]/15 rounded-lg transition-colors"
            >
              <Instagram className="w-4 h-4 shrink-0 text-[#EA580C]" aria-hidden="true" />
              <span>Instagram ({siteContent.instagramHandle || '@asimportsvariedades'})</span>
            </a>
            <a
              href={facebookHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 px-4 py-3 text-base font-semibold text-[#0B1F3A] bg-slate-50 hover:bg-slate-100 border border-[#1B4272]/15 rounded-lg transition-colors"
            >
              <Facebook className="w-4 h-4 shrink-0 text-[#0B1F3A]" aria-hidden="true" />
              <span>Facebook Oficial</span>
            </a>
            <a
              href={siteContent.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 px-4 py-3 text-base font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Fale conosco pelo WhatsApp</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

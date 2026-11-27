import { Lock, MessageCircle } from 'lucide-react';
import { SiteContent } from '../types/catalog';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  siteContent: SiteContent;
  onOpenAdmin: () => void;
}

export function Footer({ siteContent, onOpenAdmin }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#071426] text-slate-300 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-white/10">
          <div className="space-y-3 max-w-md">
            <BrandLogo
              brandName={siteContent.brandName}
              customLogoUrl={siteContent.customLogoUrl}
              size="md"
              inverted
            />
            <p className="text-base font-medium text-white">
              &ldquo;{siteContent.footerSlogan}&rdquo;
            </p>
          </div>

          <nav
            aria-label="Links do rodapé"
            className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm"
          >
            <a href="#inicio" className="hover:text-white transition-colors">
              Início
            </a>
            <a href="#ofertas" className="hover:text-white transition-colors">
              Ofertas
            </a>
            <a href="#vitrine" className="hover:text-white transition-colors">
              Vitrine
            </a>
            <a href="#diferenciais" className="hover:text-white transition-colors">
              Diferenciais
            </a>
            <a href="#contato" className="hover:text-white transition-colors">
              Contato
            </a>
            <a
              href={siteContent.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#F97316] hover:text-white font-semibold transition-colors"
            >
              <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>WhatsApp</span>
            </a>
          </nav>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {year} {siteContent.footerBrandTitle}. Todos os direitos
            reservados.
          </p>
          <button
            type="button"
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white underline underline-offset-4 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Área Admin</span>
          </button>
        </div>
      </div>
    </footer>
  );
}

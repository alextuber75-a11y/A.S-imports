import { ArrowRight, MessageCircle, Package, Tag, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { CategoryItem, Product, SiteContent } from '../types/catalog';

interface OffersSectionProps {
  siteContent: SiteContent;
  categories: CategoryItem[];
  products: Product[];
}

function formatPriceBRL(price: number): string {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function OfferImage({
  src,
  alt,
  className = '',
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        className={`w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center p-6 text-center ${className}`}
      >
        <Package
          className="w-10 h-10 text-[#0B1F3A]/40 mb-2"
          aria-hidden="true"
        />
        <span className="text-xs font-medium text-slate-500 max-w-[180px] truncate">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setFailed(true)}
      className={`w-full h-full object-cover ${className}`}
    />
  );
}

export function OffersSection({
  siteContent,
  categories,
  products,
}: OffersSectionProps) {
  const [activeOffer, setActiveOffer] = useState<Product | null>(null);

  const categoryNameById = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((cat) => {
      map[cat.id] = cat.name;
    });
    return map;
  }, [categories]);

  const offerProducts = useMemo(
    () => products.filter((p) => p.visible !== false && p.featured === true),
    [products],
  );

  return (
    <section
      id="ofertas"
      className="bg-gradient-to-r from-[#FFF1E4]/80 via-white/65 to-[#E6F0FC]/80 border-b border-[#1B4272]/15 py-14 sm:py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-[#EA580C]">
              <Tag className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Condições especiais</span>
            </p>
            <h2
              className="mt-1.5 font-display font-bold text-[#0B1F3A] text-2xl sm:text-3xl tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Área de Ofertas
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
              Produtos selecionados com condições especiais. Consulte estoque e
              garanta o seu diretamente pelo nosso WhatsApp.
            </p>
          </div>

          <a
            href="#vitrine"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B1F3A] hover:text-[#EA580C] transition-colors whitespace-nowrap shrink-0"
          >
            <span>Ver vitrine completa</span>
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </a>
        </div>

        {offerProducts.length === 0 ? (
          <div className="mt-8 bg-white/95 border border-[#EA580C]/25 rounded-2xl p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h3 className="font-display font-bold text-lg text-[#0B1F3A]">
                Novas ofertas disponíveis sob consulta
              </h3>
              <p className="mt-1 text-sm text-slate-600 max-w-xl">
                Fale com nossa equipe pelo WhatsApp para conferir os descontos e
                oportunidades de hoje.
              </p>
            </div>
            <a
              href={siteContent.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Consultar ofertas no WhatsApp</span>
            </a>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offerProducts.map((product) => {
              const categoryName =
                categoryNameById[product.categoryId] ?? 'Variedades';
              return (
                <article
                  key={product.id}
                  className="group bg-white border border-[#EA580C]/30 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-150 hover:-translate-y-0.5 flex flex-col"
                >
                  <button
                    type="button"
                    onClick={() => setActiveOffer(product)}
                    className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#F97316]"
                    aria-label={`Ver oferta ${product.name}`}
                  >
                    <OfferImage
                      src={product.imageUrl}
                      alt={product.name}
                      className="transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </button>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-bold uppercase tracking-wide text-[#EA580C]">
                          Oferta
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-[#0B1F3A]/85 truncate">
                          {product.brand}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{categoryName}</span>
                      </div>

                      <h3 className="mt-2 font-display font-bold text-lg text-[#0B1F3A] leading-snug">
                        <button
                          type="button"
                          onClick={() => setActiveOffer(product)}
                          className="text-left hover:text-[#EA580C] transition-colors focus-visible:outline-none focus-visible:underline"
                        >
                          {product.name}
                        </button>
                      </h3>

                      <p className="mt-1.5 text-sm text-slate-600 leading-relaxed line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <div>
                        {typeof product.price === 'number' &&
                        product.price > 0 ? (
                          <div className="flex flex-col">
                            <span className="text-[11px] font-medium text-[#EA580C]">
                              Oferta especial
                            </span>
                            <span className="font-display font-extrabold text-lg text-[#0B1F3A] tabular-nums">
                              {formatPriceBRL(product.price)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm font-semibold text-[#EA580C]">
                            Preço especial no WhatsApp
                          </span>
                        )}
                      </div>

                      <a
                        href={siteContent.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1F3A]"
                      >
                        <MessageCircle
                          className="w-3.5 h-3.5 shrink-0"
                          aria-hidden="true"
                        />
                        <span>Aproveitar oferta</span>
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Offer Detail Modal */}
      {activeOffer && (
        <div
          className="fixed inset-0 z-50 bg-[#0B1F3A]/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="offer-modal-title"
          onClick={() => setActiveOffer(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden border border-slate-200 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-slate-100">
              <OfferImage src={activeOffer.imageUrl} alt={activeOffer.name} />
              <button
                type="button"
                onClick={() => setActiveOffer(null)}
                aria-label="Fechar detalhes da oferta"
                className="absolute top-3 right-3 w-10 h-10 rounded-lg bg-white/95 text-[#0B1F3A] hover:bg-white flex items-center justify-center border border-slate-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-bold uppercase tracking-wide text-[#EA580C]">
                  Oferta especial
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold uppercase tracking-wide text-[#0B1F3A]">
                  {activeOffer.brand}
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  {categoryNameById[activeOffer.categoryId] ?? 'Variedades'}
                </span>
              </div>

              <h3
                id="offer-modal-title"
                className="mt-2 font-display font-bold text-2xl text-[#0B1F3A]"
              >
                {activeOffer.name}
              </h3>

              <p className="mt-3 text-base text-slate-600 leading-relaxed">
                {activeOffer.description}
              </p>

              <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  {typeof activeOffer.price === 'number' &&
                  activeOffer.price > 0 ? (
                    <div>
                      <span className="text-xs font-medium text-[#EA580C] block">
                        Valor promocional de referência
                      </span>
                      <span className="font-display font-bold text-2xl text-[#0B1F3A] tabular-nums">
                        {formatPriceBRL(activeOffer.price)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-base font-medium text-[#EA580C]">
                      Consulte condições especiais pelo WhatsApp
                    </span>
                  )}
                </div>

                <a
                  href={siteContent.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-lg transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Consultar oferta no WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

import {
  MessageCircle,
  Package,
  Search,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { CategoryItem, Product, SiteContent } from '../types/catalog';

interface ProductShowcaseProps {
  siteContent: SiteContent;
  categories: CategoryItem[];
  products: Product[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

function formatPriceBRL(price: number): string {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function ProductImage({
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

export function ProductShowcase({
  siteContent,
  categories,
  products,
  selectedCategoryId,
  onSelectCategory,
}: ProductShowcaseProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const visibleProducts = useMemo(
    () => products.filter((p) => p.visible !== false),
    [products],
  );

  const categoryNameById = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((cat) => {
      map[cat.id] = cat.name;
    });
    return map;
  }, [categories]);

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return visibleProducts.filter((product) => {
      const matchesCategory =
        selectedCategoryId === 'all' || product.categoryId === selectedCategoryId;
      if (!matchesCategory) return false;
      if (!query) return true;
      const catName = (categoryNameById[product.categoryId] ?? '').toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        catName.includes(query)
      );
    });
  }, [visibleProducts, selectedCategoryId, searchTerm, categoryNameById]);

  return (
    <section
      id="vitrine"
      className="bg-white/25 border-b border-[#1B4272]/15 py-16 sm:py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wider uppercase text-[#EA580C]">
              Catálogo institucional
            </p>
            <h2
              className="mt-2 font-display font-bold text-[#0B1F3A] text-3xl sm:text-4xl tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              {siteContent.showcaseTitle}
            </h2>
            {siteContent.showcaseSubtitle && (
              <p className="mt-3 text-base text-slate-600 leading-relaxed">
                {siteContent.showcaseSubtitle}
              </p>
            )}
          </div>
        </div>

        {/* Filter bar + Search */}
        <div className="mt-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div
            role="tablist"
            aria-label="Filtrar produtos por categoria"
            className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0"
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedCategoryId === 'all'}
              onClick={() => onSelectCategory('all')}
              className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] ${
                selectedCategoryId === 'all'
                  ? 'bg-[#0B1F3A] text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:text-[#0B1F3A] hover:border-slate-300'
              }`}
            >
              Todos ({visibleProducts.length})
            </button>
            {categories.map((cat) => {
              const isSelected = selectedCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] ${
                    isSelected
                      ? 'bg-[#0B1F3A] text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:text-[#0B1F3A] hover:border-slate-300'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-72 shrink-0">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar produto ou marca..."
              aria-label="Buscar produto ou marca"
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-300 rounded-lg text-[#0B1F3A] placeholder:text-slate-400 focus:outline-none focus:border-[#0B1F3A] focus:ring-2 focus:ring-[#F97316]/30"
            />
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="mt-10 bg-white border border-slate-200 rounded-xl p-12 text-center">
            <Package
              className="w-10 h-10 text-slate-400 mx-auto mb-3"
              aria-hidden="true"
            />
            <h3 className="font-display font-semibold text-lg text-[#0B1F3A]">
              Nenhum produto encontrado nesta seleção
            </h3>
            <p className="mt-1.5 text-sm text-slate-600 max-w-md mx-auto">
              Tente limpar a busca ou escolher outra categoria disponível.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  onSelectCategory('all');
                }}
                className="px-4 py-2 text-sm font-medium text-[#0B1F3A] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Mostrar todos os produtos
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredProducts.map((product) => {
              const categoryName =
                categoryNameById[product.categoryId] ?? 'Variedades';
              return (
                <article
                  key={product.id}
                  className="group bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-md"
                >
                  {/* 4:3 Product image */}
                  <button
                    type="button"
                    onClick={() => setActiveProduct(product)}
                    className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#F97316]"
                    aria-label={`Ver detalhes de ${product.name}`}
                  >
                    <ProductImage
                      src={product.imageUrl}
                      alt={product.name}
                      className="transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </button>

                  {/* Product metadata & actions */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold uppercase tracking-wide text-[#0B1F3A]/80 truncate">
                          {product.brand}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{categoryName}</span>
                      </div>

                      <h3 className="mt-2 font-display font-bold text-lg text-[#0B1F3A] leading-snug">
                        <button
                          type="button"
                          onClick={() => setActiveProduct(product)}
                          className="text-left hover:text-[#EA580C] transition-colors focus-visible:outline-none focus-visible:underline"
                        >
                          {product.name}
                        </button>
                      </h3>

                      <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-3">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                      <div>
                        {typeof product.price === 'number' && product.price > 0 ? (
                          <div className="flex flex-col">
                            <span className="text-[11px] font-medium text-slate-500">
                              Valor de referência
                            </span>
                            <span className="font-display font-bold text-base text-[#0B1F3A] tabular-nums">
                              {formatPriceBRL(product.price)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm font-medium text-slate-600">
                            Valor sob consulta
                          </span>
                        )}
                      </div>

                      <a
                        href={siteContent.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1F3A]"
                      >
                        <MessageCircle
                          className="w-3.5 h-3.5 shrink-0"
                          aria-hidden="true"
                        />
                        <span>Consultar pelo WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {activeProduct && (
        <div
          className="fixed inset-0 z-50 bg-[#0B1F3A]/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-modal-title"
          onClick={() => setActiveProduct(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden border border-slate-200 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-slate-100">
              <ProductImage
                src={activeProduct.imageUrl}
                alt={activeProduct.name}
              />
              <button
                type="button"
                onClick={() => setActiveProduct(null)}
                aria-label="Fechar detalhes do produto"
                className="absolute top-3 right-3 w-10 h-10 rounded-lg bg-white/95 text-[#0B1F3A] hover:bg-white flex items-center justify-center border border-slate-200 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-wide text-[#0B1F3A]">
                  {activeProduct.brand}
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  {categoryNameById[activeProduct.categoryId] ?? 'Variedades'}
                </span>
              </div>

              <h3
                id="product-modal-title"
                className="mt-2 font-display font-bold text-2xl text-[#0B1F3A]"
              >
                {activeProduct.name}
              </h3>

              <p className="mt-3 text-base text-slate-600 leading-relaxed">
                {activeProduct.description}
              </p>

              <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  {typeof activeProduct.price === 'number' &&
                  activeProduct.price > 0 ? (
                    <div>
                      <span className="text-xs text-slate-500 block">
                        Valor de referência
                      </span>
                      <span className="font-display font-bold text-2xl text-[#0B1F3A] tabular-nums">
                        {formatPriceBRL(activeProduct.price)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-base font-medium text-slate-600">
                      Consulte condições e disponibilidade
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={siteContent.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-lg transition-colors whitespace-nowrap"
                  >
                    <MessageCircle
                      className="w-4 h-4 shrink-0"
                      aria-hidden="true"
                    />
                    <span>Consultar pelo WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

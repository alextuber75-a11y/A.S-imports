import { ArrowUpRight } from 'lucide-react';
import { CategoryItem, SiteContent } from '../types/catalog';

interface CategoriesSectionProps {
  siteContent: SiteContent;
  categories: CategoryItem[];
  productCounts: Record<string, number>;
  onSelectCategory: (categoryId: string) => void;
}

export function CategoriesSection({
  siteContent,
  categories,
  productCounts,
  onSelectCategory,
}: CategoriesSectionProps) {
  return (
    <section
      id="categorias"
      className="bg-transparent border-b border-[#1B4272]/10 py-16 sm:py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wider uppercase text-[#EA580C]">
              Portfólio multimarcas
            </p>
            <h2
              className="mt-2 font-display font-bold text-[#0B1F3A] text-3xl sm:text-4xl tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              {siteContent.categoriesTitle}
            </h2>
            {siteContent.categoriesSubtitle && (
              <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
                {siteContent.categoriesSubtitle}
              </p>
            )}
          </div>
          <a
            href="#vitrine"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B1F3A] hover:text-[#EA580C] transition-colors whitespace-nowrap shrink-0"
          >
            <span>Ver todos os produtos</span>
            <ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </a>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, idx) => {
            const count = productCounts[category.id] ?? 0;
            const paddedNumber = String(idx + 1).padStart(2, '0');
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onSelectCategory(category.id)}
                className="group text-left p-6 rounded-xl bg-white/95 border border-[#1B4272]/15 shadow-xs hover:shadow-md hover:border-[#0B1F3A]/40 hover:bg-white transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-display font-bold text-sm text-[#EA580C] tabular-nums">
                      {paddedNumber}.
                    </span>
                    <span className="text-xs font-medium text-slate-500 tabular-nums">
                      {count} {count === 1 ? 'item' : 'itens'}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display font-bold text-xl text-[#0B1F3A] group-hover:text-[#EA580C] transition-colors">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {category.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold text-[#0B1F3A]">
                  <span>Explorar categoria</span>
                  <ArrowUpRight
                    className="w-4 h-4 text-[#EA580C] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import {
  ArrowLeft,
  Check,
  Copy,
  Eye,
  EyeOff,
  FolderTree,
  Globe,
  ImagePlus,
  LayoutDashboard,
  Lock,
  LogOut,
  MessageSquare,
  Package,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  ShieldAlert,
  Sparkles,
  Tag,
  Trash2,
} from 'lucide-react';
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { User } from 'firebase/auth';
import {
  OFFICIAL_LOGO_URL,
  SAMPLE_IMAGE_PRESETS,
} from '../data/defaultCatalog';
import { compressImageFileToDataUrl } from '../lib/imageUtils';
import { CategoryItem, Product, SiteContent } from '../types/catalog';
import { BrandLogo } from './BrandLogo';

type AdminTab =
  | 'overview'
  | 'products'
  | 'categories'
  | 'hero'
  | 'about'
  | 'contact';

interface AdminDashboardProps {
  user: User | null;
  authReady: boolean;
  isAdmin: boolean;
  siteContent: SiteContent;
  categories: CategoryItem[];
  products: Product[];
  initialProductToEdit?: Product | null;
  onExitAdmin: () => void;
  onSignInGoogle: () => Promise<void>;
  onSignOut: () => Promise<void>;
  onSaveSiteContent: (content: SiteContent) => Promise<void>;
  onSaveProduct: (
    id: string | null,
    data: Omit<Product, 'id'>,
  ) => Promise<string | undefined>;
  onDeleteProduct: (id: string) => Promise<void>;
  onToggleProductVisibility: (product: Product) => Promise<void>;
  onToggleProductFeatured: (product: Product) => Promise<void>;
  onSaveCategory: (
    id: string | null,
    data: Omit<CategoryItem, 'id'>,
  ) => Promise<string>;
  onDeleteCategory: (id: string, fallbackId?: string) => Promise<void>;
  onRestoreDefaults: () => Promise<void>;
}

export function AdminDashboard({
  user,
  authReady,
  isAdmin,
  siteContent,
  categories,
  products,
  initialProductToEdit,
  onExitAdmin,
  onSignInGoogle,
  onSignOut,
  onSaveSiteContent,
  onSaveProduct,
  onDeleteProduct,
  onToggleProductVisibility,
  onToggleProductFeatured,
  onSaveCategory,
  onDeleteCategory,
  onRestoreDefaults,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>(
    initialProductToEdit ? 'products' : 'overview',
  );
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; text: string } | null>(
    null,
  );
  const [loginError, setLoginError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Editable SiteContent draft state
  const [draftContent, setDraftContent] = useState<SiteContent>(siteContent);

  useEffect(() => {
    setDraftContent(siteContent);
  }, [siteContent]);

  // Product editor state
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodBrand, setProdBrand] = useState('');
  const [prodCategoryId, setProdCategoryId] = useState(categories[0]?.id ?? '');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodImageUrl, setProdImageUrl] = useState(SAMPLE_IMAGE_PRESETS[0].url);
  const [prodVisible, setProdVisible] = useState(true);
  const [prodFeatured, setProdFeatured] = useState(false);
  const [prodSortOrder, setProdSortOrder] = useState(products.length + 1);
  const [prodSearch, setProdSearch] = useState('');
  const [prodFilterCat, setProdFilterCat] = useState('all');
  const [confirmDeleteProdId, setConfirmDeleteProdId] = useState<string | null>(
    null,
  );

  // Category editor state
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catName, setCatName] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [catSortOrder, setCatSortOrder] = useState(categories.length + 1);
  const [confirmDeleteCatId, setConfirmDeleteCatId] = useState<string | null>(
    null,
  );
  const [confirmRestore, setConfirmRestore] = useState(false);

  useEffect(() => {
    if (initialProductToEdit) {
      setActiveTab('products');
      loadProductIntoForm(initialProductToEdit);
    }
  }, [initialProductToEdit]);

  useEffect(() => {
    if (!prodCategoryId && categories.length > 0) {
      setProdCategoryId(categories[0].id);
    }
  }, [categories, prodCategoryId]);

  function notify(text: string, type: 'ok' | 'err' = 'ok') {
    setToast({ type, text });
    window.setTimeout(() => {
      setToast((prev) => (prev?.text === text ? null : prev));
    }, 4000);
  }

  function loadProductIntoForm(product: Product) {
    setEditingProductId(product.id);
    setProdName(product.name);
    setProdBrand(product.brand);
    setProdCategoryId(product.categoryId);
    setProdPrice(
      typeof product.price === 'number' && product.price > 0
        ? String(product.price)
        : '',
    );
    setProdDescription(product.description);
    setProdImageUrl(product.imageUrl || SAMPLE_IMAGE_PRESETS[0].url);
    setProdVisible(product.visible !== false);
    setProdFeatured(Boolean(product.featured));
    setProdSortOrder(product.sortOrder ?? 1);
  }

  function resetProductForm() {
    setEditingProductId(null);
    setProdName('');
    setProdBrand('');
    setProdCategoryId(categories[0]?.id ?? '');
    setProdPrice('');
    setProdDescription('');
    setProdImageUrl(SAMPLE_IMAGE_PRESETS[0].url);
    setProdVisible(true);
    setProdFeatured(false);
    setProdSortOrder(products.length + 1);
  }

  function loadCategoryIntoForm(cat: CategoryItem) {
    setEditingCatId(cat.id);
    setCatName(cat.name);
    setCatDescription(cat.description);
    setCatSortOrder(cat.sortOrder ?? 1);
  }

  function resetCategoryForm() {
    setEditingCatId(null);
    setCatName('');
    setCatDescription('');
    setCatSortOrder(categories.length + 1);
  }

  async function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>,
    onLoaded: (dataUrl: string) => void,
  ) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setBusy(true);
      const dataUrl = await compressImageFileToDataUrl(file);
      onLoaded(dataUrl);
      notify('Imagem carregada e otimizada.');
    } catch (err) {
      notify(
        err instanceof Error ? err.message : 'Erro ao processar imagem.',
        'err',
      );
    } finally {
      setBusy(false);
      event.target.value = '';
    }
  }

  async function handleSaveProductSubmit(e: FormEvent) {
    e.preventDefault();
    if (!prodName.trim() || !prodBrand.trim() || !prodDescription.trim()) {
      notify('Preencha nome, marca e descrição do produto.', 'err');
      return;
    }
    const parsedPrice = prodPrice.trim()
      ? Number(prodPrice.replace(',', '.'))
      : null;

    setBusy(true);
    try {
      await onSaveProduct(editingProductId, {
        name: prodName.trim(),
        brand: prodBrand.trim(),
        categoryId: prodCategoryId || categories[0]?.id || 'novidades',
        description: prodDescription.trim(),
        imageUrl: prodImageUrl.trim() || SAMPLE_IMAGE_PRESETS[0].url,
        price:
          typeof parsedPrice === 'number' &&
          !Number.isNaN(parsedPrice) &&
          parsedPrice >= 0
            ? parsedPrice
            : null,
        visible: prodVisible,
        featured: prodFeatured,
        sortOrder: Number(prodSortOrder) || 0,
      });
      notify(
        editingProductId
          ? 'Produto atualizado na vitrine!'
          : 'Novo produto publicado na vitrine!',
      );
      resetProductForm();
    } catch {
      notify('Não foi possível salvar o produto. Tente novamente.', 'err');
    } finally {
      setBusy(false);
    }
  }

  async function handleSaveCategorySubmit(e: FormEvent) {
    e.preventDefault();
    if (!catName.trim()) {
      notify('Informe o nome da categoria.', 'err');
      return;
    }
    setBusy(true);
    try {
      await onSaveCategory(editingCatId, {
        name: catName.trim(),
        description:
          catDescription.trim() || 'Produtos selecionados nesta categoria.',
        sortOrder: Number(catSortOrder) || 0,
      });
      notify(
        editingCatId
          ? 'Categoria atualizada!'
          : 'Nova categoria criada com sucesso!',
      );
      resetCategoryForm();
    } catch {
      notify('Erro ao salvar categoria.', 'err');
    } finally {
      setBusy(false);
    }
  }

  async function handleSaveContentSection(e?: FormEvent) {
    if (e) e.preventDefault();
    setBusy(true);
    try {
      await onSaveSiteContent(draftContent);
      notify('Alterações publicadas no site ao vivo!');
    } catch {
      notify('Não foi possível salvar as alterações.', 'err');
    } finally {
      setBusy(false);
    }
  }

  const categoryNameMap = useMemo(() => {
    const m: Record<string, string> = {};
    categories.forEach((c) => {
      m[c.id] = c.name;
    });
    return m;
  }, [categories]);

  const filteredProducts = useMemo(() => {
    const q = prodSearch.trim().toLowerCase();
    return products.filter((p) => {
      if (prodFilterCat !== 'all' && p.categoryId !== prodFilterCat) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    });
  }, [products, prodFilterCat, prodSearch]);

  const visibleCount = products.filter((p) => p.visible !== false).length;
  const offerCount = products.filter(
    (p) => p.visible !== false && p.featured === true,
  ).length;

  // 1. Auth Loading Gate
  if (!authReady) {
    return (
      <div className="min-h-screen bg-soft-blue-orange flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#0B1F3A] border-t-[#EA580C] rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-600">
            Verificando sessão administrativa...
          </p>
        </div>
      </div>
    );
  }

  // 2. Auth Sign-In Gate
  if (!user) {
    return (
      <div className="min-h-screen bg-soft-blue-orange flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 space-y-6 shadow-sm">
          <div className="flex flex-col items-start gap-4">
            <BrandLogo
              brandName={siteContent.brandName}
              customLogoUrl={siteContent.customLogoUrl}
              size="sm"
            />
            <div>
              <h1 className="font-display font-bold text-2xl text-[#0B1F3A]">
                Área Administrativa
              </h1>
              <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                Entre com sua conta Google autorizada para editar todos os
                textos, categorias, fotos e produtos da vitrine.
              </p>
            </div>
          </div>

          {loginError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 leading-relaxed">
              {loginError}
            </div>
          )}

          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              setLoginError(null);
              setBusy(true);
              try {
                await onSignInGoogle();
              } catch (err) {
                const msg =
                  err instanceof Error && err.message.includes('popup-closed')
                    ? 'O login foi cancelado antes de concluir. Tente novamente.'
                    : err instanceof Error && err.message.includes('popup-blocked')
                      ? 'O navegador bloqueou a janela de login. Permita pop-ups para este site.'
                      : 'Não foi possível concluir o login com Google. Tente novamente.';
                setLoginError(msg);
              } finally {
                setBusy(false);
              }
            }}
            className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3 text-sm font-semibold text-white bg-[#0B1F3A] hover:bg-[#123158] disabled:opacity-60 rounded-xl transition-colors"
          >
            <Lock className="w-4 h-4 text-[#F97316]" aria-hidden="true" />
            <span>{busy ? 'Conectando...' : 'Entrar com Google'}</span>
          </button>

          <button
            type="button"
            onClick={onExitAdmin}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-[#0B1F3A] bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Voltar para o site</span>
          </button>
        </div>
      </div>
    );
  }

  // 3. Unauthorized Email Gate
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-soft-blue-orange flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 space-y-5 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#EA580C] flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-[#0B1F3A]">
              Acesso restrito ao administrador
            </h1>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Você está conectado como{' '}
              <strong className="text-[#0B1F3A]">{user.email}</strong>, mas esta
              conta não possui permissão de administrador. Entre com o e-mail
              proprietário da loja.
            </p>
          </div>
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={async () => {
                setLoginError(null);
                try {
                  await onSignOut();
                  await onSignInGoogle();
                } catch {
                  setLoginError('Não foi possível trocar a conta. Tente novamente.');
                }
              }}
              className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-xl transition-colors"
            >
              Trocar de conta Google
            </button>
            <button
              type="button"
              onClick={onExitAdmin}
              className="w-full px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Voltar para o site
            </button>
          </div>
        </div>
      </div>
    );
  }

  const navItems: { id: AdminTab; label: string; icon: typeof LayoutDashboard }[] =
    [
      { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
      { id: 'products', label: 'Produtos da Vitrine', icon: Package },
      { id: 'categories', label: 'Categorias', icon: FolderTree },
      { id: 'hero', label: 'Início e Marca', icon: Sparkles },
      { id: 'about', label: 'Sobre e Diferenciais', icon: Globe },
      { id: 'contact', label: 'Contato e Rodapé', icon: MessageSquare },
    ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex lg:w-72 lg:flex-col bg-[#0B1F3A] text-white shrink-0 border-r border-white/10">
        <div className="p-6 border-b border-white/10">
          <BrandLogo
            brandName={siteContent.brandName}
            customLogoUrl={siteContent.customLogoUrl}
            size="sm"
            inverted
          />
          <p className="mt-2 text-xs text-slate-300">
            Painel de Gerenciamento Completo
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-lg transition-colors text-left ${
                  active
                    ? 'bg-[#EA580C] text-white'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <p className="px-2 text-xs text-slate-400 truncate" title={user.email ?? ''}>
            {user.email}
          </p>
          <button
            type="button"
            onClick={onExitAdmin}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 text-sm font-semibold text-[#0B1F3A] bg-white hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4 text-[#EA580C]" aria-hidden="true" />
            <span>Ver site ao vivo</span>
          </button>
          <button
            type="button"
            onClick={() => void onSignOut()}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Sair da conta</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="lg:hidden bg-[#0B1F3A] text-white px-4 py-3 border-b border-white/10">
        <div className="flex items-center justify-between gap-3">
          <span className="font-display font-bold text-base">
            Área Admin · A.S Imports
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onExitAdmin}
              className="px-3 py-1.5 text-xs font-semibold bg-white text-[#0B1F3A] rounded-lg"
            >
              Ver site
            </button>
            <button
              type="button"
              onClick={() => void onSignOut()}
              aria-label="Sair da conta"
              className="p-1.5 text-slate-300 hover:text-white"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 ${
                activeTab === item.id
                  ? 'bg-[#EA580C] text-white'
                  : 'bg-white/10 text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Admin Workspace */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-10 max-w-6xl">
        {/* Toast feedback */}
        {toast && (
          <div
            role="status"
            className={`mb-6 px-4 py-3 rounded-xl flex items-center justify-between gap-3 text-sm font-medium ${
              toast.type === 'ok'
                ? 'bg-[#0B1F3A] text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <Check className="w-4 h-4 text-[#F97316]" aria-hidden="true" />
              {toast.text}
            </span>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-xs underline"
            >
              Fechar
            </button>
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0B1F3A]">
                Visão geral da vitrine
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Tudo o que você salvar aqui atualiza o site público
                automaticamente em tempo real.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-xs font-medium text-slate-500">
                  Produtos visíveis
                </p>
                <p className="mt-2 font-display font-bold text-3xl text-[#0B1F3A] tabular-nums">
                  {visibleCount}
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-xs font-medium text-slate-500">
                  Produtos na Área de Ofertas
                </p>
                <p className="mt-2 font-display font-bold text-3xl text-[#EA580C] tabular-nums">
                  {offerCount}
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-xs font-medium text-slate-500">
                  Categorias ativas
                </p>
                <p className="mt-2 font-display font-bold text-3xl text-[#EA580C] tabular-nums">
                  {categories.length}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {navItems
                .filter((i) => i.id !== 'overview')
                .map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      className="text-left p-5 bg-white border border-slate-200 hover:border-[#0B1F3A] rounded-xl transition-colors flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-lg bg-[#F8FAFC] border border-slate-200 text-[#0B1F3A] flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-[#EA580C]" />
                        </div>
                        <div>
                          <p className="font-display font-bold text-base text-[#0B1F3A]">
                            {item.label}
                          </p>
                          <p className="text-xs text-slate-500">
                            Clique para editar esta seção
                          </p>
                        </div>
                      </div>
                      <Pencil className="w-4 h-4 text-slate-400" />
                    </button>
                  );
                })}
            </div>

            {/* Safe restore block */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-bold text-base text-[#0B1F3A]">
                  Restaurar conteúdo padrão
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Caso precise voltar textos, categorias e produtos ao modelo
                  inicial.
                </p>
              </div>
              {!confirmRestore ? (
                <button
                  type="button"
                  onClick={() => setConfirmRestore(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0B1F3A] bg-slate-100 hover:bg-slate-200 rounded-lg shrink-0"
                >
                  <RotateCcw className="w-4 h-4 text-[#EA580C]" />
                  <span>Restaurar padrão</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={async () => {
                      setBusy(true);
                      try {
                        await onRestoreDefaults();
                        setConfirmRestore(false);
                        notify('Catálogo e textos restaurados para o padrão.');
                      } finally {
                        setBusy(false);
                      }
                    }}
                    className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg"
                  >
                    Confirmar restauração
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmRestore(false)}
                    className="px-3 py-2 text-sm text-slate-600 bg-slate-100 rounded-lg"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display font-bold text-2xl text-[#0B1F3A]">
                  Produtos da Vitrine
                </h1>
                <p className="text-sm text-slate-600">
                  Adicione, edite, duplique, oculte ou exclua qualquer produto.
                </p>
              </div>
              {editingProductId && (
                <button
                  type="button"
                  onClick={resetProductForm}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#0B1F3A] rounded-lg shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo produto</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              {/* Product Form */}
              <form
                onSubmit={handleSaveProductSubmit}
                className="xl:col-span-5 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-bold text-lg text-[#0B1F3A]">
                    {editingProductId
                      ? 'Editar produto'
                      : 'Cadastrar novo produto'}
                  </h2>
                  {editingProductId && (
                    <button
                      type="button"
                      onClick={resetProductForm}
                      className="text-xs font-semibold text-[#EA580C] hover:underline"
                    >
                      Limpar
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                    Nome do produto *
                  </label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="Ex: Kit Organizador Multiuso"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                      Marca *
                    </label>
                    <input
                      type="text"
                      required
                      value={prodBrand}
                      onChange={(e) => setProdBrand(e.target.value)}
                      placeholder="Ex: Lupo, Ou, Mor..."
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                      Preço opcional (R$)
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      placeholder="Vazio = Sob consulta"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                      Categoria *
                    </label>
                    <select
                      value={prodCategoryId}
                      onChange={(e) => setProdCategoryId(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#0B1F3A]"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                      Ordem
                    </label>
                    <input
                      type="number"
                      value={prodSortOrder}
                      onChange={(e) => setProdSortOrder(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                    Descrição *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={prodDescription}
                    onChange={(e) => setProdDescription(e.target.value)}
                    placeholder="Descreva os detalhes e diferenciais..."
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                    Foto do produto
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={prodImageUrl}
                      onChange={(e) => setProdImageUrl(e.target.value)}
                      placeholder="URL da imagem ou envie arquivo"
                      className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#0B1F3A] bg-[#F8FAFC] border border-slate-300 hover:border-[#0B1F3A] rounded-lg cursor-pointer shrink-0">
                      <ImagePlus className="w-4 h-4 text-[#EA580C]" />
                      <span>Enviar foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, setProdImageUrl)}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  {prodImageUrl && (
                    <img
                      src={prodImageUrl}
                      alt="Prévia"
                      referrerPolicy="no-referrer"
                      className="mt-2 h-28 w-full object-cover rounded-lg border border-slate-200 bg-slate-100"
                    />
                  )}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {SAMPLE_IMAGE_PRESETS.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setProdImageUrl(preset.url)}
                        className={`px-2 py-1 text-[11px] rounded border ${
                          prodImageUrl === preset.url
                            ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                            : 'bg-white text-slate-600 border-slate-200'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-5 pt-1">
                  <label className="inline-flex items-center gap-2 text-sm text-[#0B1F3A] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prodVisible}
                      onChange={(e) => setProdVisible(e.target.checked)}
                      className="w-4 h-4 accent-[#EA580C]"
                    />
                    <span>Visível na vitrine</span>
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-[#0B1F3A] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prodFeatured}
                      onChange={(e) => setProdFeatured(e.target.checked)}
                      className="w-4 h-4 accent-[#EA580C]"
                    />
                    <span>Exibir na Área de Ofertas</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] disabled:opacity-60 rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {editingProductId
                      ? 'Salvar alterações do produto'
                      : 'Publicar produto na vitrine'}
                  </span>
                </button>
              </form>

              {/* Product List */}
              <div className="xl:col-span-7 space-y-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row gap-3">
                  <input
                    type="search"
                    value={prodSearch}
                    onChange={(e) => setProdSearch(e.target.value)}
                    placeholder="Buscar por nome ou marca..."
                    className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
                  />
                  <select
                    value={prodFilterCat}
                    onChange={(e) => setProdFilterCat(e.target.value)}
                    className="px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-[#0B1F3A]"
                  >
                    <option value="all">Todas categorias</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-200 overflow-hidden">
                  {filteredProducts.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        item.visible === false ? 'bg-slate-50 opacity-75' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-16 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-display font-semibold text-sm text-[#0B1F3A] truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {item.brand} ·{' '}
                            {categoryNameMap[item.categoryId] ?? 'Categoria'}
                            {typeof item.price === 'number' && item.price > 0
                              ? ` · R$ ${item.price.toFixed(2).replace('.', ',')}`
                              : ' · Sob consulta'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => void onToggleProductFeatured(item)}
                          title={
                            item.featured
                              ? 'Remover da Área de Ofertas'
                              : 'Colocar na Área de Ofertas'
                          }
                          className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors inline-flex items-center gap-1 ${
                            item.featured
                              ? 'bg-[#EA580C]/10 text-[#EA580C] border-[#EA580C]/35'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-[#EA580C]'
                          }`}
                        >
                          <Tag className="w-3.5 h-3.5" />
                          <span>{item.featured ? 'Em oferta' : 'Oferta'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => void onToggleProductVisibility(item)}
                          title={
                            item.visible === false
                              ? 'Mostrar na vitrine'
                              : 'Ocultar da vitrine'
                          }
                          className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors inline-flex items-center gap-1 ${
                            item.visible === false
                              ? 'bg-slate-100 text-slate-600 border-slate-300'
                              : 'bg-white text-[#0B1F3A] border-slate-200 hover:border-[#0B1F3A]'
                          }`}
                        >
                          {item.visible === false ? (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Oculto</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5 text-[#EA580C]" />
                              <span>Visível</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => loadProductIntoForm(item)}
                          aria-label={`Editar ${item.name}`}
                          className="p-2 text-slate-600 hover:text-[#0B1F3A] hover:bg-slate-100 rounded-lg"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingProductId(null);
                            setProdName(`${item.name} (Cópia)`);
                            setProdBrand(item.brand);
                            setProdCategoryId(item.categoryId);
                            setProdPrice(
                              typeof item.price === 'number'
                                ? String(item.price)
                                : '',
                            );
                            setProdDescription(item.description);
                            setProdImageUrl(item.imageUrl);
                            setProdVisible(true);
                            setProdSortOrder(products.length + 1);
                            notify('Dados copiados para o formulário ao lado.');
                          }}
                          aria-label={`Duplicar ${item.name}`}
                          className="p-2 text-slate-600 hover:text-[#0B1F3A] hover:bg-slate-100 rounded-lg"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        {confirmDeleteProdId === item.id ? (
                          <button
                            type="button"
                            onClick={async () => {
                              await onDeleteProduct(item.id);
                              setConfirmDeleteProdId(null);
                              if (editingProductId === item.id) resetProductForm();
                              notify('Produto excluído.');
                            }}
                            className="px-2.5 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-lg"
                          >
                            Confirmar
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteProdId(item.id)}
                            aria-label={`Excluir ${item.name}`}
                            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {filteredProducts.length === 0 && (
                    <p className="p-8 text-sm text-slate-500 text-center">
                      Nenhum produto encontrado.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div>
              <h1 className="font-display font-bold text-2xl text-[#0B1F3A]">
                Categorias e Variedades
              </h1>
              <p className="text-sm text-slate-600">
                Crie novas categorias, edite nomes ou ajuste a ordem de exibição.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <form
                onSubmit={handleSaveCategorySubmit}
                className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-bold text-lg text-[#0B1F3A]">
                    {editingCatId ? 'Editar categoria' : 'Nova categoria'}
                  </h2>
                  {editingCatId && (
                    <button
                      type="button"
                      onClick={resetCategoryForm}
                      className="text-xs font-semibold text-[#EA580C]"
                    >
                      Cancelar
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                    Nome da categoria *
                  </label>
                  <input
                    type="text"
                    required
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="Ex: Eletrônicos e Cabos"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                    Descrição
                  </label>
                  <textarea
                    rows={3}
                    value={catDescription}
                    onChange={(e) => setCatDescription(e.target.value)}
                    placeholder="Descrição exibida no cartão da categoria..."
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                    Ordem de exibição
                  </label>
                  <input
                    type="number"
                    value={catSortOrder}
                    onChange={(e) => setCatSortOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#0B1F3A]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-lg"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {editingCatId ? 'Salvar categoria' : 'Adicionar categoria'}
                  </span>
                </button>
              </form>

              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl divide-y divide-slate-200 overflow-hidden">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-4 flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#EA580C] tabular-nums">
                          #{cat.sortOrder}
                        </span>
                        <h3 className="font-display font-bold text-base text-[#0B1F3A]">
                          {cat.name}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        {cat.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => loadCategoryIntoForm(cat)}
                        className="p-2 text-slate-600 hover:text-[#0B1F3A] hover:bg-slate-100 rounded-lg"
                        aria-label={`Editar ${cat.name}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {categories.length > 1 &&
                        (confirmDeleteCatId === cat.id ? (
                          <button
                            type="button"
                            onClick={async () => {
                              const fallback = categories.find(
                                (c) => c.id !== cat.id,
                              )?.id;
                              await onDeleteCategory(cat.id, fallback);
                              setConfirmDeleteCatId(null);
                              if (editingCatId === cat.id) resetCategoryForm();
                              notify('Categoria removida.');
                            }}
                            className="px-2.5 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-lg"
                          >
                            Confirmar
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteCatId(cat.id)}
                            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            aria-label={`Excluir ${cat.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: HERO & BRAND */}
        {activeTab === 'hero' && (
          <form onSubmit={handleSaveContentSection} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display font-bold text-2xl text-[#0B1F3A]">
                  Página Inicial e Identidade Visual
                </h1>
                <p className="text-sm text-slate-600">
                  Edite o nome, logotipo, título principal, subtítulo, botões e
                  imagem de capa.
                </p>
              </div>
              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-lg shrink-0"
              >
                <Save className="w-4 h-4" />
                <span>Salvar alterações</span>
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
              <h2 className="font-display font-bold text-base text-[#0B1F3A]">
                Marca e Logotipo
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                    Nome da empresa no cabeçalho
                  </label>
                  <input
                    type="text"
                    required
                    value={draftContent.brandName}
                    onChange={(e) =>
                      setDraftContent({ ...draftContent, brandName: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                    Logotipo personalizado (URL ou upload)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={draftContent.customLogoUrl ?? ''}
                      onChange={(e) =>
                        setDraftContent({
                          ...draftContent,
                          customLogoUrl: e.target.value,
                        })
                      }
                      placeholder="Deixe vazio para usar a logo oficial"
                      className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[#F8FAFC] border border-slate-300 rounded-lg cursor-pointer shrink-0">
                      <ImagePlus className="w-4 h-4 text-[#EA580C]" />
                      <span>Enviar</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageUpload(e, (url) =>
                            setDraftContent((prev) => ({
                              ...prev,
                              customLogoUrl: url,
                            })),
                          )
                        }
                        className="sr-only"
                      />
                    </label>
                    {draftContent.customLogoUrl &&
                      draftContent.customLogoUrl !== OFFICIAL_LOGO_URL && (
                        <button
                          type="button"
                          onClick={() =>
                            setDraftContent({
                              ...draftContent,
                              customLogoUrl: OFFICIAL_LOGO_URL,
                            })
                          }
                          className="px-2.5 py-2 text-xs text-slate-600 bg-slate-100 rounded-lg"
                        >
                          Logo oficial
                        </button>
                      )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
              <h2 className="font-display font-bold text-base text-[#0B1F3A]">
                Capa da Página Inicial (Hero)
              </h2>
              <div>
                <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                  Título principal
                </label>
                <input
                  type="text"
                  required
                  value={draftContent.heroTitle}
                  onChange={(e) =>
                    setDraftContent({ ...draftContent, heroTitle: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                  Subtítulo
                </label>
                <textarea
                  rows={2}
                  required
                  value={draftContent.heroSubtitle}
                  onChange={(e) =>
                    setDraftContent({
                      ...draftContent,
                      heroSubtitle: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                    Texto do botão 1 (Vitrine)
                  </label>
                  <input
                    type="text"
                    required
                    value={draftContent.heroPrimaryCta}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        heroPrimaryCta: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                    Texto do botão 2 (WhatsApp)
                  </label>
                  <input
                    type="text"
                    required
                    value={draftContent.heroSecondaryCta}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        heroSecondaryCta: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                  Linha de destaques abaixo dos botões (separe com ·)
                </label>
                <input
                  type="text"
                  value={draftContent.heroHighlights}
                  onChange={(e) =>
                    setDraftContent({
                      ...draftContent,
                      heroHighlights: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                    Imagem principal da capa
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={draftContent.heroImageUrl}
                      onChange={(e) =>
                        setDraftContent({
                          ...draftContent,
                          heroImageUrl: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[#F8FAFC] border border-slate-300 rounded-lg cursor-pointer shrink-0">
                      <ImagePlus className="w-4 h-4 text-[#EA580C]" />
                      <span>Enviar</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageUpload(e, (url) =>
                            setDraftContent((prev) => ({
                              ...prev,
                              heroImageUrl: url,
                            })),
                          )
                        }
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                    Legenda sobre a imagem
                  </label>
                  <input
                    type="text"
                    value={draftContent.heroImageCaption}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        heroImageCaption: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </form>
        )}

        {/* TAB 5: ABOUT, SECTIONS & WHY CHOOSE */}
        {activeTab === 'about' && (
          <form onSubmit={handleSaveContentSection} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display font-bold text-2xl text-[#0B1F3A]">
                  Sobre, Títulos e Diferenciais
                </h1>
                <p className="text-sm text-slate-600">
                  Edite o texto institucional, títulos das seções e os motivos de
                  escolha.
                </p>
              </div>
              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-lg shrink-0"
              >
                <Save className="w-4 h-4" />
                <span>Salvar alterações</span>
              </button>
            </div>

            {/* About */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h2 className="font-display font-bold text-base text-[#0B1F3A]">
                Seção Sobre nossa empresa
              </h2>
              <div>
                <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                  Título
                </label>
                <input
                  type="text"
                  required
                  value={draftContent.aboutTitle}
                  onChange={(e) =>
                    setDraftContent({ ...draftContent, aboutTitle: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                  Texto institucional
                </label>
                <textarea
                  rows={4}
                  required
                  value={draftContent.aboutText}
                  onChange={(e) =>
                    setDraftContent({ ...draftContent, aboutText: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#0B1F3A]">
                    Pilares institucionais ({draftContent.aboutPillars.length})
                  </span>
                  {draftContent.aboutPillars.length < 6 && (
                    <button
                      type="button"
                      onClick={() =>
                        setDraftContent({
                          ...draftContent,
                          aboutPillars: [
                            ...draftContent.aboutPillars,
                            { title: 'Novo pilar', detail: 'Descrição do pilar.' },
                          ],
                        })
                      }
                      className="text-xs font-semibold text-[#EA580C]"
                    >
                      + Adicionar pilar
                    </button>
                  )}
                </div>
                {draftContent.aboutPillars.map((pillar, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 p-3 bg-[#F8FAFC] rounded-lg border border-slate-200"
                  >
                    <input
                      type="text"
                      value={pillar.title}
                      onChange={(e) => {
                        const next = [...draftContent.aboutPillars];
                        next[idx] = { ...next[idx], title: e.target.value };
                        setDraftContent({ ...draftContent, aboutPillars: next });
                      }}
                      className="sm:col-span-4 px-2.5 py-1.5 text-sm bg-white border border-slate-300 rounded-md"
                    />
                    <input
                      type="text"
                      value={pillar.detail}
                      onChange={(e) => {
                        const next = [...draftContent.aboutPillars];
                        next[idx] = { ...next[idx], detail: e.target.value };
                        setDraftContent({ ...draftContent, aboutPillars: next });
                      }}
                      className="sm:col-span-7 px-2.5 py-1.5 text-sm bg-white border border-slate-300 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const next = draftContent.aboutPillars.filter(
                          (_, i) => i !== idx,
                        );
                        setDraftContent({ ...draftContent, aboutPillars: next });
                      }}
                      className="sm:col-span-1 flex items-center justify-center text-slate-500 hover:text-red-600"
                      aria-label="Remover pilar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Section Titles */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h2 className="font-display font-bold text-base text-[#0B1F3A]">
                Cabeçalhos de Categorias e Vitrine
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                    Título de Marcas e Variedades
                  </label>
                  <input
                    type="text"
                    required
                    value={draftContent.categoriesTitle}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        categoriesTitle: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                    Título da Vitrine de Produtos
                  </label>
                  <input
                    type="text"
                    required
                    value={draftContent.showcaseTitle}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        showcaseTitle: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                    Subtítulo de Marcas e Variedades
                  </label>
                  <textarea
                    rows={2}
                    value={draftContent.categoriesSubtitle}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        categoriesSubtitle: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                    Subtítulo da Vitrine
                  </label>
                  <textarea
                    rows={2}
                    value={draftContent.showcaseSubtitle}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        showcaseSubtitle: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Why Choose */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-base text-[#0B1F3A]">
                  Por que escolher a A.S Imports?
                </h2>
                {draftContent.whyReasons.length < 10 && (
                  <button
                    type="button"
                    onClick={() =>
                      setDraftContent({
                        ...draftContent,
                        whyReasons: [
                          ...draftContent.whyReasons,
                          {
                            title: 'Novo diferencial',
                            description: 'Descrição do diferencial.',
                          },
                        ],
                      })
                    }
                    className="text-xs font-semibold text-[#EA580C]"
                  >
                    + Adicionar diferencial
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                    Título da seção
                  </label>
                  <input
                    type="text"
                    required
                    value={draftContent.whyTitle}
                    onChange={(e) =>
                      setDraftContent({ ...draftContent, whyTitle: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                    Subtítulo
                  </label>
                  <input
                    type="text"
                    value={draftContent.whySubtitle}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        whySubtitle: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {draftContent.whyReasons.map((reason, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 p-3 bg-[#F8FAFC] rounded-lg border border-slate-200"
                  >
                    <input
                      type="text"
                      value={reason.title}
                      onChange={(e) => {
                        const next = [...draftContent.whyReasons];
                        next[idx] = { ...next[idx], title: e.target.value };
                        setDraftContent({ ...draftContent, whyReasons: next });
                      }}
                      className="sm:col-span-4 px-2.5 py-1.5 text-sm bg-white border border-slate-300 rounded-md"
                    />
                    <input
                      type="text"
                      value={reason.description}
                      onChange={(e) => {
                        const next = [...draftContent.whyReasons];
                        next[idx] = { ...next[idx], description: e.target.value };
                        setDraftContent({ ...draftContent, whyReasons: next });
                      }}
                      className="sm:col-span-7 px-2.5 py-1.5 text-sm bg-white border border-slate-300 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const next = draftContent.whyReasons.filter(
                          (_, i) => i !== idx,
                        );
                        setDraftContent({ ...draftContent, whyReasons: next });
                      }}
                      className="sm:col-span-1 flex items-center justify-center text-slate-500 hover:text-red-600"
                      aria-label="Remover diferencial"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* TAB 6: CONTACT & FOOTER */}
        {activeTab === 'contact' && (
          <form onSubmit={handleSaveContentSection} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display font-bold text-2xl text-[#0B1F3A]">
                  Contato, Redes Sociais e Rodapé
                </h1>
                <p className="text-sm text-slate-600">
                  Atualize seu link do WhatsApp, Instagram, redes adicionais e
                  frase do rodapé.
                </p>
              </div>
              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-lg shrink-0"
              >
                <Save className="w-4 h-4" />
                <span>Salvar alterações</span>
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h2 className="font-display font-bold text-base text-[#0B1F3A]">
                WhatsApp e Atendimento
              </h2>
              <div>
                <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                  Link do WhatsApp *
                </label>
                <input
                  type="url"
                  required
                  value={draftContent.whatsappUrl}
                  onChange={(e) =>
                    setDraftContent({
                      ...draftContent,
                      whatsappUrl: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                    Título do bloco de contato
                  </label>
                  <input
                    type="text"
                    required
                    value={draftContent.contactTitle}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        contactTitle: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                    Texto de apoio
                  </label>
                  <input
                    type="text"
                    value={draftContent.contactSubtitle}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        contactSubtitle: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h2 className="font-display font-bold text-base text-[#0B1F3A]">
                Instagram e Outras Redes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                    @ do Instagram
                  </label>
                  <input
                    type="text"
                    value={draftContent.instagramHandle}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        instagramHandle: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                    URL do Instagram
                  </label>
                  <input
                    type="url"
                    value={draftContent.instagramUrl}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        instagramUrl: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                    Nome de outra rede
                  </label>
                  <input
                    type="text"
                    value={draftContent.otherSocialTitle}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        otherSocialTitle: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                    Descrição / Usuário
                  </label>
                  <input
                    type="text"
                    value={draftContent.otherSocialDescription}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        otherSocialDescription: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                    Link (opcional)
                  </label>
                  <input
                    type="url"
                    value={draftContent.otherSocialUrl}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        otherSocialUrl: e.target.value,
                      })
                    }
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h2 className="font-display font-bold text-base text-[#0B1F3A]">
                Rodapé
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                    Nome exibido no copyright
                  </label>
                  <input
                    type="text"
                    required
                    value={draftContent.footerBrandTitle}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        footerBrandTitle: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                    Frase / Slogan do rodapé
                  </label>
                  <input
                    type="text"
                    required
                    value={draftContent.footerSlogan}
                    onChange={(e) =>
                      setDraftContent({
                        ...draftContent,
                        footerSlogan: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

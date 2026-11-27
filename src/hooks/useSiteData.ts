import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
  writeBatch,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_PRODUCTS,
  DEFAULT_SITE_CONTENT,
} from '../data/defaultCatalog';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  isBootstrappedAdminEmail,
  OperationType,
} from '../lib/firebase';
import { CategoryItem, Product, SiteContent } from '../types/catalog';

function sanitizeSiteContentPayload(content: SiteContent): SiteContent {
  return {
    brandName: content.brandName.trim().slice(0, 100) || DEFAULT_SITE_CONTENT.brandName,
    customLogoUrl:
      (content.customLogoUrl ?? '').length <= 395000
        ? content.customLogoUrl ?? ''
        : '',
    heroTitle: content.heroTitle.trim().slice(0, 160) || DEFAULT_SITE_CONTENT.heroTitle,
    heroSubtitle: content.heroSubtitle.trim().slice(0, 300) || DEFAULT_SITE_CONTENT.heroSubtitle,
    heroPrimaryCta: content.heroPrimaryCta.trim().slice(0, 80) || DEFAULT_SITE_CONTENT.heroPrimaryCta,
    heroSecondaryCta: content.heroSecondaryCta.trim().slice(0, 80) || DEFAULT_SITE_CONTENT.heroSecondaryCta,
    heroImageUrl:
      (content.heroImageUrl ?? '').length <= 395000
        ? content.heroImageUrl ?? ''
        : DEFAULT_SITE_CONTENT.heroImageUrl,
    heroImageCaption: (content.heroImageCaption ?? '').slice(0, 180),
    heroHighlights: (content.heroHighlights ?? '').slice(0, 240),
    aboutTitle: content.aboutTitle.trim().slice(0, 120) || DEFAULT_SITE_CONTENT.aboutTitle,
    aboutText: content.aboutText.trim().slice(0, 1500) || DEFAULT_SITE_CONTENT.aboutText,
    aboutPillars: (content.aboutPillars ?? []).slice(0, 6).map((p) => ({
      title: p.title.trim().slice(0, 100),
      detail: p.detail.trim().slice(0, 300),
    })),
    categoriesTitle: content.categoriesTitle.trim().slice(0, 120) || DEFAULT_SITE_CONTENT.categoriesTitle,
    categoriesSubtitle: (content.categoriesSubtitle ?? '').slice(0, 500),
    showcaseTitle: content.showcaseTitle.trim().slice(0, 120) || DEFAULT_SITE_CONTENT.showcaseTitle,
    showcaseSubtitle: (content.showcaseSubtitle ?? '').slice(0, 500),
    whyTitle: content.whyTitle.trim().slice(0, 120) || DEFAULT_SITE_CONTENT.whyTitle,
    whySubtitle: (content.whySubtitle ?? '').slice(0, 400),
    whyReasons: (content.whyReasons ?? []).slice(0, 10).map((r) => ({
      title: r.title.trim().slice(0, 100),
      description: r.description.trim().slice(0, 350),
    })),
    contactTitle: content.contactTitle.trim().slice(0, 140) || DEFAULT_SITE_CONTENT.contactTitle,
    contactSubtitle: (content.contactSubtitle ?? '').slice(0, 600),
    whatsappUrl: content.whatsappUrl.trim().slice(0, 300) || DEFAULT_SITE_CONTENT.whatsappUrl,
    instagramHandle: (content.instagramHandle ?? '').slice(0, 100),
    instagramUrl: (content.instagramUrl ?? '').slice(0, 300),
    otherSocialTitle: (content.otherSocialTitle ?? '').slice(0, 100),
    otherSocialDescription: (content.otherSocialDescription ?? '').slice(0, 240),
    otherSocialUrl: (content.otherSocialUrl ?? '').slice(0, 300),
    footerBrandTitle: content.footerBrandTitle.trim().slice(0, 100) || DEFAULT_SITE_CONTENT.footerBrandTitle,
    footerSlogan: content.footerSlogan.trim().slice(0, 240) || DEFAULT_SITE_CONTENT.footerSlogan,
    updatedAt: new Date().toISOString(),
  };
}

export function useSiteData() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isListedAdmin, setIsListedAdmin] = useState(false);

  const [remoteContent, setRemoteContent] = useState<SiteContent | null>(null);
  const [remoteCategories, setRemoteCategories] = useState<CategoryItem[] | null>(null);
  const [remoteProducts, setRemoteProducts] = useState<Product[] | null>(null);
  const [hasSeededOnce, setHasSeededOnce] = useState<boolean>(false);

  const autoSeedAttemptedRef = useRef(false);

  const isBootstrappedAdmin = Boolean(
    user && user.emailVerified && isBootstrappedAdminEmail(user.email),
  );

  const isAdmin = Boolean(isBootstrappedAdmin || (user?.emailVerified && isListedAdmin));

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.emailVerified) {
        if (isBootstrappedAdminEmail(currentUser.email)) {
          setIsListedAdmin(true);
        } else {
          try {
            const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
            setIsListedAdmin(adminDoc.exists());
          } catch {
            setIsListedAdmin(false);
          }
        }
      } else {
        setIsListedAdmin(false);
      }
      setAuthReady(true);
    });
    return unsubscribe;
  }, []);

  // Real-time listener: siteContent/main
  useEffect(() => {
    const path = 'siteContent/main';
    const unsubscribe = onSnapshot(
      doc(db, 'siteContent', 'main'),
      (snap) => {
        if (snap.exists()) {
          setRemoteContent({
            ...DEFAULT_SITE_CONTENT,
            ...(snap.data() as Partial<SiteContent>),
          });
          setHasSeededOnce(true);
        } else {
          setRemoteContent(null);
        }
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.GET, path);
        } catch {
          // Reported structured error without crashing public storefront
        }
      },
    );
    return unsubscribe;
  }, []);

  // Real-time listener: categories
  useEffect(() => {
    const path = 'categories';
    const unsubscribe = onSnapshot(
      collection(db, 'categories'),
      (snap) => {
        if (!snap.empty) {
          const items: CategoryItem[] = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<CategoryItem, 'id'>),
          }));
          items.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
          setRemoteCategories(items);
          setHasSeededOnce(true);
        } else {
          setRemoteCategories([]);
        }
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, path);
        } catch {
          // Reported structured error without crashing public storefront
        }
      },
    );
    return unsubscribe;
  }, []);

  // Real-time listener: products (admin sees all, public queries visible == true)
  useEffect(() => {
    if (!authReady) return;
    const path = 'products';
    const productsQuery = isBootstrappedAdmin
      ? collection(db, 'products')
      : query(collection(db, 'products'), where('visible', '==', true));

    const unsubscribe = onSnapshot(
      productsQuery,
      (snap) => {
        const items: Product[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Product, 'id'>),
        }));
        items.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
        setRemoteProducts(items);
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.LIST, path);
        } catch {
          // Reported structured error without crashing public storefront
        }
      },
    );
    return unsubscribe;
  }, [authReady, isBootstrappedAdmin]);

  const seedDefaultsToFirestore = useCallback(async () => {
    const batch = writeBatch(db);
    const contentPayload = sanitizeSiteContentPayload(DEFAULT_SITE_CONTENT);
    batch.set(doc(db, 'siteContent', 'main'), contentPayload);

    DEFAULT_CATEGORIES.forEach((cat) => {
      batch.set(doc(db, 'categories', cat.id), {
        name: cat.name,
        description: cat.description,
        sortOrder: cat.sortOrder,
      });
    });

    DEFAULT_PRODUCTS.forEach((prod) => {
      batch.set(doc(db, 'products', prod.id), {
        name: prod.name,
        description: prod.description,
        brand: prod.brand,
        categoryId: prod.categoryId,
        imageUrl: prod.imageUrl,
        price: prod.price ?? null,
        featured: Boolean(prod.featured),
        visible: Boolean(prod.visible),
        sortOrder: prod.sortOrder,
      });
    });

    try {
      await batch.commit();
      setHasSeededOnce(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'batch-seed');
    }
  }, []);

  // Automatically initialize Firestore with default institutional content & catalog on first admin login if empty
  useEffect(() => {
    if (
      authReady &&
      isAdmin &&
      remoteContent === null &&
      remoteCategories !== null &&
      remoteCategories.length === 0 &&
      !autoSeedAttemptedRef.current
    ) {
      autoSeedAttemptedRef.current = true;
      void seedDefaultsToFirestore();
    }
  }, [authReady, isAdmin, remoteContent, remoteCategories, seedDefaultsToFirestore]);

  const siteContent = useMemo(
    () => remoteContent ?? DEFAULT_SITE_CONTENT,
    [remoteContent],
  );

  const categories = useMemo(() => {
    if (remoteCategories && remoteCategories.length > 0) {
      return remoteCategories;
    }
    return hasSeededOnce ? [] : DEFAULT_CATEGORIES;
  }, [remoteCategories, hasSeededOnce]);

  const products = useMemo(() => {
    if (remoteProducts && (remoteProducts.length > 0 || hasSeededOnce)) {
      return remoteProducts;
    }
    return DEFAULT_PRODUCTS;
  }, [remoteProducts, hasSeededOnce]);

  const signInWithGoogle = useCallback(async () => {
    await signInWithPopup(auth, googleProvider);
  }, []);

  const signOutAdmin = useCallback(async () => {
    await signOut(auth);
  }, []);

  const saveSiteContent = useCallback(async (updated: SiteContent) => {
    const path = 'siteContent/main';
    const payload = sanitizeSiteContentPayload(updated);
    try {
      await setDoc(doc(db, 'siteContent', 'main'), payload);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }, []);

  const saveCategory = useCallback(
    async (
      id: string | null,
      data: Omit<CategoryItem, 'id'>,
    ): Promise<string> => {
      const cleanId =
        id ||
        `${
          data.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') || 'categoria'
        }-${Date.now().toString(36).slice(-4)}`;

      const path = `categories/${cleanId}`;
      const payload = {
        name: data.name.trim().slice(0, 80),
        description: data.description.trim().slice(0, 300),
        sortOrder: Number(data.sortOrder) || 0,
      };
      try {
        await setDoc(doc(db, 'categories', cleanId), payload);
        return cleanId;
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    },
    [],
  );

  const deleteCategory = useCallback(
    async (categoryId: string, fallbackCategoryId?: string) => {
      const path = `categories/${categoryId}`;
      try {
        if (fallbackCategoryId && fallbackCategoryId !== categoryId) {
          const affected = products.filter((p) => p.categoryId === categoryId);
          for (const prod of affected) {
            await updateDoc(doc(db, 'products', prod.id), {
              categoryId: fallbackCategoryId,
            });
          }
        }
        await deleteDoc(doc(db, 'categories', categoryId));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    },
    [products],
  );

  const saveProduct = useCallback(
    async (id: string | null, data: Omit<Product, 'id'>) => {
      const cleanId =
        id || `prod-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const path = `products/${cleanId}`;
      const payload = {
        name: data.name.trim().slice(0, 140),
        description: data.description.trim().slice(0, 1000),
        brand: data.brand.trim().slice(0, 80),
        categoryId: data.categoryId,
        imageUrl: (data.imageUrl ?? '').slice(0, 400000),
        price:
          typeof data.price === 'number' && !Number.isNaN(data.price) && data.price >= 0
            ? data.price
            : null,
        featured: Boolean(data.featured),
        visible: Boolean(data.visible),
        sortOrder: Number(data.sortOrder) || 0,
      };
      try {
        await setDoc(doc(db, 'products', cleanId), payload);
        return cleanId;
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      }
    },
    [],
  );

  const deleteProduct = useCallback(async (productId: string) => {
    const path = `products/${productId}`;
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }, []);

  const toggleProductVisibility = useCallback(async (product: Product) => {
    const path = `products/${product.id}`;
    try {
      await updateDoc(doc(db, 'products', product.id), {
        visible: !product.visible,
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }, []);

  const toggleProductFeatured = useCallback(async (product: Product) => {
    const path = `products/${product.id}`;
    try {
      await updateDoc(doc(db, 'products', product.id), {
        featured: !product.featured,
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }, []);

  const restoreDefaultsToFirestore = useCallback(async () => {
    // Delete any custom products/categories not in defaults, then re-seed defaults
    const batch = writeBatch(db);
    const defaultCatIds = new Set(DEFAULT_CATEGORIES.map((c) => c.id));
    const defaultProdIds = new Set(DEFAULT_PRODUCTS.map((p) => p.id));

    products.forEach((p) => {
      if (!defaultProdIds.has(p.id)) {
        batch.delete(doc(db, 'products', p.id));
      }
    });
    categories.forEach((c) => {
      if (!defaultCatIds.has(c.id)) {
        batch.delete(doc(db, 'categories', c.id));
      }
    });

    const contentPayload = sanitizeSiteContentPayload(DEFAULT_SITE_CONTENT);
    batch.set(doc(db, 'siteContent', 'main'), contentPayload);

    DEFAULT_CATEGORIES.forEach((cat) => {
      batch.set(doc(db, 'categories', cat.id), {
        name: cat.name,
        description: cat.description,
        sortOrder: cat.sortOrder,
      });
    });

    DEFAULT_PRODUCTS.forEach((prod) => {
      batch.set(doc(db, 'products', prod.id), {
        name: prod.name,
        description: prod.description,
        brand: prod.brand,
        categoryId: prod.categoryId,
        imageUrl: prod.imageUrl,
        price: prod.price ?? null,
        featured: Boolean(prod.featured),
        visible: Boolean(prod.visible),
        sortOrder: prod.sortOrder,
      });
    });

    try {
      await batch.commit();
      setHasSeededOnce(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'batch-restore');
    }
  }, [products, categories]);

  return {
    user,
    authReady,
    isAdmin,
    siteContent,
    categories,
    products,
    hasSeededOnce,
    signInWithGoogle,
    signOutAdmin,
    saveSiteContent,
    saveCategory,
    deleteCategory,
    saveProduct,
    deleteProduct,
    toggleProductVisibility,
    toggleProductFeatured,
    seedDefaultsToFirestore,
    restoreDefaultsToFirestore,
  };
}

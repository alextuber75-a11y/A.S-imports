/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { AdminDashboard } from './components/AdminDashboard';
import { ContactSection } from './components/ContactSection';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { OffersSection } from './components/OffersSection';
import { ProductShowcase } from './components/ProductShowcase';
import { WhyChooseSection } from './components/WhyChooseSection';
import { useSiteData } from './hooks/useSiteData';
import { Product } from './types/catalog';

function StorefrontApp() {
  const {
    user,
    authReady,
    isAdmin,
    siteContent,
    categories,
    products,
    signInWithGoogle,
    signOutAdmin,
    saveSiteContent,
    saveCategory,
    deleteCategory,
    saveProduct,
    deleteProduct,
    toggleProductVisibility,
    toggleProductFeatured,
    restoreDefaultsToFirestore,
  } = useSiteData();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [adminMode, setAdminMode] = useState<boolean>(
    () => window.location.hash === '#admin',
  );
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash === '#admin') {
        setAdminMode(true);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  function handleOpenAdmin(product?: Product) {
    setProductToEdit(product ?? null);
    setAdminMode(true);
    if (window.location.hash !== '#admin') {
      window.history.replaceState(null, '', '#admin');
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function handleExitAdmin() {
    setAdminMode(false);
    setProductToEdit(null);
    if (window.location.hash === '#admin') {
      window.history.replaceState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  if (adminMode) {
    return (
      <AdminDashboard
        user={user}
        authReady={authReady}
        isAdmin={isAdmin}
        siteContent={siteContent}
        categories={categories}
        products={products}
        initialProductToEdit={productToEdit}
        onExitAdmin={handleExitAdmin}
        onSignInGoogle={signInWithGoogle}
        onSignOut={signOutAdmin}
        onSaveSiteContent={saveSiteContent}
        onSaveProduct={saveProduct}
        onDeleteProduct={deleteProduct}
        onToggleProductVisibility={toggleProductVisibility}
        onToggleProductFeatured={toggleProductFeatured}
        onSaveCategory={saveCategory}
        onDeleteCategory={deleteCategory}
        onRestoreDefaults={restoreDefaultsToFirestore}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-soft-blue-orange text-[#0B1F3A]">
      <Header siteContent={siteContent} />

      <main className="flex-1">
        <HeroSection siteContent={siteContent} />

        <OffersSection
          siteContent={siteContent}
          categories={categories}
          products={products}
        />

        <ProductShowcase
          siteContent={siteContent}
          categories={categories}
          products={products}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />

        <WhyChooseSection siteContent={siteContent} />

        <ContactSection siteContent={siteContent} />
      </main>

      <Footer
        siteContent={siteContent}
        onOpenAdmin={() => handleOpenAdmin()}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <StorefrontApp />
    </ErrorBoundary>
  );
}

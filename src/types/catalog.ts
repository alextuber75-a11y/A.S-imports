export interface CategoryItem {
  id: string;
  name: string;
  description: string;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  brand: string;
  categoryId: string;
  imageUrl: string;
  price?: number | null;
  featured?: boolean;
  visible: boolean;
  sortOrder: number;
}

export interface TextCardItem {
  title: string;
  detail: string;
}

export interface WhyReasonItem {
  title: string;
  description: string;
}

export interface SiteContent {
  brandName: string;
  customLogoUrl?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroImageUrl: string;
  heroImageCaption: string;
  heroHighlights: string;
  aboutTitle: string;
  aboutText: string;
  aboutPillars: TextCardItem[];
  categoriesTitle: string;
  categoriesSubtitle: string;
  showcaseTitle: string;
  showcaseSubtitle: string;
  whyTitle: string;
  whySubtitle: string;
  whyReasons: WhyReasonItem[];
  contactTitle: string;
  contactSubtitle: string;
  whatsappUrl: string;
  instagramHandle: string;
  instagramUrl: string;
  otherSocialTitle: string;
  otherSocialDescription: string;
  otherSocialUrl: string;
  footerBrandTitle: string;
  footerSlogan: string;
  updatedAt?: string;
}

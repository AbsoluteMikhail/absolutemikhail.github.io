export type PageMetadata = {
  title: string;
  siteName?: string;
  description: string;
  robots: string;
  language?: "ru" | "en";
  alternates?: Array<{ language: "ru" | "en"; pathname: string }>;
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  updated?: string;
  ogType?: "website" | "article";
  structuredData?: Record<string, unknown>;
  breadcrumbs?: Array<{ name: string; pathname: string }>;
};

export type PageMetadata = {
  title: string;
  description: string;
  robots: string;
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  updated?: string;
  ogType?: "website" | "article";
  structuredData?: Record<string, unknown>;
  breadcrumbs?: Array<{ name: string; pathname: string }>;
};

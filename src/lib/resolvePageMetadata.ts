import { telegramCommunityUrl } from "@/constants/contactLinks";
import { canonicalUrl, findRouteMetadata, normalizePathname, notFoundMetadata, siteUrl } from "@/constants/routeMetadata.js";
import type { PageMetadata } from "@/lib/pageMetadata";
import { isStudioPath, studioLocale } from "@/lib/studioLocale";

// Shared by client navigation and the static HTML generator. The portfolio
// does not download Academy's catalog unless an Academy URL is requested.
export const resolvePageMetadata = async (pathname: string): Promise<PageMetadata> => {
  const path = normalizePathname(pathname);
  if (path === "/mikhail") return homeMetadata();
  if (isStudioPath(path)) {
    const metadata = findRouteMetadata(path)!;
    const language = studioLocale(path);
    return { ...metadata, language, alternates: [{ language: "ru", pathname: "/" }, { language: "en", pathname: "/en/" }], image: language === "en" ? "/studio-social-en.png" : "/studio-social.png", imageAlt: language === "en" ? "GamePunk — We make games with character." : "GamePunk — Делаем игры с характером.", imageWidth: 1200, imageHeight: 630, structuredData: { "@context": "https://schema.org", "@type": "Organization", name: "GamePunk", url: canonicalUrl(path), description: metadata.description } };
  }
  if (/^\/(en\/)?(privacy|terms)$/.test(path)) {
    const documentPath = path.replace(/^\/en/, "");
    return { ...findRouteMetadata(path)!, language: studioLocale(path), alternates: [{ language: "ru", pathname: `${documentPath}/` }, { language: "en", pathname: `/en${documentPath}/` }] };
  }
  if (path === "/projects") {
    const { projectsIndexMetadata } = await import("@/lib/projectPages");
    return projectsIndexMetadata();
  }
  if (path === "/academy" || path.startsWith("/academy/")) {
    const { getAcademyMetadata } = await import("@/lib/academyRoutes");
    return getAcademyMetadata(path);
  }
  if (path.startsWith("/projects/")) {
    const { findProjectPage, projectPageMetadata } = await import("@/lib/projectPages");
    const project = findProjectPage(path.slice("/projects/".length));
    return project ? projectPageMetadata(project) : notFoundMetadata;
  }
  return findRouteMetadata(path) ?? notFoundMetadata;
};

const homeMetadata = (): PageMetadata => {
  const metadata = findRouteMetadata("/mikhail")!;
  return {
    ...metadata,
    siteName: "Absolute Mikhail",
    image: "/snippet.jpg",
    imageAlt: "Михаил Ефремов — Senior Gameplay Programmer и Unreal Authorized Instructor",
    imageWidth: 1200,
    imageHeight: 630,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Михаил Ефремов",
      alternateName: "Absolute Mikhail",
      url: canonicalUrl("/mikhail"),
      jobTitle: "Senior Gameplay Programmer",
      description: metadata.description,
      image: `${siteUrl}/snippet.jpg`,
      worksFor: {
        "@type": "Organization",
        name: "GamePunk Studio",
      },
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        name: "Unreal Authorized Instructor",
        url: "https://credential.unrealengine.com/b0a726a2-6749-4f13-a1c9-8ebfcc3d6034",
      },
      sameAs: [
        "https://www.youtube.com/@Absolute-Unreal",
        "https://www.twitch.tv/absolutemikhail",
        "https://discord.gg/NkwZ8pqyS6",
        "https://store.steampowered.com/developer/GamePunk-Studio",
        telegramCommunityUrl,
      ],
    },
  };
};

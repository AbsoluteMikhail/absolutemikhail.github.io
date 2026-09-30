import { telegramCommunityUrl } from "@/constants/contactLinks";
import { canonicalUrl, findRouteMetadata, normalizePathname, notFoundMetadata, siteUrl } from "@/constants/routeMetadata.js";
import type { PageMetadata } from "@/lib/pageMetadata";

// Shared by client navigation and the static HTML generator. The portfolio
// does not download Academy's catalog unless an Academy URL is requested.
export const resolvePageMetadata = async (pathname: string): Promise<PageMetadata> => {
  const path = normalizePathname(pathname);
  if (path === "/") return homeMetadata();
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
  const metadata = findRouteMetadata("/")!;
  return {
    ...metadata,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Михаил Ефремов",
      alternateName: "Absolute Mikhail",
      url: canonicalUrl("/"),
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

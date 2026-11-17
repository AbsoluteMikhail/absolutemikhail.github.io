export type StudioLocale = "ru" | "en";

export const studioLocale = (pathname: string): StudioLocale => /^\/en(?:\/(?:privacy|terms))?\/?$/.test(pathname) ? "en" : "ru";
export const isStudioPath = (pathname: string) => pathname === "/" || /^\/en\/?$/.test(pathname);

import type { Metadata } from "next";
import { APP_NAME } from "@/lib/constants";

export const SITE_NAME = APP_NAME;

export const SITE_TAGLINE = "Insurance operations dashboard";

export const SITE_DESCRIPTION =
  "InsureOps is a production-style insurance operations dashboard — policies, claims, payments, KYC documents, and role-gated workflows in one demo. Try it free with five personas and a mock API.";

export const SITE_KEYWORDS = [
  "insurance operations",
  "insurance dashboard",
  "claims management",
  "policy administration",
  "operations software",
  "workflow dashboard",
  "Next.js portfolio",
  "TypeScript dashboard",
  "insurance ops UI",
  "demo dashboard",
];

export const OG_IMAGE_PATH = "/insuraOps.png";
export const OG_IMAGE_WIDTH = 3020;
export const OG_IMAGE_HEIGHT = 1714;
export const OG_IMAGE_ALT =
  "InsureOps landing page — operations software for insurance teams with a live dashboard preview";

/** Set NEXT_PUBLIC_SITE_URL in production (e.g. https://your-app.vercel.app). */
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (url) return url.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function absoluteUrl(path = ""): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildPageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = "/",
  noIndex = false,
}: {
  title: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  const canonical = absoluteUrl(path);
  const imageUrl = absoluteUrl(OG_IMAGE_PATH);

  return {
    title,
    description,
    keywords: SITE_KEYWORDS,
    applicationName: SITE_NAME,
    metadataBase: new URL(getSiteUrl()),
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: imageUrl,
          secureUrl: imageUrl,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: OG_IMAGE_ALT,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export const rootMetadata: Metadata = buildPageMetadata({
  title: `${SITE_NAME} — ${SITE_TAGLINE}`,
  path: "/",
});

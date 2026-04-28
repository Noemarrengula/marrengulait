import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  price?: number;
  currency?: string;
}

export default function DynamicSEO({
  title,
  description,
  image = "https://marrengula-it.co.mz/og-image.png",
  url,
  type = "website",
  price,
  currency = "MZN",
}: SEOProps) {
  const siteName = "Marrengula-IT";
  const defaultTitle = "Marrengula-IT | E-commerce de Tecnologia & Serviços de TI";
  const defaultDescription =
    "Marketplace de tecnologia em Moçambique. Hardware, computadores, acessórios e serviços profissionais de TI.";
  const defaultImage = "https://marrengula-it.co.mz/og-image.png";

  useEffect(() => {
    const updateMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const updateProperty = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const updateTitle = (newTitle: string) => {
      document.title = newTitle;
      const ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement;
      if (ogTitle) ogTitle.content = newTitle;
    };

    updateTitle(title ? `${title} | ${siteName}` : defaultTitle);
    updateMeta("description", description || defaultDescription);
    updateProperty("og:title", title ? `${title} | ${siteName}` : defaultTitle);
    updateProperty("og:description", description || defaultDescription);
    updateProperty("og:image", image || defaultImage);
    updateProperty("og:type", type);
    updateProperty("og:site_name", siteName);
    
    if (url) {
      updateProperty("og:url", url);
      updateMeta("canonical", url);
    }

    if (type === "product" && price) {
      updateProperty("og:product:price:amount", price.toString());
      updateProperty("og:product:price:currency", currency);
    }

    updateProperty("twitter:card", "summary_large_image");
    updateProperty("twitter:title", title ? `${title} | ${siteName}` : defaultTitle);
    updateProperty("twitter:description", description || defaultDescription);
    updateProperty("twitter:image", image || defaultImage);
  }, [title, description, image, url, type, price, currency]);

  return null;
}
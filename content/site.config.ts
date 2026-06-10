import siteData from "./site.json";

export const siteConfig = {
  ...siteData,
  amazon: {
    ...siteData.amazon,
    associateTag:
      process.env.AMAZON_ASSOCIATE_TAG ?? siteData.amazon.associateTag,
  },
};

export type SiteConfig = typeof siteConfig;

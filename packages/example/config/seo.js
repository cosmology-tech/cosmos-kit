const siteUrl = "https://test.cosmoskit.com";
const siteAddress = new URL(siteUrl);
const canonical = siteAddress.href.slice(0, -1);
const title = "CosmosKit Testing";
const description = "Test site for CosmosKit";
const fbAppId = null;
module.exports = {
  title,
  canonical,
  description,
  openGraph: {
    type: "website",
    url: siteUrl,
    title,
    description,
    site_name: title,
    images: [
      {
        url: canonical + "/og_image.png",
        // width: 942,
        // height: 466,
        alt: title,
      },
    ],
  },
  twitter: {
    handle: "@cosmology_tech",
    site: "@cosmology_tech",
  },
  facebook: fbAppId
    ? {
        appId: fbAppId,
      }
    : undefined,
};

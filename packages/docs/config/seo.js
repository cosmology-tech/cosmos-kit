const siteUrl = 'https://docs.cosmoskit.com';
const siteAddress = new URL(siteUrl);
const canonical = siteAddress.href.slice(0, -1);
const title = 'Cosmology™';
const description =
  'Cosmology is built from the ground up to catalyze web3 development in the Cosmos.';
const fbAppId = null;
module.exports = {
  title,
  canonical,
  description,
  openGraph: {
    type: 'website',
    url: siteUrl,
    title,
    description,
    site_name: title,
    images: [
      {
        url: canonical + '/og/image.jpg',
        width: 942,
        height: 466,
        alt: title
      }
    ]
  },
  twitter: {
    handle: '@cosmology_tech',
    site: '@cosmology_tech'
  },
  facebook: fbAppId
    ? {
        appId: fbAppId
      }
    : undefined
};

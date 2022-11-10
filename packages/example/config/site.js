const siteUrl = 'https://test.cosmoskit.com';
const siteAddress = new URL(siteUrl);
const canonical = siteAddress.href.slice(0, -1);

module.exports = {
  company: {
    nick: 'CosmosKit',
    name: 'CosmosKit',
    addr: ['San Francisco, CA'],
    legalCounty: 'San Francisco',
    legalState: 'California'
  },
  site: {
    siteUrl,
    www: `www.${siteAddress.host}`,
    host: siteAddress.host,
    canonical
  },
  emails: {
    hello: 'hello@cosmology.tech',
    support: 'support@cosmology.tech',
    abuse: 'abuse@cosmology.tech',
    privacy: 'privacy@cosmology.tech',
    legal: 'legal@cosmology.tech',
    copyright: 'copyright@cosmology.tech',
    arbitrationOptOut: 'arbitration-opt-out@cosmology.tech'
  }
};

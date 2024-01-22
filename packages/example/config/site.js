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
    hello: 'hello@cosmology.zone',
    support: 'support@cosmology.zone',
    abuse: 'abuse@cosmology.zone',
    privacy: 'privacy@cosmology.zone',
    legal: 'legal@cosmology.zone',
    copyright: 'copyright@cosmology.zone',
    arbitrationOptOut: 'arbitration-opt-out@cosmology.zone'
  }
};

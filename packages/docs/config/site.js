const siteUrl = 'https://docs.cosmoskit.com';
const siteAddress = new URL(siteUrl);
const canonical = siteAddress.href.slice(0, -1);

module.exports = {
  company: {
    nick: 'Cosmology',
    name: 'Cosmology',
    addr: ['San Francisco, CA'],
    legalCounty: 'San Francisco',
    legalState: 'California'
  },
  site: {
    siteUrl,
    www: `www.${siteAddress.host}`,
    host: siteAddress.host
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

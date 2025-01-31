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
    hello: 'hello@hyperweb.io',
    support: 'support@hyperweb.io',
    abuse: 'abuse@hyperweb.io',
    privacy: 'privacy@hyperweb.io',
    legal: 'legal@hyperweb.io',
    copyright: 'copyright@hyperweb.io',
    arbitrationOptOut: 'arbitration-opt-out@hyperweb.io'
  }
};

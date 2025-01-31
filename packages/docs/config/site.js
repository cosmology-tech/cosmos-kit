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
    hello: 'hello@hyperweb.io',
    support: 'support@hyperweb.io',
    abuse: 'abuse@hyperweb.io',
    privacy: 'privacy@hyperweb.io',
    legal: 'legal@hyperweb.io',
    copyright: 'copyright@hyperweb.io',
    arbitrationOptOut: 'arbitration-opt-out@hyperweb.io'
  }
};

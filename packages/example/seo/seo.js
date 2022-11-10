const fs = require('fs');
const seo = require('../config/seo');
const canonical = seo.canonical;
const siteInfo = require('../config/site');
const PAGE_DIR = __dirname + '/../pages/';
const pageObjects = {};
const legalPageObjects = {};

const IGNORE = [
  '404',
  '_document',
  '_app',
  'api/hello',
  'app',
  'test-balances',
  'test-swaps'
];

// FOR NOW keep this stuff out
// later when you generate a sitemap page, you can categorize this in Legal
const LEGAL_FILES = [
  'disclaimer',
  'acceptable-use-policy',
  'brand-guidelines',
  'cookie-policy',
  'copyright-policy',
  'corporate-colors',
  'credits',
  'data-processing-addendum',
  'developer-terms-of-use',
  'logo-guidelines',
  'security-measures'
];
const path = require('path');

const walkSync = (dir) => {
  // Get all files of the current directory & iterate over them
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    // Construct whole file-path & retrieve file's stats
    const filePath = `${dir}${file}`;
    const fileStat = fs.statSync(filePath);

    if (fileStat.isDirectory()) {
      // Recurse one folder deeper
      walkSync(`${filePath}/`);
    } else {
      // Construct this file's pathname excluding the "pages" folder & its extension
      let cleanFileName = filePath
        .substr(0, filePath.lastIndexOf('.'))
        .replace(PAGE_DIR, '');

      if (path.extname(filePath) !== '.tsx') {
        return;
      }

      // any index.js pages will be renamed to /
      if (cleanFileName.match(/\/index$/) || cleanFileName === 'index') {
        cleanFileName = cleanFileName.replace(/\/?index$/, '');
      }

      if (!IGNORE.includes(cleanFileName)) {
        // Add this file to `pageObjects`
        if (LEGAL_FILES.includes(cleanFileName)) {
          legalPageObjects[`/${cleanFileName}`] = {
            page: `/${cleanFileName}`,
            lastModified: fileStat.mtime
          };
        } else {
          pageObjects[`/${cleanFileName}`] = {
            page: `/${cleanFileName}`,
            lastModified: fileStat.mtime
          };
        }
      }
    }
  });
};

// Start recursion to fill `pageObjects`
walkSync(PAGE_DIR);

function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

const pageSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> 
  ${Object.keys(pageObjects)
    .map(
      (path) => `<url>
    <loc>${canonical}${path}</loc>
    <lastmod>${formatDate(new Date(pageObjects[path].lastModified))}</lastmod>
  </url>`
    )
    .join('\n')}
</urlset>`;

const legalSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> 
  ${Object.keys(legalPageObjects)
    .map(
      (path) => `<url>
    <loc>${canonical}${path}</loc>
    <lastmod>${formatDate(
      new Date(legalPageObjects[path].lastModified)
    )}</lastmod>
  </url>`
    )
    .join('\n')}
</urlset>`;

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<sitemap>
<loc>${canonical}/sitemaps/legal.xml</loc>
<loc>${canonical}/sitemaps/pages.xml</loc>
</sitemap>
</sitemapindex>
`;

const BAD_AGENTS = [
  {
    text: 'Search engines only please :) Thanks for obeying robots.txt',
    bots: ['UbiCrawler', 'DOC', 'Zao', 'discobot', 'dotbot', 'yacybot']
  },
  {
    text: "Dear bots, we don't appreciate you copying site content and providing very little additional value.",
    bots: [
      'sitecheck.internetseer.com',
      'Zealbot',
      'MJ12bot',
      'MSIECrawler',
      'SiteSnagger',
      'WebStripper',
      'WebCopier',
      'Fetch',
      'Offline Explorer',
      'Teleport',
      'TeleportPro',
      'WebZIP',
      'linko',
      'HTTrack',
      'Microsoft.URL.Control',
      'Xenu',
      'larbin',
      'libwww',
      'ZyBORG',
      'Download Ninja'
    ]
  },
  {
    text: 'Recursive mode wget is not friendly',
    bots: ['wget', 'grub-client']
  },
  {
    text: "I realize you don't follow robots.txt, but FYI",
    bots: ['k2spider']
  },
  {
    text: 'Abusive bots',
    bots: ['NPBot']
  }
];

const robotsTxt = `
#
# Dear bot, crawler or kind technical person who wishes to crawl ${
  siteInfo.site.host
},
#   please email ${
  siteInfo.emails.support
}. We require whitelisting to access our sitemap. 
#
#   Thanks in advance! Your friendly Ops Team @ ${seo.title}.

${BAD_AGENTS.map(({ text, bots }) => {
  return `
#
# ${text}
#

  ${bots
    .map((bot) => {
      return `
User-agent: ${bot}
Disallow: /`;
    })
    .join('\n')}
  `;
}).join('')}

User-agent: *

${Object.keys(pageObjects)
  .map((path) => `Allow: ${path}$`)
  .join('\n')}

Sitemap: ${canonical}/sitemaps/pages.xml
Sitemap: ${canonical}/sitemaps/legal.xml

Host: ${siteInfo.site.host}

`;

fs.writeFileSync('out/sitemap.xml', sitemapXml);
require('mkdirp').sync('out/sitemaps');
fs.writeFileSync('out/sitemaps/pages.xml', pageSitemapXml);
fs.writeFileSync('out/sitemaps/legal.xml', legalSitemapXml);
fs.writeFileSync('out/robots.txt', robotsTxt);

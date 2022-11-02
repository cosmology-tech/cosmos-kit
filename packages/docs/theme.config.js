import { useConfig } from 'nextra-theme-docs';
import React from "react";

/* eslint sort-keys: error */
/**
 * @type {import('nextra-theme-docs').DocsThemeConfig}
 */
export default {
  footer: {
    text: `BSD ${new Date().getFullYear()} © ComosKit.`,
  },
  chat: {
    link: 'https://discord.gg/6hy8KQ9aJY'
  },
  project: {
    link: 'https://github.com/cosmology-tech/cosmos-kit'
  },
  docsRepositoryBase:
    'https://github.com/cosmology-tech/cosmos-kit/tree/develop/packages/docs',
  editLink: {
    text: 'Edit this page on GitHub'
  },
  getNextSeoProps() {
    const { frontMatter } = useConfig()
    return {
      additionalLinkTags: [
        {
          href: '/apple-icon-180x180.png',
          rel: 'apple-touch-icon',
          sizes: '180x180'
        },
        {
          href: '/android-icon-192x192.png',
          rel: 'icon',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          href: '/favicon-96x96.png',
          rel: 'icon',
          sizes: '96x96',
          type: 'image/png'
        },
        {
          href: '/favicon-32x32.png',
          rel: 'icon',
          sizes: '32x32',
          type: 'image/png'
        },
        {
          href: '/favicon-16x16.png',
          rel: 'icon',
          sizes: '16x16',
          type: 'image/png'
        }
      ],
      additionalMetaTags: [
        { content: 'en', httpEquiv: 'Content-Language' },
        { content: 'CosmosKit', name: 'apple-mobile-web-app-title' },
        { content: '#fff', name: 'msapplication-TileColor' },
        { content: '/ms-icon-144x144.png', name: 'msapplication-TileImage' }
      ],
      description:
        frontMatter.description || 'CosmosKit: the Cosmos apps builder',
      openGraph: {
        images: [
          { url: frontMatter.image }
        ]
      },
      titleTemplate: '%s – CosmosKit',
      twitter: {
        cardType: 'summary_large_image',
        site: 'https://cosmoskit.com/'
      }
    }
  },
  logo: (
    <>
      <img src="https://cosmology.tech/logos/cosmology/logo.svg" width="50px"></img>
      <span className="mr-2 font-extrabold hidden md:inline">CosmosKit</span>
    </>
  ),
}

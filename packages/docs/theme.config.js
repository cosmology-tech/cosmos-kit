import { useConfig } from "nextra-theme-docs";
import React from "react";

/**
 * @type {import('nextra-theme-docs').DocsThemeConfig}
 */
export default {
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="CosmosKit" />
      <meta property="og:description" content="the crypto wallet connector" />
    </>
  ),
  sidebar: {
    defaultMenuCollapseLevel: 1,
  },
  footer: {
    // text: `BSD ${new Date().getFullYear()} © ComosKit.`,
    text: (
      <span>
        🛠 Built by Cosmology — if you like our tools, please consider delegating
        to{" "}
        <a
          href="https://cosmology.tech/validator"
          target="_blank"
          rel="noreferrer"
          aria-selected="false"
          className="nx-text-primary-500 nx-underline nx-decoration-from-font [text-underline-position:under]"
        >
          our validator ⚛️
        </a>
      </span>
    ),
  },
  chat: {
    link: "https://discord.gg/6hy8KQ9aJY",
  },
  project: {
    link: "https://github.com/cosmology-tech/cosmos-kit",
  },
  docsRepositoryBase:
    "https://github.com/cosmology-tech/cosmos-kit/tree/develop/packages/docs",
  editLink: {
    text: "Edit this page on GitHub",
  },
  logo: (
    <>
      <img
        src="https://user-images.githubusercontent.com/545047/190171432-5526db8f-9952-45ce-a745-bea4302f912b.svg"
        width="50px"
      ></img>
      <span className="mr-2 font-extrabold hidden md:inline">
        &nbsp;&nbsp;CosmosKit
      </span>
    </>
  ),
};

import React from "react";
import { DocsThemeConfig, useConfig } from "nextra-theme-docs";
import { useRouter } from "next/router";

const config: DocsThemeConfig = {
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
  project: {
    link: "https://github.com/hyperweb-io/cosmos-kit",
  },
  useNextSeoProps() {
    const { asPath } = useRouter();
    if (asPath !== "/") {
      return {
        titleTemplate: "%s – CosmosKit",
      };
    } else {
      return {
        titleTemplate: "%s",
      };
    }
  },
  head: () => {
    const { asPath, defaultLocale, locale } = useRouter();
    const { title } = useConfig();
    const url =
      "https://docs.cosmoskit.com/" +
      (defaultLocale === locale ? asPath : `/${locale}${asPath}`);

    const _title = asPath !== "/" ? `${title} - CosmosKit` : `${title}`;
    return (
      <>
        <meta property="og:url" content={url} />
        <meta property="og:title" content={_title} />
        <meta
          property="og:description"
          content={"The crypto wallet connector"}
        />
        <title>{_title}</title>
      </>
    );
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
  },
  footer: {
    text: (
      <span>
        🛠 Built by Cosmology — if you like our tools, please consider delegating
        to{" "}
        <a
          href="https://hyperweb.io/validator"
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
  docsRepositoryBase:
    "https://github.com/hyperweb-io/cosmos-kit/tree/main/packages/docs",
  editLink: {
    text: "Edit this page on GitHub",
  },
};

export default config;

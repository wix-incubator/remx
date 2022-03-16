module.exports = {
  title: "Remx",
  tagline: "An easy to use state manager", //TODO: change to descriptive tagline
  url: "https://wix.github.io",
  baseUrl: "/remx/",
  onBrokenLinks: "throw",
  favicon: "img/favicon.ico",
  organizationName: "wix", // Usually your GitHub org/user name.
  projectName: "remx", // Usually your repo name.
  themeConfig: {
    navbar: {
      title: "Remx",
      logo: {
        alt: "Remx Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          to: "docs/introduction/getting-started",
          activeBasePath: "docs/introduction/",
          label: "Docs",
          position: "left",
        },
        { to: "docs/api", label: "API", position: "left" },
        {
          href: "https://github.com/wix/remx",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Getting Started",
              to: "docs/introduction/getting-started",
            },
            {
              label: "Why Remx",
              to: "docs/introduction/why-remx",
            },
            {
              label: "API",
              to: "docs/api/",
            },
          ],
        },
        {
          title: "Find us",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/wix/remx",
            },
            {
              label: "Contribute",
              href: "https://github.com/wix/remx/issues",
            },
            {
              label: "Wix Engineering",
              href: "https://www.wix.engineering/",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} <a href="https://www.wix.com/">Wix.com, Inc.</a>`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/wix/remx/edit/master/website/",
          docLayoutComponent: "@site/src/components/CustomLayout",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};

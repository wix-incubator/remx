module.exports = {
  title: 'Remx',
  tagline: '',//TODO: add descriptive tagline
  url: 'https://wix.github.io',
  baseUrl: '/remx/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'wix', // Usually your GitHub org/user name.
  projectName: 'remx', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Remx',
      logo: {
        alt: 'Remx Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/introduction/getting-started',
          activeBasePath: 'docs/introduction/',
          label: 'Docs',
          position: 'left',
        },
        {to: 'docs/api', label: 'API', position: 'left'},
        {
          href: 'https://github.com/wix/remx',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Why?',
              to: 'docs/',
            },
            {
              label: 'API',
              to: 'docs/api/',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/wix/remx',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Wix.com, Inc.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/wix/remx/edit/master/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};

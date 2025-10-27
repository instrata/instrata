import { DefaultTheme, defineConfig } from "vitepress";

export default defineConfig({
  lang: "en-US",
  themeConfig: {
    nav: nav(),
    sidebar: sidebar(),
  },
});

function nav(): DefaultTheme.NavItem[] {
  return [
      { text: "Home", link: "/" },
      { text: "Guide", activeMatch: "/guide/", link: "/guide/introduction" },
  ];
}

function sidebar(): DefaultTheme.Sidebar {
  return {
      "/guide/": [
          {
              text: "Guide",
              items: [
                  { text: "Introduction", link: "/guide/introduction" },
                  { text: "Installation", link: "/guide/installation" },
                  { text: "Usage", link: "/guide/usage" },
                  { text: "Templates", link: "/guide/templates" },
                  { text: "Features", link: "/guide/features" },
                  { text: "Troubleshooting", link: "/guide/troubleshooting" },
              ],
          },
      ],
  };
}

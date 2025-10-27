import { defineConfig } from 'vitepress';
import markdownItTaskCheckbox from "markdown-it-task-checkbox";
import mditPluginIconify, { createIconRenderer, mditPluginIconifyPattern, parseAttrs } from "mdit-plugin-iconify";

import { icons as lucideIcons } from "@iconify-json/lucide";
import { icons as simpleIcons } from "@iconify-json/simple-icons";


const iconRenderer = createIconRenderer({
  collections: {
    lucide: lucideIcons,
    social: simpleIcons,
  },
  defaultCollection: "lucide",
});


// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Instrata",
  description: "Instrata is a tool for creating step-by-step guides from automatic screenshots.",

  rewrites: {
    "en/:rest*": ":rest*",
  },

  srcExclude: ["**/README.md", "**/TODO.md"],
  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,
  ignoreDeadLinks: "localhostLinks",

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en' }],
    ['meta', { property: 'og:title', content: 'Instrata' }],
    ['meta', { property: 'og:site_name', content: 'Instrata' }],
    ['meta', { property: 'og:image', content: 'https://instrata.github.io/og-image.png' }],
    ['meta', { property: 'og:image:type', content: 'image/png' }],
    ['meta', { property: 'og:url', content: 'https://instrata.github.io/' }],
  ],

  sitemap: {
    hostname: 'https://instrata.github.io',
  },

  themeConfig: {
    logo: {
      light: "/instrata-light.svg",
      dark: "/instrata-dark.svg",
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/instrata/instrata' },
    ],
    footer: {
      copyright: `Copyright © 2025-present <a href='https://github.com/instrata/' target="_blank" rel="noopener noreferrer" ">Instrata</a>`,
    },
    search: {
      provider: 'local',
    },
  },

  markdown: {
    config(md) {
      md.use(markdownItTaskCheckbox);
      md.use(mditPluginIconify, iconRenderer);
    },
    image: {
      lazyLoading: true,
    },
  },
    transformPageData(pageData) {
  if ('features' in pageData.frontmatter && Array.isArray(pageData.frontmatter.features)) {
    for (const feature of pageData.frontmatter.features) {
      if ('icon' in feature && typeof feature.icon === "string") {
        feature.icon = feature.icon.replaceAll(mditPluginIconifyPattern, (_, maybeCollection, name, attrStr) => {
          return iconRenderer(maybeCollection, name, parseAttrs(attrStr));
        });
      }
    }
  }
},
});

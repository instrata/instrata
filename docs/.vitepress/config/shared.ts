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
    ['meta', { name: "google-site-verification", content: "s-RFUyj8uPAfBi5liG2lNJMYw9dg6QuM2EPSH7DDKgc" }],
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
      {
        icon: { svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 32 32" style="fill:none;"><circle cx="16" cy="16.5" r="10"/><circle cx="16" cy="28.5" r="1.997"/><path d="M13.736 3.236h4.528v.028h-4.528z" style="stroke-width:1.47164;stroke-linejoin:round" transform="translate(0 .5)"/><path d="M15.728 4.307h.505v.386h-.505z" style="stroke-width:1.6138" transform="translate(0 .5)"/><rect width=".112" height="6.612" x="15.944" y="9.944" ry="0" style="stroke-width:1.88771;stroke-linejoin:round"/><rect width=".208" height="3.208" x="6.199" y="-25.263" ry="0" style="stroke-width:1.79156;stroke-linejoin:round" transform="rotate(120)"/><path d="M8.581 23.354c-3.753 2.295.83 5.934 5.61 5.895M23.419 23.354c3.754 2.295-.83 5.934-5.61 5.895" style="stroke-width:2;stroke-linecap:butt;stroke-linejoin:round"/><path d="M12.022 6.469c-.95-4.437-1.422-4.93-3.006-4.97-2.573 0-7.015 7.951-5.01 9.529 3.006 2.397 5.611-4.56 5.611-4.56l.401.994M19.978 6.469c.95-4.437 1.422-4.93 3.006-4.97 2.573 0 7.015 7.951 5.01 9.529-3.006 2.397-5.611-4.56-5.611-4.56l-.401.994" style="stroke-width:1.99937;stroke-linecap:butt;stroke-linejoin:round"/></svg>` },
        link: "https://instrata.github.io/benchbark",
      },
    ],
    footer: {
      copyright: `Copyright © 2025-present <a href='https://github.com/instrata/' target="_blank" rel="noopener noreferrer">Instrata</a>`,
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

<script setup lang="ts">
import {type Locale, useI18n} from "vue-i18n";
import {Button} from "@/components/ui/button";
import { Icon } from "@iconify/vue";
import ICON_DE from "@iconify-icons/flag/de-4x3";
import ICON_EN from "@iconify-icons/flag/gb-eng-4x3";

const LOCALE2ICON: Record<string, typeof ICON_EN> = {
  "de": ICON_DE,
  "en": ICON_EN,
};

const { availableLocales, locale: activeLocale } = useI18n({ useScope: "global" });

function setLocale(locale: Locale) {
  activeLocale.value = locale;
  localStorage.setItem("i18n-locale", locale);
}
</script>

<template>
  <div class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,calc(var(--spacing)*48)),1fr))] justify-items-stretch items-stretch gap-4">
    <div v-for="locale in availableLocales" :key="locale">
      <Button :variant="activeLocale === locale ? 'secondary' : 'outline'" @click="setLocale(locale)" class="flex-col w-full h-full text-xl shadow-sm">
        <Icon :icon="LOCALE2ICON[locale]" class="size-16" />
        <span>
          {{ $t(`settings.languages.locale`, 0, { locale }) }}
        </span>
      </Button>
    </div>
  </div>
</template>

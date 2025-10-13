<script setup lang="ts">
import { type Component, computed, ref } from "vue";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {LucideBrush, LucideCommand, LucideFileCode, LucideInfo, LucideLanguages, LucideSettings} from "lucide-vue-next";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider
} from "@/components/ui/sidebar";
import {
  SettingsMenuAbout,
  SettingsMenuAppearance,
  SettingsMenuKeybindings, SettingsMenuLanguages,
  SettingsMenuTemplates
} from "@/components/pages/settings/menus";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { useI18n } from "vue-i18n";

defineOptions({
  inheritAttrs: false,
});

const { t } = useI18n();

type SettingsMenu = {
  id: string
  icon?: Component
  label: () => string
  component: Component
}

const menus: SettingsMenu[] = [
  {
    id: "appearance",
    icon: LucideBrush,
    label: () => t('settings.appearance.label'),
    component: SettingsMenuAppearance,
  },
  {
    id: "languages",
    icon: LucideLanguages,
    label: () => t('settings.languages.label'),
    component: SettingsMenuLanguages,
  },
  {
    id: "keybindings",
    icon: LucideCommand,
    label: () => t('settings.keybindings.label'),
    component: SettingsMenuKeybindings,
  },
  {
    id: "templates",
    icon: LucideFileCode,
    label: () => t('settings.templates.label'),
    component: SettingsMenuTemplates,
  },
  {
    id: "about",
    icon: LucideInfo,
    label: () => t('settings.about.label'),
    component: SettingsMenuAbout,
  }
];

const open = ref(false);
const activeMenuId = ref<string>(menus[0].id);

const activeMenu = computed(() => menus.find(menu => menu.id === activeMenuId.value));
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot>
        <Button variant="ghost" size="sm">
          <LucideSettings />
          Settings
        </Button>
      </slot>
    </DialogTrigger>
    <DialogContent class="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
      <DialogTitle class="sr-only">
        Settings
      </DialogTitle>
      <DialogDescription class="sr-only">
        Customize your settings here.
      </DialogDescription>
      <SidebarProvider class="items-start">
        <Sidebar collapsible="none" class="hidden md:flex">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem v-for="menuItem in menus" :key="menuItem.id">
                    <SidebarMenuButton
                        as-child
                        :is-active="activeMenuId === menuItem.id"
                        @click="activeMenuId = menuItem.id"
                    >
                      <div>
                        <component v-if="menuItem.icon" :is="menuItem.icon" />
                        <div v-else class="size-4"  />
                        <span class="select-none">
                          {{ menuItem.label() }}
                        </span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main class="flex h-[480px] flex-1 flex-col overflow-hidden">
          <header class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] easy-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div class="flex items-center gap-2 px-4">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem class="hidden select-none md:block">
                    Settings
                  </BreadcrumbItem>
                  <BreadcrumbSeparator class="hidden md:block" />
                  <BreadcrumbItem class="select-none">
                    <BreadcrumbPage>
                      {{ activeMenu?.label() }}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div class="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0 break-all">
            <component v-if="activeMenu" :is="activeMenu.component" />
          </div>
        </main>
      </SidebarProvider>
    </DialogContent>
  </Dialog>
</template>

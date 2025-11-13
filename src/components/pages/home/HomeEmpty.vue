<script setup lang="ts">
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { LucideBadgePlus, LucideSquareArrowOutUpRight } from "lucide-vue-next";
import { ImportGuideButton, NewGuideButton } from "@/components/pages/home/home-actions";
import { ExternalLink } from "@/components/ui2/external-link";
import { Button } from "@/components/ui/button";
</script>

<template>
  <Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <LucideBadgePlus />
      </EmptyMedia>
      <EmptyTitle>
        {{ $t('home.empty.title') }}
      </EmptyTitle>
      <EmptyDescription>
        {{ $t('home.empty.description') }}
      </EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <div class="flex gap-2">
        <NewGuideButton />
        <ImportGuideButton />
      </div>
    </EmptyContent>
    <ExternalLink href="https://instrata.github.io/guide/usage">
      <Button variant="link" size="sm" class="text-muted-foreground">
        {{ $t('home.empty.learn-more') }}
        <LucideSquareArrowOutUpRight />
      </Button>
    </ExternalLink>
  </Empty>
</template>

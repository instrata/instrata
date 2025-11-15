<script setup lang="ts">
import type { BBox } from "@/types/common.ts";

type Size = {
  width: number
  height: number
}

defineProps<{
  size: Size
  crop: BBox | null
}>();
</script>

<template>
  <svg :viewBox="`0 0 ${size.width} ${size.height}`">
    <defs>
      <mask id="mask">
        <rect
            width="100%"
            height="100%"
            fill="white"
        />
        <rect
            v-if="crop"
            :x="crop.x"
            :y="crop.y"
            :width="crop.width"
            :height="crop.height"
            fill="black"
        />
      </mask>
    </defs>

    <rect
        width="100%"
        height="100%"
        fill="blue"
        fill-opacity="15%"
        mask="url(#mask)"
    />

    <rect
        v-if="crop"
        :x="crop.x"
        :y="crop.y"
        :width="crop.width"
        :height="crop.height"
        fill="none"
        stroke="lightblue"
        stroke-width="2"
        stroke-opacity="50%"
    />
  </svg>
</template>

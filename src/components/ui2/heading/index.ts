import { cva, type VariantProps } from "class-variance-authority";

export { default as Heading } from "./Heading.vue";

export const headingVariants = cva(
    'flex gap-2 items-center [&>svg]:size-[1em]',
    {
      variants: {
        variant: {
          'h1': 'text-2xl font-extrabold border-b border-border',
          'h2': 'text-xl font-bold border-b border-border',
          'h3': 'text-lg font-semibold border-b border-border',
          'h4': 'text-base font-medium',
          'h5': 'text-sm font-normal',
          'h6': 'text-xs font-light',
        }
      },
      defaultVariants: {
        variant: 'h2',
      },
    },
);

export type HeadingVariants = VariantProps<typeof headingVariants>

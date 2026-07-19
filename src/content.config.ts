import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    author: z.string().default('CreatineCalc Research Team'),
    category: z.string().default('Creatine'),
    // Posts are illustrated with the shared social card unless they ship their
    // own artwork; every card therefore always has an image to render.
    image: z.string().default('/og-image.png'),
    imageAlt: z.string().optional(),

    lastUpdated: z.coerce.date().optional(),
    keywords: z.array(z.string()).default([]),
    references: z.array(z.string()).default([]),
    reviewedBy: z.string().optional(),
    draft: z.boolean().default(false),
    faq: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
          display: z.boolean().default(true),
        }),
      )
      .default([]),
  }),
});

export const collections = { blog };

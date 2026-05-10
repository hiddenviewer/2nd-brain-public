import { defineCollection, z } from 'astro:content'

const notes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['ai', 'apple', 'investing', 'language', 'travel']),
    noteType: z.enum(['visual-note', 'research-note', 'deck']),
    status: z.enum(['draft', 'published']),
    featured: z.boolean().default(false),
    updated: z.coerce.date(),
    confidence: z.enum(['low', 'medium', 'high']),
    tags: z.array(z.string()).default([]),
    sources: z.array(z.object({
      label: z.string(),
      url: z.string().optional(),
    })).default([]),
  }),
})

export const collections = { notes }

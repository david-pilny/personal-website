import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const workSchema = z.object({
  title: z.string(),
  slug: z.string(),
  order: z.number(),
  category: z.enum(['product', 'client', 'play', 'writing']),
  stack: z.array(z.string()),
  role: z.string(),
  period: z.string(),
  url: z.string().optional(),
  summary: z.string(),
})

const cvSchema = z.object({
  name: z.string(),
  role: z.string(),
  location: z.string(),
  remote: z.string(),
  email: z.string(),
  phone: z.string(),
  github: z.string(),
  linkedin: z.string(),
  experience: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      period: z.string(),
      note: z.string().optional(),
      category: z.enum(['product', 'client', 'play', 'writing']),
      projects: z.array(
        z.object({
          name: z.string().optional(),
          bullets: z.array(z.string()),
        }),
      ),
    }),
  ),
  education: z.object({
    degree: z.string(),
    school: z.string(),
    faculty: z.string(),
    period: z.string(),
    thesis: z.string(),
    thesisTech: z.string(),
  }),
  languages: z.array(
    z.object({
      name: z.string(),
      level: z.string(),
      cert: z.string().optional(),
    }),
  ),
  skills: z.array(
    z.object({
      group: z.string(),
      items: z.array(z.string()),
    }),
  ),
})

export default defineContentConfig({
  collections: {
    // One collection per authored locale. ru/de fall back to en at query time.
    work_en: defineCollection({
      type: 'page',
      source: 'en/work/*.md',
      schema: workSchema,
    }),
    work_cs: defineCollection({
      type: 'page',
      source: 'cs/work/*.md',
      schema: workSchema,
    }),
    cv_en: defineCollection({
      type: 'data',
      source: 'en/cv.yml',
      schema: cvSchema,
    }),
    cv_cs: defineCollection({
      type: 'data',
      source: 'cs/cv.yml',
      schema: cvSchema,
    }),
  },
})

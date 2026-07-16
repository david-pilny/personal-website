import { computed, type ComputedRef } from 'vue'

/* Category → programme slot. Slot 3 (signal) is never a category. */
export const CATEGORY_SLOT = {
  product: 0,
  client: 1,
  play: 2,
  writing: 4,
} as const

export type WorkCategory = keyof typeof CATEGORY_SLOT

/**
 * Which content collection serves the current locale.
 * cs is fully authored; ru and de fall back to en.
 */
export function useWorkCollection(): ComputedRef<'work_en' | 'work_cs'> {
  const { locale } = useI18n()
  return computed(() => (locale.value === 'cs' ? 'work_cs' : 'work_en'))
}

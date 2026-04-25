import { ref, computed, watch } from 'vue'

export function usePagination(sourceList, pageSize = 8) {
  const currentCount = ref(pageSize)
  const visibleItems = computed(() => sourceList.value.slice(0, currentCount.value))
  const hasMore = computed(() => sourceList.value.length > currentCount.value)

  function loadMore() {
    currentCount.value = Math.min(currentCount.value + pageSize, sourceList.value.length)
  }

  watch(sourceList, () => {
    currentCount.value = pageSize
  })
  return { visibleItems, loadMore, hasMore }
}

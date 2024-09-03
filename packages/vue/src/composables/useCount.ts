// useDelayedPrint.js
import { ref, onMounted, onUnmounted } from "vue";

export function useDelayedPrint() {
  const count = ref(0);

  onMounted(() => {
    // Initial value
    count.value = 0;

    // Update count after 6 seconds
    const timeoutId = setTimeout(() => {
      count.value = 3;
    }, 6000);

    // Clean up the timeout when the component is unmounted
    onUnmounted(() => {
      clearTimeout(timeoutId);
    });
  });

  return { count };
}

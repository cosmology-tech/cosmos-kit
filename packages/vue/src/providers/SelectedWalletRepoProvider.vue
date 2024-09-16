<!-- SelectedWalletRepoProvider.vue -->
<template>
  <slot />
</template>

<script setup lang="ts">
import { ref, provide, defineProps } from "vue";

const selectedWalletRepo = ref(null);

const selectWalletRepo = (repo) => {
  selectedWalletRepo.value = repo;
};

provide("selectedWalletRepo", { selectedWalletRepo, selectWalletRepo });
</script>

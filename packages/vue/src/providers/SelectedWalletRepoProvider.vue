<!-- SelectedWalletRepoProvider.vue -->
<template>
  <slot />
</template>

<script setup lang="ts">
import { ref, provide, defineProps } from "vue";

// 定义上下文的值
const selectedWalletRepo = ref<any | null>(null);

// 更新选中的钱包 Repo
const selectWalletRepo = (repo: any) => {
  selectedWalletRepo.value = repo;
};

// 提供上下文
provide("selectedWalletRepo", { selectedWalletRepo, selectWalletRepo });
</script>

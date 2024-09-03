<template>
  <div>
    <div>
      <p><strong>Chain Name:</strong> {{ chainContext.chain?.chain_name }}</p>
      <p><strong>Chain ID:</strong> {{ chainContext.chain?.chain_id }}</p>
      <p><strong>Status:</strong> {{ chainContext.status }}</p>
      <p>
        <strong>Wallet Address:</strong>
        {{ chainContext?.address || "No address connected" }}
      </p>
      <el-button @click="chainContext.openView">Open Modal</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useChain } from "./../composables/useChain";

const chainContext = useChain("cosmoshub");

console.log("useChain chainContext", chainContext);
</script>

<style scoped></style>

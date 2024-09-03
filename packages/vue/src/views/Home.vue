<template>
  <div>
    <h1>Home Page</h1>
    <div>
      <p><strong>Chain Name:</strong> {{ chainContext.chain?.chain_name }}</p>
      <p><strong>Chain ID:</strong> {{ chainContext.chain?.chain_id }}</p>
      <p>
        <strong>Wallet Address:</strong>
        {{ chainContext.address || "No address connected" }}
      </p>
      <el-button @click="chainContext.openView">Open Modal</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useChain } from "./../composables/useChain";

const chainName = "cosmoshub";
const chainContext = useChain(chainName);

console.log("chainContext", chainContext);

onMounted(() => {
  // Perform any actions needed on component mount
});
</script>

<style scoped>
/* 样式可选 */
</style>

<template>
  <div>
    <h2>Home View</h2>
    <!-- 使用 useChain composable 显示链和资产信息 -->
    <div v-if="chain">
      <h3>Chain Information</h3>
      <p><strong>Chain Name:</strong> {{ chain.chain_name }}</p>
      <p><strong>Chain ID:</strong> {{ chain.chain_id }}</p>
    </div>
    <div v-if="assets && assets.length > 0">
      <h3>Assets</h3>
      <ul>
        <li v-for="(asset, index) in assets" :key="index">
          <strong>{{ asset.name }}:</strong> {{ asset.amount }}
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No assets available.</p>
    </div>
  </div>
</template>

<script setup>
import { useChain } from "@/composables/useChain";

//use useChain composable get chain info and assets
const { chain, assets } = useChain("cosmoshub-4");

console.log(chain, assets);
</script>

<style scoped>
/* Styles for Home.vue */
h3 {
  color: #333;
  margin-bottom: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background: #f9f9f9;
  margin: 5px 0;
  padding: 10px;
  border-radius: 5px;
}
</style>

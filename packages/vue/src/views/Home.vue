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
      <el-button @click="chainContext?.openView">Open Modal</el-button>

      <!-- <el-button @click="chainsContext?.cosmoshub?.openView"
        >cosmoshub openView
      </el-button> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useChain, useChains, useChainWallet } from "./../composables";

const chainContext = useChain("cosmoshub");
// const chainsContext = useChains(["cosmoshub", "osmosis"]);
const chainWalletContext = useChainWallet("cosmoshub", "keplr-extension");

console.log("useChain:", chainContext);
// console.log("useChains:", chainsContext);
console.log("useChainWallet:", chainWalletContext);
</script>

<style scoped></style>

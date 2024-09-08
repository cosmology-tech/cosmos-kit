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
      <p>resolvedName:{{ resolvedName }}</p>
      <el-button @click="chainContext?.openView">Open Modal</el-button>

      <!-- <el-button @click="chainsContext?.cosmoshub?.openView"
        >cosmoshub openView
      </el-button> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, watchEffect } from "vue";
import {
  useChain,
  useChains,
  useChainWallet,
  useManager,
  useNameService,
} from "./../composables";

const resolvedName = ref<any>(null);
const chainContext = useChain("cosmoshub");
const serviceContext = useNameService();

// const chainsContext = useChains(["cosmoshub", "osmosis"]);
// const chainWalletContext = useChainWallet("cosmoshub", "keplr-extension");
// const managerContext = useManager();

// console.log("useChain:", chainContext);
// console.log("useChains:", chainsContext);
// console.log("useChainWallet:", chainWalletContext);
// console.log("useManager:", managerContext);

watchEffect(() => {
  if (serviceContext.ns) {
    serviceContext.ns.resolveName(chainContext.address).then((name) => {
      console.log("useNameService", serviceContext, name);
      resolvedName.value = name; // 将返回的 name 更新到 resolvedName 中
    });
  }
});
</script>

<style scoped></style>

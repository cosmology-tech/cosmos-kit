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

      <!-- <div>
        <iframe
          ref="iframeRef"
          :style="{
            width: '50%',
            height: '50vh',
            borderRadius: '4px',
          }"
          src="https://example-cosmos-kit-dapp.zone"
        ></iframe>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, watchEffect } from "vue";
import {
  useChain,
  useNameService,
  useChains,
  useChainWallet,
  useManager,
  useWallet,
  useWalletClient,
  useIframe,
} from "./../composables";

const resolvedName = ref<any>(null);
const chainContext = useChain("cosmoshub");
const serviceContext = useNameService();
// const { iframeRef } = useIframe();

// const chainsContext = useChains(["cosmoshub", "osmosis"]);
// const chainWalletContext = useChainWallet("cosmoshub", "keplr-extension");
// const managerContext = useManager();
// const walletContext = useWallet();
// const walletClientContext = useWalletClient();

// console.log("useChain:", chainContext);
// console.log("useChains:", chainsContext);
// console.log("useChainWallet:", chainWalletContext);
// console.log("useManager:", managerContext);
// console.log("useWallet", walletContext);
// console.log("useWalletClient", walletClientContext);

watchEffect(() => {
  if (serviceContext.ns) {
    serviceContext.ns.resolveName(chainContext.address).then((name) => {
      resolvedName.value = name;
    });
  }
});
</script>

<style scoped></style>

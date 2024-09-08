<template>
  <div id="app">
    <h1>Welcome to My Vue 3 App</h1>
    <ChainProvider
      :chains="chains"
      :wallets="wallets"
      :assetLists="assets"
      :walletConnectOptions="walletConnectOptions"
      :walletModal="CustomModal"
      :defaultNameService="icns"
    >
      <router-view />
    </ChainProvider>
  </div>
</template>

<script setup>
import ChainProvider from "./providers/ChainProvider.vue";
import CustomModal from "./components/CustomModal.vue";
import { assets as _assets, chains as _chains } from "chain-registry";
// import { wallets as _wallets } from "@cosmos-kit/keplr";
import { wallets as keplrExtension } from "@cosmos-kit/keplr-extension";

const chains = [..._chains];
const wallets = [...keplrExtension];
const assets = [..._assets];
const walletConnectOptions = {
  signClient: {
    projectId: "a8510432ebb71e6948cfd6cde54b70f7",
    relayUrl: "wss://relay.walletconnect.org",
    metadata: {
      name: "CosmosKit Example",
      description: "CosmosKit test dapp",
      url: "https://test.cosmoskit.com/",
      icons: [
        "https://raw.githubusercontent.com/cosmology-tech/cosmos-kit/main/packages/docs/public/favicon-96x96.png",
      ],
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

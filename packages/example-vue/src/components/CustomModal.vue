<template>
  <el-dialog
    v-model="isOpen"
    title="Choose Wallet"
    width="60%"
    style="max-width: 400px"
    @close="onCloseModal"
    class="wallet-modal"
  >
    <el-row
      v-for="wallet in walletRepo?.wallets"
      :key="wallet.walletName"
      type="flex"
      class="wallet-row"
    >
      <el-col :span="12" class="wallet-info">
        <el-image
          :src="walletRepo.chainLogo"
          style="width: 35px; height: 35px"
        />
        <span>{{ wallet.walletInfo.prettyName }}</span>
        <span class="wallet-status">{{ wallet.walletStatus }}</span>
      </el-col>
      <el-col :span="12" class="wallet-actions">
        <template v-if="wallet.walletStatus === 'Disconnected'">
          <el-button type="primary" @click="connectWallet(wallet)"
            >Connect</el-button
          >
        </template>
        <template v-else-if="wallet.walletStatus === 'NotExist'">
          <el-button type="warning">Install</el-button>
        </template>
        <template v-else-if="wallet.walletStatus === 'Connected'">
          <el-button type="success" @click="disconnectWallet(wallet)"
            >Disconnect</el-button
          >
        </template>
        <template v-else-if="wallet.walletStatus === 'Error'">
          <el-alert :title="wallet.message" type="error" />
        </template>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineProps, watch } from "vue";
import {
  ElDialog,
  ElRow,
  ElCol,
  ElButton,
  ElAlert,
  ElImage,
} from "element-plus";
import type { WalletModalProps } from "@cosmos-kit/core";

const props = defineProps<WalletModalProps>();
const isOpen = ref(props.isOpen);
const walletRepo = ref(props.walletRepo);

watch(
  () => props.isOpen,
  (newValue) => {
    isOpen.value = newValue;
  }
);

watch(
  () => props.walletRepo,
  (newValue) => {
    walletRepo.value = newValue;
  }
);

const connectWallet = (wallet) => {
  wallet.connect().then(() => {
    // 连接成功后的操作，如更新UI
    props.setOpen(false);
  });
};

const disconnectWallet = (wallet) => {
  wallet.disconnect().then(() => {
    // 断开成功后的操作，如更新UI
    props.setOpen(false);
  });
};

const onCloseModal = () => {
  props.setOpen(false);
};
</script>

<style scoped>
.wallet-modal .el-dialog__header {
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.wallet-modal .el-dialog__title {
  font-size: 18px;
  font-weight: bold;
}

.wallet-row {
  margin-bottom: 10px;
}

.wallet-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
}

.wallet-status {
  font-size: 14px;
  color: #888;
}

.wallet-actions {
  display: flex;
  justify-content: flex-end;
}

.el-button {
  margin-left: 10px;
}

.el-alert {
  margin-top: 5px;
}
</style>

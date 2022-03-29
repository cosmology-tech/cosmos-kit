import { WalletStatus } from "@keplr-wallet/stores";
import { observer } from "mobx-react-lite";
import { useStore } from "./stores";

function App() {
  const { chainStore, accountStore } = useStore();
  const account = accountStore.getAccount(chainStore.chainInfos[0].chainId);

  return (
    <div>
      {account.walletStatus === WalletStatus.Loaded ? (
        <div>
          {account.bech32Address}
          <button
            onClick={(e) => {
              e.preventDefault();
              account.disconnect();
            }}
            className="bg-transparent border border-opacity-30 border-secondary-200 h-9 w-full rounded-md py-2 px-1 flex items-center justify-center mb-8"
          >
            <p className="text-sm max-w-24 ml-3 text-secondary-200 font-semibold overflow-x-hidden truncate transition-all">
              Sign Out
            </p>
          </button>
        </div>
      ) : (
        <button
          className="flex items-center justify-center w-full h-9 py-3.5 rounded-md bg-primary-200 mb-8"
          onClick={(e) => {
            e.preventDefault();
            account.init();
          }}
        >
          <span className="ml-2.5 text-white-high font-semibold">
            Connect Wallet
          </span>
        </button>
      )}
    </div>
  );
}

export default observer(App);
